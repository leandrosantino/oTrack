import { SignIn } from "authentication/usecases/SignIn";
import { AuthController } from "./auth.controller"
import { mock, instance, when, anything, verify, deepEqual, reset } from "ts-mockito";
import { GenerateWebSocketTicket } from "authentication/usecases/GenerateWebSocketTicket";
import { RefreshTokens } from "authentication/usecases/RefreshTokens";
import { SignInWithGoogle } from "authentication/usecases/SignInWithGoogle";
import { SignOut } from "authentication/usecases/SignOut";
import { SignUp } from "authentication/usecases/SignUp";
import { Logger } from "shared/services/Logging/Logger";
import { SignInResquestDto } from "authentication/dto/SignInResquestDto";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserNotFoundException } from "authentication/exceptions/UserNotFoundException";
import { CustonHttpException } from "lib/utils/CustonHttpException";
import { HttpStatus } from "@nestjs/common";
import { InvalidPasswordException } from "authentication/exceptions/InvalidPasswordException";
import { CookieSerializeOptions } from "@fastify/cookie";
import { GoogleLoginRequestDto } from "authentication/dto/GoogleLoginRequestDto";
import { InvalidGoogleToken } from "authentication/services/GoogleAuth/IGoogleAuth";
import { AlreadyUsedToken, ExpiredTokenException, InvalidTokenException } from "authentication/services/TokenProvider/TokenProvider";
import { SignUpRequestDTO } from "authentication/dto/SignUpRequestDTO";
import { UserAlreadyExists } from "user/exceptions/UserAlreadyExists";
import { UserProfile } from "user/dto/UserProfile";
import { User } from "user/entities/User";

const signIn = mock(SignIn)
const signOut = mock(SignOut)
const signUpUseCase = mock(SignUp)
const signInWithGoogle = mock(SignInWithGoogle)
const refreshTokens = mock(RefreshTokens)
const generateWebSocketTicket = mock(GenerateWebSocketTicket)
const logger = mock<Logger>()

const authController = new AuthController(
  instance(signIn),
  instance(signOut),
  instance(signUpUseCase),
  instance(signInWithGoogle),
  instance(refreshTokens),
  instance(generateWebSocketTicket),
  instance(logger)
)


