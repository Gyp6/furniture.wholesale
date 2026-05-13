import { NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

import { AppAbility } from '@/infrastructure/casl/casl.ability-factory';

import { OtpService } from '../../otp/otp.service';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';

const findByIdMock = mock(() => Promise.resolve(null as any));
const updateByIdMock = mock(() => Promise.resolve(null as any));
const sendCodeMock = mock(async () => {});
const verifyOtpMock = mock(async () => {});

const mockUserRepository = {
  findById: findByIdMock,
  updateById: updateByIdMock,
} as unknown as UserRepository;

const mockOtpService = {
  sendCode: sendCodeMock,
  verify: verifyOtpMock,
} as unknown as OtpService;

const createAbility = (canAction: boolean): AppAbility =>
  ({
    cannot: mock(() => !canAction),
    can: mock(() => canAction),
  }) as unknown as AppAbility;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    findByIdMock.mockClear();
    findByIdMock.mockImplementation(() => Promise.resolve(null));

    updateByIdMock.mockClear();
    updateByIdMock.mockImplementation(() => Promise.resolve(null));

    userService = new UserService(mockUserRepository, mockOtpService);
  });

  describe('getProfile()', () => {
    it('має кидати NotFoundException, якщо юзера не існує', () => {
      findByIdMock.mockResolvedValue(null);
      const ability = createAbility(true);

      expect(userService.getProfile('1', ability)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('має повертати юзера, якщо все ок', async () => {
      const mockUser = { id: '1', email: 'test@test.com' } as any;

      findByIdMock.mockResolvedValue(mockUser);

      const ability = createAbility(true);

      const result = await userService.getProfile('1', ability);
      expect(result).toEqual(mockUser as User);
    });
  });

  describe('verifyEmail()', () => {
    it('має верифікувати email та оновити статус юзера', async () => {
      const mockUser = { id: '1', email: 'test@test.com' } as any;
      const updatedUser = { ...mockUser, emailVerified: true };

      findByIdMock.mockResolvedValue(mockUser);
      updateByIdMock.mockResolvedValue(updatedUser);
      verifyOtpMock.mockResolvedValue(undefined);

      const ability = createAbility(true);

      const result = await userService.verifyEmail(
        '1',
        'test@test.com',
        '123456',
        ability,
      );

      expect(updateByIdMock).toHaveBeenCalledWith('1', { emailVerified: true });
      expect(result.user.emailVerified).toBe(true);
    });
  });
});
