export namespace TokenGenerator {
  export type Params = {
    key: string
    expirationInMs: number
  }
  export type Result = Promise<string>
}

export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => TokenGenerator.Result
}
