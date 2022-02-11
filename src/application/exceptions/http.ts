export class ServerException extends Error {
  constructor(error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerException'
    this.stack = error?.stack
  }
}

export class RequiredFieldException extends Error {
  constructor(fieldName: string) {
    super(`The field ${fieldName} is required`)
    this.name = 'RequiredFieldException'
  }
}
