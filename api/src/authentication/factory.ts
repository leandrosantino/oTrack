import { container } from "tsyringe"
import { CuidGenerator } from "./services/CuidGenerator/CuidGenerator"
import { PasswordHasher } from "./services/PasswordHasher/PasswordHasher"
import { JsonWebTokenProvider } from "./services/TokenProvider/JsonWebTokenProvider"
import { GenerateTicket } from "./usecases/GenerateTicket"
import { RefreshTokens } from "./usecases/RefreshTokens"
import { SignIn } from "./usecases/SignIn"
import { SignOut } from "./usecases/SignOut"
import { VerifyTicket } from "./usecases/VerifyTicket"
import { VerifyToken } from "./usecases/VerifyToken"

//Services
container.registerSingleton('PasswordHasher', PasswordHasher)
container.registerSingleton('TokenProvider', JsonWebTokenProvider)
container.registerSingleton('CuidGenerator', CuidGenerator)


//Use cases
container.registerSingleton('RefreshTokens', RefreshTokens)
container.registerSingleton('SignIn', SignIn)
container.registerSingleton('SignOut', SignOut)
container.registerSingleton('VerifyToken', VerifyToken)
container.registerSingleton('GenerateTicket', GenerateTicket)
container.registerSingleton('VerifyTicket', VerifyTicket)
container.registerSingleton('TicketsMap', Map)

