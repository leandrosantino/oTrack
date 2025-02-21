import { AuthService } from "services/AuthService/AuthService";
import { instance, when, reset, verify } from "ts-mockito";
import { SignInExceptions } from "services/AuthService/AuthExceptions";
import assert from "assert";
import { userRepositoryMock } from "../mocks/repositories.mock";
import { jwtServiceMock, passwordHasherMock } from "../mocks/services.mock";
import { propertiesInstance } from "../mocks/utils.mock";
import { Roules } from "entities/user/Roule";
import { TokenExceptions } from "services/JwtService/TokenException";

// Create AuthService instance with mocks
const authService = new AuthService(
  instance(userRepositoryMock),
  instance(passwordHasherMock),
  instance(jwtServiceMock)
)

describe("AuthService", () => {
  beforeEach(() => {
    reset(userRepositoryMock)
    reset(passwordHasherMock)
  })

  describe("signIn", () => {

    it("should return USER_NOT_FOUND if the user does not exist", async () => {
      when(userRepositoryMock.getByUsername("nonexistent")).thenResolve(null)

      const result = await authService.signIn({ username: "nonexistent", password: "password" })

      assert(!result.ok)
      result.err.case(SignInExceptions.USER_NOT_FOUND, () => assert(true))
    })

    it("should return INVALID_PASSWORD if the password is incorrect", async () => {
      const user = { id: 1, username: "test", password: "hashed", roule: Roules.ADMIN, displayName: '' }

      when(userRepositoryMock.getByUsername("test")).thenResolve(user)
      when(passwordHasherMock.verify("wrongpassword", "hashed")).thenResolve(false)

      const result = await authService.signIn({ username: "test", password: "wrongpassword" })

      assert(!result.ok)
      result.err.case(SignInExceptions.INVALID_PASSWORD, () => assert(true))
    })

    it("should return access and refresh tokens if sign-in is successful", async () => {
      const user = { id: 1, username: "test", password: "hashed", roule: Roules.ADMIN, displayName: '' }
      const token = { id: 1, userId: 1 }

      when(userRepositoryMock.getByUsername("test")).thenResolve(user)
      when(passwordHasherMock.verify("password", "hashed")).thenResolve(true)
      when(userRepositoryMock.createToken(1)).thenResolve(token)
      when(jwtServiceMock.generateAccessToken).thenReturn(() => 'accessToken')
      when(jwtServiceMock.generateRefreshToken).thenReturn(() => 'refreshToken')

      const result = await authService.signIn({ username: "test", password: "password" })

      assert(result.ok)
      assert.equal(result.value.accessToken, 'accessToken')
      assert.equal(result.value.refreshToken, 'refreshToken')
    })

  })

  describe("refreshTokens", () => {

    it("should return EXPIRED_TOKEN and run signOut if the refresh token is expired", async () => {
      const expiredToken = 'expiredRefreshToken'

      when(jwtServiceMock.verify('expiredRefreshToken')).thenResolve(Err(TokenExceptions.EXPIRED_TOKEN))
      when(jwtServiceMock.decode('expiredRefreshToken')).thenResolve(Ok({ id: 1, userId: 2 }))
      when(userRepositoryMock.deleteTokenById(1)).thenResolve(true)

      const result = await authService.refreshTokens(expiredToken)

      assert(!result.ok)
      verify(userRepositoryMock.deleteTokenById(1)).once()
      verify(jwtServiceMock.decode('expiredRefreshToken')).once()
      result.err.case(TokenExceptions.EXPIRED_TOKEN, () => assert(true))
    })

    it("should return INVALID_TOKEN if the refresh token is invalid", async () => {
      when(jwtServiceMock.verify('invalidToken')).thenResolve(Err(TokenExceptions.INVALID_TOKEN))

      const result = await authService.refreshTokens('invalidToken')

      assert(!result.ok)
      result.err.case(TokenExceptions.INVALID_TOKEN, () => assert(true))
    })

    it("should delete all saved user refresh Token if the refresh token already been used", async () => {
      const refreshTokenData = { id: 1, userId: 1 }

      when(jwtServiceMock.verify('alreadyUsedToken')).thenResolve(Ok(refreshTokenData))
      when(userRepositoryMock.getTokenById(1)).thenResolve(null)

      const result = await authService.refreshTokens('alreadyUsedToken')


      assert(!result.ok)
      verify(userRepositoryMock.deleteTokensByUserId(1)).once()
      result.err.case(TokenExceptions.INVALID_TOKEN, () => assert(true))
    })

    it("should return new access and refresh tokens if the refresh token is valid", async () => {
      const user = { id: 1, username: "test", password: "hashed", roule: Roules.ADMIN, displayName: '' }
      const token = { id: 1, userId: 1, user }
      const createdToken = { id: 2, userId: 1 }

      when(jwtServiceMock.verify('refreshToken')).thenResolve(Ok(token))
      when(userRepositoryMock.getTokenById(1)).thenResolve(token)
      when(userRepositoryMock.createToken(1)).thenResolve(createdToken)

      when(jwtServiceMock.generateAccessToken).thenReturn(() => 'accessToken')
      when(jwtServiceMock.generateRefreshToken).thenReturn(() => 'refreshToken')

      const result = await authService.refreshTokens('refreshToken')

      assert(result.ok)
      verify(userRepositoryMock.deleteTokenById(1)).once()
      assert.equal(result.value.accessToken, 'accessToken')
      assert.equal(result.value.refreshToken, 'refreshToken')
    })

  })

  describe("verifyToken", () => {
    it("should return EXPIRES_TOKEN if the token is expired", async () => {
      when(jwtServiceMock.verify('expiredToken')).thenResolve(Err(TokenExceptions.EXPIRED_TOKEN))

      const result = await authService.verifyToken('expiredToken')

      assert(!result.ok)
      result.err.case(TokenExceptions.EXPIRED_TOKEN, () => assert(true))
    })

    it("should return INVALID_TOKEN if the token is invalid", async () => {
      when(jwtServiceMock.verify('invalidToken')).thenResolve(Err(TokenExceptions.INVALID_TOKEN))

      const result = await authService.verifyToken('invalidToken')

      assert(!result.ok)
      result.err.case(TokenExceptions.INVALID_TOKEN, () => assert(true))
    })

    it("should return INVALID_TOKEN if the token data schema is invalid", async () => {
      when(jwtServiceMock.verify('invalidToken')).thenResolve(Ok({}))

      const result = await authService.verifyToken('invalidToken')

      assert(!result.ok)
      result.err.case(TokenExceptions.INVALID_TOKEN, () => assert(true))
    })

    it("should return access token data if the token is valid", async () => {
      const accessTokenData = { id: 1, username: "test", displayName: "Test User", roule: "ADMIN" }
      when(jwtServiceMock.verify('validToken')).thenResolve(Ok(accessTokenData))

      const result = await authService.verifyToken('validToken')

      assert(result.ok)
      assert.deepStrictEqual(result.value, accessTokenData)
    })
  })


  describe('signOut', () => {

    it('Should delete refresh token reference of database', async () => {
      when(jwtServiceMock.decode('refreshToken')).thenResolve(Ok({ id: 1, userId: 2 }))
      when(userRepositoryMock.deleteTokenById(1)).thenResolve(true)
      await authService.signOut('refreshToken')
      verify(userRepositoryMock.deleteTokenById(1)).once()
    })

    it('Should return void if recive a invalid refresh token', async () => {
      when(jwtServiceMock.decode('refreshToken')).thenResolve(Err(TokenExceptions.INVALID_TOKEN))
      await authService.signOut('refreshToken')
      verify(userRepositoryMock.deleteTokenById(1)).never()
    })

  })

})

