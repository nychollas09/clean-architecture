import { HttpClient } from '.'
import axios from 'axios'

export class AxiosHttpClient implements HttpClient {
  public async get<R = any>(args: HttpClient.Params): Promise<R> {
    const result = await axios.get(args.url, { params: args.queryParams })
    return result.data
  }
}
