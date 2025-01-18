import { AuthService } from "services/AuthService/AuthService";
import { instance, when, reset, verify } from "ts-mockito";
import { SignInExceptions, TokenExceptions } from "services/AuthService/AuthExceptions";
import assert from "assert";
import { userRepositoryMock } from "../mocks/repositories.mock";
import { passwordHasherMock } from "../mocks/services.mock";
import { propertiesInstance } from "../mocks/utils.mock";
import { Roules } from "entities/user/Roule";
import jwt from 'jsonwebtoken'

// Create AuthService instance with mocks
const authService = new AuthService(
  propertiesInstance,
  instance(userRepositoryMock),
  instance(passwordHasherMock)
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

      const result = await authService.signIn({ username: "test", password: "password" })

      assert(result.ok)
      assert(result.value.accessToken)
      assert(result.value.refreshToken)
    })

  })

  describe("refreshTokens", () => {

    it("should return EXPIRES_TOKEN if the refresh token is expired", async () => {
      const expiredToken = jwt.sign({}, propertiesInstance.env.JWT_SECRET, { expiresIn: "-1s" })

      const result = await authService.refreshTokens(expiredToken)

      assert(!result.ok)
      result.err.case(TokenExceptions.EXPIRES_TOKEN, () => assert(true))
    })

    it("should return INVALID_TOKEN if the refresh token is invalid", async () => {
      const invalidToken = "invalid-token"

      const result = await authService.refreshTokens(invalidToken)

      assert(!result.ok)
      result.err.case(TokenExceptions.INVALID_TOKEN, () => assert(true))
    })

    it("should delete all saved user refresh Token if the refresh token already been used", async () => {
      const refreshTokenData = { id: 1, userId: 1 }
      const alreadyUsedToken = jwt.sign(refreshTokenData, propertiesInstance.env.JWT_SECRET, { expiresIn: "10s" })

      when(userRepositoryMock.getTokenById(1)).thenResolve(null)

      const result = await authService.refreshTokens(alreadyUsedToken)


      assert(!result.ok)
      verify(userRepositoryMock.deleteTokensByUserId(1)).once()
      result.err.case(TokenExceptions.INVALID_TOKEN, () => assert(true))
    })

    it("should return new access and refresh tokens if the refresh token is valid", async () => {
      const user = { id: 1, username: "test", password: "hashed", roule: Roules.ADMIN, displayName: '' }
      const token = { id: 1, userId: 1, user }
      const refreshToken = jwt.sign({ id: 1, userId: 1 }, propertiesInstance.env.JWT_SECRET, { expiresIn: "1d" })

      when(userRepositoryMock.getTokenById(1)).thenResolve(token)
      when(userRepositoryMock.createToken(1)).thenResolve({ id: 2, userId: 1 })

      const result = await authService.refreshTokens(refreshToken)

      assert(result.ok)
      verify(userRepositoryMock.deleteTokenById(1)).once()
      assert(result.value.accessToken)
      assert(result.value.refreshToken)
    })

  })

  describe("verifyToken", () => {
    it("should return EXPIRES_TOKEN if the token is expired", async () => {
      const expiredToken = jwt.sign({}, propertiesInstance.env.JWT_SECRET, { expiresIn: "-1s" })

      const result = await authService.verifyToken(expiredToken)

      assert(!result.ok)
      result.err.case(TokenExceptions.EXPIRES_TOKEN, () => assert(true))
    })

    it("should return INVALID_TOKEN if the token is invalid", async () => {
      const invalidToken = "invalid-token"

      const result = await authService.verifyToken(invalidToken)

      assert(!result.ok)
      result.err.case(TokenExceptions.INVALID_TOKEN, () => assert(true))
    })

    it("should return INVALID_TOKEN if the token data schema is invalid", async () => {
      const invalidAccessTokenData = {}
      const invalidToken = jwt.sign(invalidAccessTokenData, propertiesInstance.env.JWT_SECRET, { expiresIn: "1h" })

      const result = await authService.verifyToken(invalidToken)

      assert(!result.ok)
      result.err.case(TokenExceptions.INVALID_TOKEN, () => assert(true))
    })

    it("should return access token data if the token is valid", async () => {
      const accessTokenData = { id: 1, username: "test", displayName: "Test User", roule: "ADMIN" }
      const validToken = jwt.sign(accessTokenData, propertiesInstance.env.JWT_SECRET, { expiresIn: "1h" })

      const result = await authService.verifyToken(validToken)

      assert(result.ok)
      assert.deepStrictEqual(result.value, accessTokenData)
    })
  })

})
