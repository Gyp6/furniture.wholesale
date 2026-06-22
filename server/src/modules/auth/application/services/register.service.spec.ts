import 'reflect-metadata';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { RegisterService } from './register.service';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { OtpService } from '@/infrastructure/otp/otp.service';
import { IsUniqueConstraint } from '@/common/validators/is-unique.validator';
import {
  COMPANY_REPOSITORY,
  type ICompanyRepository,
  type IProfileRepository,
  PROFILE_REPOSITORY,
} from '@/modules/identity/domain/contracts';

describe('RegisterService', () => {
  let service: RegisterService;
  let companyRepository: ICompanyRepository;
  let profileRepository: IProfileRepository;
  let otpService: OtpService;
  let prismaService: PrismaService;

  const mockCompanyRepository = {
    findByTaxCode: mock((taxCode: string, tx?: any) => Promise.resolve(null as any)),
    findByAbbreviation: mock((abbr: string, tx?: any) => Promise.resolve(null as any)),
    create: mock((dto: any, tx?: any) => Promise.resolve(null as any)),
  };

  const mockProfileRepository = {
    create: mock((dto: any, tx?: any) => Promise.resolve(null as any)),
  };

  const mockOtpService = {
    sendCode: mock((email: string) => Promise.resolve()),
  };

  const mockPrismaService = {
    $transaction: mock((cb: (tx: any) => Promise<any>) => cb('mock-tx-client')),
    user: {
      findFirst: mock(() => Promise.resolve(null as any)),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        IsUniqueConstraint,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: OtpService, useValue: mockOtpService },
        { provide: COMPANY_REPOSITORY, useValue: mockCompanyRepository },
        { provide: PROFILE_REPOSITORY, useValue: mockProfileRepository },
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });

    service = module.get<RegisterService>(RegisterService);
    companyRepository = module.get<ICompanyRepository>(COMPANY_REPOSITORY);
    profileRepository = module.get<IProfileRepository>(PROFILE_REPOSITORY);
    otpService = module.get<OtpService>(OtpService);
    prismaService = module.get<PrismaService>(PrismaService);

    mockCompanyRepository.findByTaxCode.mockClear();
    mockCompanyRepository.findByAbbreviation.mockClear();
    mockCompanyRepository.create.mockClear();
    mockProfileRepository.create.mockClear();
    mockOtpService.sendCode.mockClear();
    mockPrismaService.$transaction.mockClear();
  });

  describe('beforeSignUp', () => {
    it('should validate valid sign-up parameters successfully', async () => {
      const mockContext = {
        body: {
          type: 'RETAILER',
          email: 'newuser@example.com',
          password: 'Password123',
          name: 'Jane Doe',
          companyName: 'Chairs Ltd',
          taxCode: '87654321',
          specialisations: ['Furniture'],
        },
        error: mock((status, details) => new Error(details.message)),
      };

      await service.beforeSignUp(mockContext as any);
    });

    it('should fail validation if email is invalid', async () => {
      const mockContext = {
        body: {
          type: 'RETAILER',
          email: 'invalid-email',
          password: 'Password123',
          name: 'Jane Doe',
          companyName: 'Chairs Ltd',
          taxCode: '87654321',
          specialisations: ['Furniture'],
        },
        error: mock((status, details) => new Error(details.message)),
      };

      await expect(service.beforeSignUp(mockContext as any)).rejects.toThrow();
    });
  });

  describe('afterSignUp & background registration task', () => {
    it('should quickly return and trigger background registration', async () => {
      const mockContext = {
        body: {
          companyName: 'Cool Tables',
          taxCode: '11111111',
          specialisations: ['Tables'],
        },
        context: {
          newSession: {
            user: {
              id: 'new-user-id',
              email: 'new@example.com',
            },
          },
        },
      };

      // Mock existing company exists
      const mockCompany = { id: 'company-id', name: 'Cool Tables', taxCode: '11111111' };
      mockCompanyRepository.findByTaxCode.mockImplementation(() => Promise.resolve(mockCompany));

      // Invoke afterSignUp
      service.afterSignUp(mockContext as any);

      // Wait a tick for async handler to run
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(companyRepository.findByTaxCode).toHaveBeenCalledWith('11111111', 'mock-tx-client');
      expect(profileRepository.create).toHaveBeenCalledWith(
        {
          user: { connect: { id: 'new-user-id' } },
          company: { connect: { id: 'company-id' } },
        },
        'mock-tx-client',
      );
      expect(otpService.sendCode).toHaveBeenCalledWith('new@example.com');
    });

    it('should create new company with unique abbreviation if not exists', async () => {
      const mockContext = {
        body: {
          companyName: 'Unique Sofa Corp',
          taxCode: '22222222',
          specialisations: ['Sofa'],
        },
        context: {
          newSession: {
            user: {
              id: 'new-user-id',
              email: 'new@example.com',
            },
          },
        },
      };

      mockCompanyRepository.findByTaxCode.mockImplementation(() => Promise.resolve(null));
      // First check for abbreviation 'USC' returns existing company, next check returns null to test loop
      let callCount = 0;
      mockCompanyRepository.findByAbbreviation.mockImplementation((abbr) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ id: 'existing' } as any);
        }
        return Promise.resolve(null);
      });

      const newCompany = { id: 'new-company-id', name: 'Unique Sofa Corp', taxCode: '22222222' };
      mockCompanyRepository.create.mockImplementation(() => Promise.resolve(newCompany));

      // Invoke
      service.afterSignUp(mockContext as any);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(companyRepository.findByTaxCode).toHaveBeenCalledWith('22222222', 'mock-tx-client');
      // Abbreviation generated for "Unique Sofa Corp" starts with "US"
      // Loop: USC is taken, so USC1, etc.
      expect(companyRepository.findByAbbreviation).toHaveBeenCalledTimes(2);
      expect(companyRepository.create).toHaveBeenCalledWith(
        {
          name: 'Unique Sofa Corp',
          abbreviation: 'US1', // baseCode length 2 is slice of USC, adding 1
          taxCode: '22222222',
          specializations: ['Sofa'],
        },
        'mock-tx-client',
      );
      expect(profileRepository.create).toHaveBeenCalledWith(
        {
          user: { connect: { id: 'new-user-id' } },
          company: { connect: { id: 'new-company-id' } },
        },
        'mock-tx-client',
      );
    });
  });
});
