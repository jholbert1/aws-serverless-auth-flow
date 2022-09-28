import { ErrorResponseInterface } from "../interfaces/errors/ErrorResponseInterface";

export const ERROR_RESPONSE: Record<string, ErrorResponseInterface> = {
  // Cognito Errors
  COGNITO_ADMIN_CREATE_USER_PASSWORD: {
    code: 900,
    message: "Failed AdminCreateUser CognitoService creating user in Cognito",
    statusCode: 403,
  },
  COGNITO_SET_USER_PASSWORD: {
    code: 901,
    message: "Failed Set User Password CognitoService creating user in Cognito",
    statusCode: 403,
  },
  COGNITO_SIGN_UP_USER: {
    code: 902,
    message: "Failed Sign Up CognitoService creating user in Cognito",
    statusCode: 403,
  },
  COGNITO_ADMIN_INITIATE_AUTH: {
    code: 903,
    message:
      "Failed Admin Initiate Auth CognitoService creating user in Cognito",
    statusCode: 403,
  },
  COGNITO_DISABLED_USER_ADMINISTRATOR: {
    code: 904,
    message: "Failed Disabled Admin CognitoService",
    statusCode: 400,
  },
  COGNITO_ENABLE_USER_ADMINISTRATOR: {
    code: 904,
    message: "Failed Enable Admin CognitoService",
    statusCode: 400,
  },
  COGNITO_USERS_LIST: {
    code: 905,
    message: "Failed Get User From Pool in Cognito",
    statusCode: 400,
  },
  COGNITO_GET_USERS: {
    code: 907,
    message: "GET_COGNITO_USERS",
    statusCode: 400,
  },
  COGNITO_DELETE_USERS: {
    code: 908,
    message: "Failed Delete User From Cognito Pool",
    statusCode: 400,
  },
  COGNITO_GET_USER: {
    code: 909,
    message:
      "Failed Gets the Specified User by User Name in a User Pool as an Administrator",
    statusCode: 400,
  },
  // MIDDY errors
  MIDDY_INVALID_JSON: {
    code: 1002,
    message: "The JSON body is invalid",
    statusCode: 422,
  },
  MIDDY_REQUIRED_PARAMS: {
    code: 1001,
    message: "The request parameters do not meet the expected schema",
    statusCode: 400,
  },
  // JWT errors
  JWT_EXPIRED_TOKEN: {
    code: 2001,
    message: "Your session has expired.",
    statusCode: 403,
  },
  JWT_INVALID_TOKEN: {
    code: 2000,
    message: "You don't have permission for this action.",
    statusCode: 403,
  },
  // Error General
  GENERAL_UNKNOWN: {
    code: 9000,
    message:
      "We cannot process your request at this moment. Please try again later or contact your administrator",
    statusCode: 500,
  },
};
