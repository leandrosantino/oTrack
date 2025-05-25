import { container } from "tsyringe"
import { PasswordHasher } from "./services/PasswordHasher/PasswordHasher"
import { JsonWebTokenProvider } from "./services/TokenProvider/JsonWebTokenProvider"
import { RefreshTokens } from "./usecases/RefreshTokens"
import { SignIn } from "./usecases/SignIn"
import { SignOut } from "./usecases/SignOut"
import { VerifyToken } from "./usecases/VerifyToken"
import { GeneratePasswordRecoverTicket } from "./usecases/GeneratePasswordRecoverTicket"
import { SendPasswordRecoverMail } from "./usecases/SendPasswordRecoverMail"
import { TicketProvider } from "./services/TicketProvider/TicketProvider"
import { GenerateWebSocketTicket } from "./usecases/GenerateWebSocketTicket"
import { UpdatePassword } from "./usecases/UpdatePassword"

//Services
container.registerSingleton('PasswordHasher', PasswordHasher)
container.registerSingleton('TokenProvider', JsonWebTokenProvider)
container.registerSingleton('TicketProvider', TicketProvider)


//Use cases
container.registerSingleton('RefreshTokens', RefreshTokens)
container.registerSingleton('SignIn', SignIn)
container.registerSingleton('SignOut', SignOut)
container.registerSingleton('VerifyToken', VerifyToken)
container.registerSingleton('GenerateWebSocketTicket', GenerateWebSocketTicket)
container.registerSingleton('TicketsMap', Map)
container.registerSingleton('GeneratePasswordRecoverTicket', GeneratePasswordRecoverTicket)
container.registerSingleton('SendPasswordRecoverMail', SendPasswordRecoverMail)
container.registerSingleton('UpdatePassword', UpdatePassword)

