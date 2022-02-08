import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken<T>(
    params: TokenGenerator.Params<T>
  ): TokenGenerator.Result {
    return jwt.sign(params.payload as unknown as object, this.secret, {
      expiresIn: `${params.expirationInMs}ms`
    })
  }
}
