import { RequiredFieldException } from '../exceptions'

export class RequiredStringValidator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  public validate(): RequiredFieldException | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new RequiredFieldException(this.fieldName)
    }
  }
}
