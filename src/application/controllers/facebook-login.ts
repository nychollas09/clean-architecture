import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RequiredFieldException } from '../exceptions'
import {
  badRequest,
  HttpResponse,
  serverErrorRequest,
  succeedRequest,
  unathorizedRequest
} from '../helpers'

type SucceedData = { accessToken: string }

type HttpRequest = {
  token: string | undefined | null
}

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (
        httpRequest.token === '' ||
        httpRequest.token === null ||
        httpRequest.token === undefined
      ) {
        return badRequest(new RequiredFieldException('token'))
      }

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
}
