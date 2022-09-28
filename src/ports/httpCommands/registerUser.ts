import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { RegisterUserInterface } from "../../interfaces/RegisterUserInterface";
import { errorHandler } from "../../middlewares/errorHandler";
import CognitoService from "../../services/CognitoService";

// Input schema for the incoming request
const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email",
          minLength: 3,
          maxLength: 100,
        },
        password: {
          type: "string",
          minLength: 8,
          maxLength: 98,
        },
      },
      required: ["email", "password"],
    },
  },
};

const processRequest = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const eventBody: any = event.body;

  const registerUserInterface: RegisterUserInterface = eventBody;

  const email = registerUserInterface.email;
  const password = registerUserInterface.password.trim();

  const cognito = CognitoService.getInstance();

  const cognitoFlow = await cognito.adminCreateUser(email, password);

  if (cognitoFlow.User) {
    await cognito.adminSetUserPassword(email, password);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(cognitoFlow.User),
  };
};

export const handler = middy(processRequest)
  .use(jsonBodyParser())
  .use(validator({ inputSchema }))
  .use(errorHandler());
