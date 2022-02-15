import {
  RequiredStringValidator,
  ValidationBuilder
} from '@/application/validation'

describe('ValidatorBuilder', () => {
  it('Should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder.of({
      value: 'any_value',
      fildName: 'any_field'
    })
      .required()
      .build()

    expect(validators).toEqual([
      new RequiredStringValidator('any_value', 'any_field')
    ])
  })
})
