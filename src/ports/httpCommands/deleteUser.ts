import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { errorHandler } from "../../middlewares/errorHandler";
import { validateJwtToken } from "../../middlewares/validateJwtToken";
import { BaseError } from "../../models/BaseError";
import CognitoService from "../../services/CognitoService";

const processRequest = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const eventBody: any = event.body;
  const { email, username } = eventBody.mdUser;

  if(!username) {
    throw new BaseError("GENERAL_UNKNOWN", "User Not Found Try Again");
  }

  const cognito = CognitoService.getInstance();

  const cognitoFlow = await cognito.adminDeleteUser(username);

  return {
    statusCode: 200,
    body: JSON.stringify(cognitoFlow),
  };
};

export const handler = middy(processRequest)
  .use(jsonBodyParser())
  .use(validateJwtToken())
  .use(errorHandler());
