import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RequiredFieldException, ServerException } from '../exceptions'
import { badRequest, HttpResponse } from '../helpers'

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
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
        return { statusCode: 200, data: { accessToken: result.value } }
      }

      return { statusCode: 401, data: result }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerException(error as Error)
      }
    }
  }
}
