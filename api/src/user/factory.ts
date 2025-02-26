import { container } from "tsyringe"
import { LocationSharingController } from "./controllers/LocationSharingController"
import { UsersController } from "./controllers/UsersController"
import { UserRepository } from "./repository/UserRepository"
import { CreateUser } from "./usecases/CreateUser"
import { UserProfileValidator } from "./validators/UserProfileValidator"

//Repository
container.registerSingleton('UserRepository', UserRepository)

//Use cases
container.registerSingleton('CreateUser', CreateUser)

//Validators
container.registerSingleton('UserProfileValidator', UserProfileValidator)


