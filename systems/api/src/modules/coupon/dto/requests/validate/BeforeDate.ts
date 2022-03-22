import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class BeforeDate implements ValidatorConstraintInterface {
  validate(currentValue: Date, validationArguments: ValidationArguments) {
    const currentObject: {
      [key: string]: any;
    } = validationArguments.object;
    const comparingFieldValue =
      currentObject[validationArguments.constraints[0] as string];
    if (!comparingFieldValue) return true;
    return (
      new Date(currentValue).getTime() < new Date(comparingFieldValue).getTime()
    );
  }
}
