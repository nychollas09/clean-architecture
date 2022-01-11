export interface CreateFacebookAccountRepository {
  createFromFacebook: (
    params: CreateFacebookAccountRepository.Params
  ) => Promise<CreateFacebookAccountRepository.Result>
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    email: string
    name: string
    facebookId: string
  }

  export type Result = undefined
}

export interface UpdateFacebookAccountRepository {
  updateWithFacebook: (
    params: UpdateFacebookAccountRepository.Params
  ) => Promise<UpdateFacebookAccountRepository.Result>
}

export namespace UpdateFacebookAccountRepository {
  export type Params = {
    id: string
    name: string
    facebookId: string
  }

  export type Result = undefined
}
