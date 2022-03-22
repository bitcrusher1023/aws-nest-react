import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class AfterDate implements ValidatorConstraintInterface {
  validate(currentValue: Date, validationArguments: ValidationArguments) {
    const [{ minDate }] = validationArguments.constraints;
    if (!minDate) return true;
    return new Date(currentValue).getTime() > new Date(minDate).getTime();
  }
}
