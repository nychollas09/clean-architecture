import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import {
  badRequest,
  HttpResponse,
  serverErrorRequest,
  succeedRequest,
  unathorizedRequest
} from '../helpers'
import { RequiredStringValidator, ValidationComposite } from '../validation'

type SucceedData = { accessToken: string }

type HttpRequest = {
  token: string
}

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validate(httpRequest)

      if (error !== undefined) return badRequest(error)

      const result = await this.facebookAuthentication.perform({
        token: httpRequest.token
      })

      if (result instanceof AccessToken) {
        return succeedRequest<SucceedData>({ accessToken: result.value })
      }

      return unathorizedRequest()
    } catch (error) {
      return serverErrorRequest(error as Error)
    }
  }

  private validate(httpRequest: HttpRequest): Error | undefined {
    return new ValidationComposite([
      new RequiredStringValidator(httpRequest.token, 'token')
    ]).validate()
  }
}
