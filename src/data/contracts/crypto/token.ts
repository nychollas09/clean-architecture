export namespace TokenGenerator {
  export type Params<T = any> = {
    payload: T
    expirationInMs: number
  }
  export type Result = Promise<string>
}

export interface TokenGenerator {
  generateToken: <T>(params: TokenGenerator.Params<T>) => TokenGenerator.Result
}
