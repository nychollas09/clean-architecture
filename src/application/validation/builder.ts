import { RequiredStringValidator, Validator } from '@/application/validation'

type Params = {
  value: string
  fildName: string
}

export class ValidationBuilder {
  private constructor(
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  public static of(params: Params): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fildName)
  }

  public required(): ValidationBuilder {
    this.validators.push(
      new RequiredStringValidator(this.value, this.fieldName)
    )

    return this
  }

  public build(): Validator[] {
    return this.validators
  }
}
