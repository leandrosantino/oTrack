import { JsonWebTokenProvider } from "services/TokenProvider/JsonWebTokenProvider";
import { propertiesInstance } from "../mocks/utils.mock";
import jwt from 'jsonwebtoken'
import { TokenExceptions } from "entities/user/exceptions/TokenException";

class MockJsonWebTokenError extends Error {
  name = 'JsonWebTokenError';
  constructor(message: string) {
    super(message);
  }
}
class MockTokenExpiredError extends MockJsonWebTokenError {
  name = 'TokenExpiredError';
  constructor(message: string, public expiredAt: Date) {
    super(message);
  }
}

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
  TokenExpiredError: class MockJsonWebTokenError extends Error {
    name = 'JsonWebTokenError';
    constructor(message: string) {
      super(message);
    }
  },
  JsonWebTokenError: class MockTokenExpiredError extends Error {
    name = 'TokenExpiredError';
    constructor(message: string, public expiredAt: Date) {
      super(message);
    }
  }
}));

const jwtService = new JsonWebTokenProvider(
  propertiesInstance
)

describe('JwtService', () => {

  describe('verify', () => {

    it('should return INVALID_TOKEN if token is invalid', async () => {

      (jwt.verify as jest.Mock).mockImplementation((_, __, callback) => {
        callback(new jwt.JsonWebTokenError('Invalid token'), null);
      })

      const result = await jwtService.verify('invalidToken')

      expect(result).toEqual(Err(TokenExceptions.INVALID_TOKEN))
      expect(jwt.verify).toHaveBeenCalledWith('invalidToken', propertiesInstance.env.JWT_SECRET, expect.any(Function));
    })

    it('should return EXPIRES_TOKEN if token is expired', async () => {

      (jwt.verify as jest.Mock).mockImplementation((_, __, callback) => {
        callback(new jwt.TokenExpiredError('', new Date()), null);
      })

      const result = await jwtService.verify('expiredToken')

      expect(result).toEqual(Err(TokenExceptions.EXPIRED_TOKEN))
      expect(jwt.verify).toHaveBeenCalledWith('expiredToken', propertiesInstance.env.JWT_SECRET, expect.any(Function));
    })


    it('should return token dada when the token is valid', async () => {

      const decodedData = { userId: 123 };
      (jwt.verify as jest.Mock).mockImplementation((_, __, callback) => {
        callback(null, decodedData);
      })

      const result = await jwtService.verify('validToken')

      expect(result).toEqual(Ok(decodedData));
      expect(jwt.verify).toHaveBeenCalledWith('validToken', propertiesInstance.env.JWT_SECRET, expect.any(Function));
    })

  })

  describe('generateAccessToken', () => {

    it('should return successfully Access Token', () => {

      (jwt.sign as jest.Mock).mockReturnValue('accessToken')

      const accessToken = jwtService.generateAccessToken({})

      expect(accessToken).toEqual('accessToken')
      expect(jwt.sign).toHaveBeenCalledWith({}, propertiesInstance.env.JWT_SECRET, { expiresIn: propertiesInstance.env.ACCESS_TOKEN_EXPIRES })

    })

  })

  describe('generateRefreshToken', () => {

    it('should return successfully Refresh Token', () => {

      (jwt.sign as jest.Mock).mockReturnValue('refreshToken')

      const accessToken = jwtService.generateRefreshToken({})

      expect(accessToken).toEqual('refreshToken')
      expect(jwt.sign).toHaveBeenCalledWith({}, propertiesInstance.env.JWT_SECRET, { expiresIn: propertiesInstance.env.REFRESH_TOKEN_EXPIRES })

    })

  })

  describe('decode', () => {

    it('Should return token payload decoded', async () => {

      (jwt.decode as jest.Mock).mockReturnValue({})

      const decoded = await jwtService.decode('token')
      expect(decoded).toStrictEqual(Ok({}))
      expect(jwt.decode).toHaveBeenCalledWith('token')
    })

    it('Should return INVALID_TOKEN if recive a invalid token', async () => {

      (jwt.decode as jest.Mock).mockReturnValue(null)

      const decoded = await jwtService.decode('token')
      expect(decoded).toStrictEqual(Err(TokenExceptions.INVALID_TOKEN))
      expect(jwt.decode).toHaveBeenCalledWith('token')
    })

  })

})
