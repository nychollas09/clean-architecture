export class AuthenticationException extends Error {
  constructor() {
    super('Authentication failed')
    this.name = 'AuthenticationException'
  }
}
