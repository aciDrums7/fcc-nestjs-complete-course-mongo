import { ValidationOptions, registerDecorator } from 'class-validator';

export function AreUniqueMongoIds(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUniqueMongoIds',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const valueAsSet = new Set(value);
          return value.length === valueAsSet.size;
        },
        defaultMessage() {
          return `each value in ${propertyName} must be a unique mongodb id`;
        },
      },
    });
  };
}
