import { badRequest, HttpResponse, serverErrorRequest } from '../helpers'
import { ValidationComposite, Validator } from '../validation'

export abstract class Controller {
  public async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)

    if (error !== undefined) return badRequest(error)

    try {
      return await this.perform(httpRequest)
    } catch (error) {
      return serverErrorRequest(error as Error)
    }
  }

  private validate(httpRequest: any): Error | undefined {
    return new ValidationComposite(this.buildValidators(httpRequest)).validate()
  }

  protected buildValidators(httpRequest: any): Validator[] {
    return []
  }

  abstract perform(httpRequest: any): Promise<HttpResponse>
}
