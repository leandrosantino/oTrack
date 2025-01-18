import { mock, instance } from "ts-mockito";
import { Properties } from "utils/Properties";

const propertiesMock = mock<Properties>()
export const propertiesInstance = instance(propertiesMock)

propertiesInstance.env = {
  COOKIE_SECRET: 'test-secret',
  JWT_SECRET: "test-secret",
  REFRESH_TOKEN_EXPIRES: "2d",
  ACCESS_TOKEN_EXPIRES: "1m",
}
