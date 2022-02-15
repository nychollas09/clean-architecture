import { RequiredFieldException } from '@/application/exceptions'
import { RequiredStringValidator } from '@/application/validation'

describe('RequiredStringValidator', () => {
  it('Should return RequiredFieldException if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldException('any_field'))
  })

  it('Should return RequiredFieldException if value is null', () => {
    const sut = new RequiredStringValidator(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldException('any_field'))
  })

  it('Should return RequiredFieldException if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldException('any_field'))
  })

  it('Should return undefined if value is not empty', () => {
    const sut = new RequiredStringValidator('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
