type FacebookAccountData = {
  name: string
  email: string
  facebookId: string
}

type UserAccountData = {
  id?: string
  name?: string
}

export class FacebookAccount {
  public id?: string
  public name?: string
  public email!: string
  public facebookId: string

  constructor(
    facebookAccountData: FacebookAccountData,
    userAccountData?: UserAccountData
  ) {
    this.id = userAccountData?.id
    this.name = userAccountData?.name ?? facebookAccountData.name
    this.email = facebookAccountData.email
    this.facebookId = facebookAccountData.facebookId
  }
}
