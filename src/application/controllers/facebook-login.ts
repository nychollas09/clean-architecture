import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { HttpResponse, succeedRequest, unathorizedRequest } from '../helpers'
import { ValidationBuilder, Validator } from '../validation'
import { Controller } from './controller'

type SucceedData = { accessToken: string }

type HttpRequest = {
  token: string
}

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse> {
    const result = await this.facebookAuthentication.perform({
      token: httpRequest.token
    })

    if (result instanceof AccessToken) {
      return succeedRequest<SucceedData>({ accessToken: result.value })
    }

    return unathorizedRequest()
  }

  override buildValidators({ token }: HttpRequest): Validator[] {
    return ValidationBuilder.of({ value: token, fildName: 'token' })
      .required()
      .build()
  }
}
