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
      },
      required: ["username"],
    },
  },
};

interface EnableUserInterface {
  username: string;
}

const processRequest = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  const eventBody: any = event.body;

  const enableData: EnableUserInterface = eventBody;

  const username = enableData.username;

  const cognito = CognitoService.getInstance();

  const cognitoFlow = await cognito.adminEnableUser(username);

  return {
    statusCode: 200,
    body: JSON.stringify(cognitoFlow),
  };
};

export const handler = middy(processRequest)
  .use(jsonBodyParser())
  .use(validator({ inputSchema }))
  .use(errorHandler());