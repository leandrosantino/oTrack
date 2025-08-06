import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInResquestDto } from '../../dto/SignInResquestDto';
import { SignIn } from 'authentication/usecases/SignIn';
import { AccessTokenResponseDto } from 'authentication/dto/AccessTokenResponseDto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CookieSerializeOptions } from '@fastify/cookie';
import { ApiResponseError } from 'lib/decorators/ApiResponseError';
import { RefreshTokens } from 'authentication/usecases/RefreshTokens';
import { AlreadyUsedToken, ExpiredTokenException, InvalidTokenException } from 'authentication/services/TokenProvider/TokenProvider';
import { Logger } from 'shared/services/Logging/Logger';
import { SignInWithGoogle } from 'authentication/usecases/SignInWithGoogle';
import { InvalidGoogleToken } from 'authentication/services/GoogleAuth/IGoogleAuth';
import { GoogleLoginRequestDto } from 'authentication/dto/GoogleLoginRequestDto';
import { SignOut } from 'authentication/usecases/SignOut';
import { SignUpRequestDTO } from 'authentication/dto/SignUpRequestDTO';
import { SignUp } from 'authentication/usecases/SignUp';
import { GenerateWebSocketTicket } from 'authentication/usecases/GenerateWebSocketTicket';
import { Protected } from 'lib/decorators/Protected';
import { Role } from 'user/entities/Role';
import { CustonHttpException } from 'lib/utils/CustonHttpException';
import { InvalidPasswordException } from 'authentication/exceptions/InvalidPasswordException';
import { UserNotFoundException } from 'authentication/exceptions/UserNotFoundException';
import { UserAlreadyExists } from 'user/exceptions/UserAlreadyExists';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly signIn: SignIn,
    private readonly signOut: SignOut,
    private readonly signUpUseCase: SignUp,
    private readonly signInWithGoogle: SignInWithGoogle,
    private readonly refreshTokens: RefreshTokens,
    private readonly generateWebSocketTicket: GenerateWebSocketTicket,
    @Inject('Logger') private readonly logger: Logger,
  ) { }

  private readonly refreshTokenCookiesName = 'refreshToken'
  private readonly refreshTokenCookiesOption: CookieSerializeOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  }

  @Post('login')
  @ApiResponseError(HttpStatus.NOT_FOUND, UserNotFoundException)
  @ApiResponseError(HttpStatus.UNAUTHORIZED, InvalidPasswordException)
  @ApiOkResponse({ description: 'Access Token', type: AccessTokenResponseDto })
  async login(
    @Body() { email, password }: SignInResquestDto,
    @Res() reply: FastifyReply
  ) {
    const result = await tryAsync(() => this.signIn.execute({ password, email }))

    if (result.success) {
      const { accessToken, refreshToken } = result.value
      reply.setCookie(this.refreshTokenCookiesName, refreshToken, this.refreshTokenCookiesOption)
      reply.send({ accessToken })
      return
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    if (result.error instanceof UserNotFoundException) status = HttpStatus.NOT_FOUND
    if (result.error instanceof InvalidPasswordException) status = HttpStatus.UNAUTHORIZED

    throw new CustonHttpException(result.error, status)
  }

  @Post('login/google')
  @ApiResponseError(HttpStatus.NOT_FOUND, UserNotFoundException)
  @ApiResponseError(HttpStatus.UNAUTHORIZED, InvalidGoogleToken)
  @ApiOkResponse({ description: 'Access Token', type: AccessTokenResponseDto })
  async loginWithGoogle(
    @Body() { idToken }: GoogleLoginRequestDto,
    @Res() reply: FastifyReply
  ) {
    const result = await tryAsync(() => this.signInWithGoogle.execute({ idToken }))

    if (result.success) {
      const { accessToken, refreshToken } = result.value
      reply.setCookie(this.refreshTokenCookiesName, refreshToken, this.refreshTokenCookiesOption)
      reply.send({ accessToken })
      return
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    if (result.error instanceof UserNotFoundException) status = HttpStatus.NOT_FOUND
    if (result.error instanceof InvalidGoogleToken) status = HttpStatus.UNAUTHORIZED

    throw new CustonHttpException(result.error, status)
  }

  @Get('refresh')
  @ApiResponseError(HttpStatus.UNAUTHORIZED, ExpiredTokenException)
  @ApiResponseError(HttpStatus.BAD_REQUEST, InvalidTokenException)
  @ApiOkResponse({ description: 'Access Token', type: AccessTokenResponseDto })
  async refreshTokenPair(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const refreshToken = request.cookies.refreshToken ?? '';
    const result = await tryAsync(() => this.refreshTokens.execute(refreshToken))

    if (result.success) {
      const { accessToken, refreshToken: newRefreshToken } = result.value
      reply.setCookie(this.refreshTokenCookiesName, newRefreshToken, this.refreshTokenCookiesOption)
      reply.send({ accessToken })
      return
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR

    if (result.error instanceof AlreadyUsedToken) {
      this.logger.info('Attempt to refresh tokens using a discarded token')
      throw new CustonHttpException(new InvalidTokenException(), HttpStatus.UNAUTHORIZED)
    }

    if (result.error instanceof ExpiredTokenException || result.error instanceof InvalidTokenException) {
      status = HttpStatus.UNAUTHORIZED
    }

    throw new CustonHttpException(result.error, status)
  }

  @Post('logout')
  async logout(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const refreshToken = request.cookies.refreshToken ?? '';
    await this.signOut.execute(refreshToken)
    reply.setCookie(this.refreshTokenCookiesName, '', this.refreshTokenCookiesOption).send()
    return
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ description: 'new user created', status: HttpStatus.CREATED })
  @ApiResponseError(HttpStatus.CONFLICT, UserAlreadyExists)
  async signUp(@Body() body: SignUpRequestDTO) {
    const result = await tryAsync(() => this.signUpUseCase.execute(body))
    if (result.success) return

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    if (result.error instanceof UserAlreadyExists) status = HttpStatus.CONFLICT

    throw new CustonHttpException(result.error, status)
  }

  @ApiOkResponse({ description: 'new websocket access ticket create', schema: { example: { ticket: 'bqbpydh9wtt5ndc2jiswnph3' } } })
  @Protected([Role.ADMIN])
  @Get('websocket-ticket')
  async getWebSocketTicket(@Req() request: FastifyRequest) {
    const user = request.user!
    const ticket = await this.generateWebSocketTicket.execute(user)
    return { ticket }
  }

}
