export namespace HttpClient {
  export type Params = {
    url: string
    queryParams?: { [key: string]: string }
  }
}

export interface HttpClient {
  get: <R = any>(params: HttpClient.Params) => Promise<R>
}
