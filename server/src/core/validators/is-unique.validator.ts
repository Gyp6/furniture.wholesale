import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments) {
    const [model, property] = args.constraints;

    // Використовуємо type assertion для динамічного доступу
    const delegate = this.prisma[model.toLowerCase() as keyof PrismaService];

    if (!delegate || typeof delegate !== 'object') {
      return false;
    }

    const record = await (delegate as any).findFirst({
      where: { [property]: value },
    });

    return !record; // true якщо запису немає (унікальний)
  }

  defaultMessage(args: ValidationArguments) {
    const [, property] = args.constraints;
    return `${property} already exists`;
  }
}

export function IsUnique(
  model: string,
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [model, property],
      validator: IsUniqueConstraint,
    });
  };
}
