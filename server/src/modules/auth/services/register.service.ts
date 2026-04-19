import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from '@thallesp/nestjs-better-auth';

import type { Auth } from '@/core/lib/auth.instance';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { CompanyRepository } from '@/modules/company/company.repository';
import { UserRepository } from '@/modules/user/user.repository';

import { OtpService } from '../../otp/otp.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly authService: AuthService<Auth>,
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly otp: OtpService,
  ) {}

  async registerRetailer(dto: any) {
    if (dto.role === Role.ADMIN) {
      throw new ForbiddenException(
        'Admin registration is not allowed through this endpoint',
      );
    }

    if (!dto.companyName || !dto.taxId) {
      throw new BadRequestException('Invalid credentials');
    }

    return await this.prisma.$transaction(async tx => {
      const company = await this.companyRepository.create(
        {
          name: dto.companyName,
          taxId: dto.taxId,
        },
        tx,
      );

      const result = await (this.authService.api as any).signUpEmail({
        body: {
          email: dto.email,
          password: dto.password,
          name: dto.name,
          // role: 'RETAILER',
        },
      });

      if (!result?.user) {
        throw new InternalServerErrorException(
          'Better Auth registration failed',
        );
      }

      const updatedUser = await this.userRepository.updateById(
        result.user.id,
        {
          role: dto.role as Role,
          company: {
            connect: { id: company.id },
          },
        },
        tx,
      );

      await this.otp.sendCode(dto.email);

      return updatedUser;
    });
  }
}
