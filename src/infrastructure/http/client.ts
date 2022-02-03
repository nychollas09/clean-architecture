export namespace HttpClient {
  export type Params = {
    url: string
    queryParams: { [key: string]: string }
  }
}

export interface HttpClient {
  get: <R>(params: HttpClient.Params) => Promise<R>
}