describe('AuthController', () => {

  const refreshTokenCookiesName = 'refreshToken'
  const refreshTokenCookiesOption: CookieSerializeOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  }
  const reply = mock<FastifyReply>()
  const request = mock<FastifyRequest>()
  const accessToken = 'fake-access-token'
  const refreshToken = 'fake-refresh-token'
  const ticket = 'fake-ticket'

  beforeEach(() => {
    reset(reply)
    reset(request)
  })


  describe('login', () => {
    const body = new SignInResquestDto()

    it('should return accessToken and set refreshToken in cookies', async () => {
      when(signIn.execute(anything())).thenResolve({ accessToken, refreshToken })

      when(reply.setCookie(anything(), anything(), anything())).thenReturn(instance(reply))
      when(reply.send({ accessToken })).thenReturn(undefined as any)

      await expect(authController.login(body, instance(reply))).resolves.toBeUndefined()

      verify(reply.setCookie(
        deepEqual(refreshTokenCookiesName),
        deepEqual(refreshToken),
        deepEqual(refreshTokenCookiesOption)
      )).once()
      verify(reply.send(deepEqual({ accessToken }))).once()

    })

    it('should throw UserNotFoundException with status code 404 if the email does not exist', async () => {
      when(signIn.execute(anything())).thenThrow(new UserNotFoundException())
      await expect(authController.login(body, reply))
        .rejects
        .toThrow(new CustonHttpException(new UserNotFoundException(), HttpStatus.NOT_FOUND))
    })

    it('should throw InvalidPasswordException with status code 401 if the password is invalid', async () => {
      when(signIn.execute(anything())).thenThrow(new InvalidPasswordException())
      await expect(authController.login(body, reply))
        .rejects
        .toThrow(new CustonHttpException(new InvalidPasswordException(), HttpStatus.UNAUTHORIZED))
    })

  })


  describe('login with google', () => {

    const body = new GoogleLoginRequestDto()

    it('should return accessToken and set refreshToken in cookies', async () => {
      when(signInWithGoogle.execute(anything())).thenResolve({ accessToken, refreshToken })

      when(reply.setCookie(anything(), anything(), anything())).thenReturn(instance(reply))
      when(reply.send({ accessToken })).thenReturn(undefined as any)

      await expect(authController.loginWithGoogle(body, instance(reply))).resolves.toBeUndefined()

      verify(reply.setCookie(
        deepEqual(refreshTokenCookiesName),
        deepEqual(refreshToken),
        deepEqual(refreshTokenCookiesOption)
      )).once()
      verify(reply.send(deepEqual({ accessToken }))).once()

    })

    it('should throw UserNotFoundException with status code 404 if the email does not exist', async () => {
      when(signInWithGoogle.execute(anything())).thenThrow(new UserNotFoundException())
      await expect(authController.loginWithGoogle(body, reply))
        .rejects
        .toThrow(new CustonHttpException(new UserNotFoundException(), HttpStatus.NOT_FOUND))
    })

    it('should throw InvalidGoogleToken with status code 401 if the password is invalid', async () => {
      when(signInWithGoogle.execute(anything())).thenThrow(new InvalidGoogleToken())
      await expect(authController.loginWithGoogle(body, reply))
        .rejects
        .toThrow(new CustonHttpException(new InvalidGoogleToken(), HttpStatus.UNAUTHORIZED))
    })

  })

  describe('refreshTokenPair', () => {

    it('should return a new accessToken and set a new refreshToken in cookies', async () => {
      when(refreshTokens.execute(anything())).thenResolve({ accessToken, refreshToken })

      when(reply.setCookie(anything(), anything(), anything())).thenReturn(instance(reply))
      when(reply.send({ accessToken })).thenReturn(undefined as any)

      await expect(authController.refreshTokenPair(instance(request), instance(reply))).resolves.toBeUndefined()

      verify(reply.setCookie(
        deepEqual(refreshTokenCookiesName),
        deepEqual(refreshToken),
        deepEqual(refreshTokenCookiesOption)
      )).once()
      verify(reply.send(deepEqual({ accessToken }))).once()
    })

    it('should throw InvalidTokenException with status code 401 if the refresh token has already been used', async () => {
      when(refreshTokens.execute(anything())).thenThrow(new AlreadyUsedToken())
      await expect(authController.refreshTokenPair(request, reply))
        .rejects
        .toThrow(new CustonHttpException(new InvalidTokenException(), HttpStatus.UNAUTHORIZED))
      verify(logger.info('Attempt to refresh tokens using a discarded token')).once()
    })

    it('should throw InvalidTokenException with status code 401 if the refresh token if it is invalid', async () => {
      when(refreshTokens.execute(anything())).thenThrow(new InvalidTokenException())
      await expect(authController.refreshTokenPair(request, reply))
        .rejects
        .toThrow(new CustonHttpException(new InvalidTokenException(), HttpStatus.UNAUTHORIZED))
    })

    it('should throw ExpiredTokenException with status code 401 if the refresh token if it is expired', async () => {
      when(refreshTokens.execute(anything())).thenThrow(new ExpiredTokenException())
      await expect(authController.refreshTokenPair(request, reply))
        .rejects
        .toThrow(new CustonHttpException(new ExpiredTokenException(), HttpStatus.UNAUTHORIZED))
    })

  })


  describe('logout', () => {

    it('should clean the refreshToken in cookies', async () => {
      const req = instance(request)
      req.cookies = { refreshToken }

      when(reply.setCookie(anything(), anything(), anything())).thenReturn(instance(reply))

      await expect(authController.logout(req, instance(reply))).resolves.toBeUndefined()

      verify(signOut.execute(deepEqual(refreshToken))).once()
      verify(reply.setCookie(
        deepEqual(refreshTokenCookiesName),
        deepEqual(''),
        deepEqual(refreshTokenCookiesOption)
      )).once()

    })

  })

  describe('sign Up', () => {

    const body = new SignUpRequestDTO()

    it('should create a new user', async () => {
      await expect(authController.signUp(body)).resolves.toBeUndefined()
      verify(signUpUseCase.execute(deepEqual(body))).once()
    })

    it('should throw UserAlreadyExistsException with status code 409 if the email has already been used ', async () => {
      when(signUpUseCase.execute(anything())).thenThrow(new UserAlreadyExists())
      await expect(authController.signUp(body)).rejects
        .toThrow(new CustonHttpException(new UserAlreadyExists(), HttpStatus.CONFLICT))
    })

  })


  describe('get websocket authentication ticket', () => {

    it('should return a websoket ticket', async () => {
      const user = new UserProfile({} as User)
      const req = instance(request)
      req.user = user

      when(generateWebSocketTicket.execute(anything())).thenResolve(ticket)

      await expect(authController.getWebSocketTicket(req)).resolves.toStrictEqual({ ticket })

      verify(generateWebSocketTicket.execute(deepEqual(user))).once()
    })


  })


})
