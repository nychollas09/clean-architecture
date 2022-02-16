import { AxiosHttpClient } from '@/infrastructure/http'

export const makeAxiosHttpClient = (): AxiosHttpClient => new AxiosHttpClient()
