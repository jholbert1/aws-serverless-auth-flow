import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { errorHandler } from "../../middlewares/errorHandler";
import CognitoService from "../../services/CognitoService";

// Input schema for the incoming request
const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        username: { type: "string", minLength: 3, maxLength: 250, format: "email" },
        password: {
          type: "string",
          minLength: 8,
          maxLength: 98,
        },
      },
      required: ["username", "password"],
    },
  },
};

interface SingInInterface {
  username: string;
  password: string;
}

const processRequest = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  const eventBody: any = event.body;

  const registerUserInterface: SingInInterface = eventBody;

  const username = registerUserInterface.username;
  const password = registerUserInterface.password.trim();

  const cognito = CognitoService.getInstance();

  const cognitoFlow = await cognito.adminInitiateAuth(username, password);

  return {
    statusCode: 200,
    body: JSON.stringify(cognitoFlow),
  };
};

export const handler = middy(processRequest)
  .use(jsonBodyParser())
  .use(validator({ inputSchema }))
  .use(errorHandler());