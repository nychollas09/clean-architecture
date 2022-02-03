export namespace HttpClient {
  export type Params = {
    url: string
    queryParams: { [key: string]: string }
  }
  export type Result = any
}

export interface HttpClient {
  get: (params: HttpClient.Params) => Promise<HttpClient.Result>
}
