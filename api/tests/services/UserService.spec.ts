import { UserService } from "services/UserService/UserService"
import { instance, reset, verify, when } from "ts-mockito"
import { userRepositoryMock } from "../mocks/repositories.mock"
import { passwordHasherMock } from "../mocks/services.mock"
import { Roules } from "entities/user/Roule"
import assert from "assert"
import { UserCreateExceptions } from "entities/user/UserExceptions"

const userService = new UserService(
  instance(userRepositoryMock),
  instance(passwordHasherMock)
)

describe('UserService', () => {

  describe('create', () => {

    beforeEach(() => {
      reset(userRepositoryMock)
      reset(passwordHasherMock)
    })

    it('should return USER_ALREADY_EXISTS when the username is already in use ', async () => {
      const newUser = { displayName: 'name', password: '123', username: 'username', roule: Roules.ADMIN }

      when(userRepositoryMock.existsByUsername('username')).thenResolve(true)
      const result = await userService.create(newUser)

      assert(!result.ok)
      result.err.case(UserCreateExceptions.USER_ALREADY_EXISTS, () => assert(true))

    })

    it('should return created user', async () => {
      const newUser = { displayName: 'name', password: '123', username: 'username', roule: Roules.ADMIN }
      const createdUser = { id: 1, ...newUser }
      createdUser.password = 'hashedPassword'

      when(userRepositoryMock.existsByUsername('username')).thenResolve(false)
      when(userRepositoryMock.create(newUser)).thenResolve(createdUser)
      when(passwordHasherMock.hash('123')).thenResolve('hashedPassword')


      const result = await userService.create(newUser)

      assert(result.ok)
      verify(passwordHasherMock.hash('123')).once()
      assert.deepStrictEqual(createdUser, result.value)
    })

  })

})
