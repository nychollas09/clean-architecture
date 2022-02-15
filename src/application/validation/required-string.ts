import { Validator } from '@/application/validation'
import { RequiredFieldException } from '../exceptions'

export class RequiredStringValidator implements Validator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  public validate(): Error | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new RequiredFieldException(this.fieldName)
    }
  }
}
