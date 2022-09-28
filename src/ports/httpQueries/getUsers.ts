import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { errorHandler } from "../../middlewares/errorHandler";
import { validateJwtToken } from "../../middlewares/validateJwtToken";
import CognitoService from "../../services/CognitoService";

const processRequest = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const cognito = CognitoService.getInstance();

  const cognitoFlow = await cognito.listUsers();

  return {
    statusCode: 200,
    body: JSON.stringify(cognitoFlow),
  };
};

export const handler = middy(processRequest)
  .use(jsonBodyParser())
  .use(validateJwtToken())
  .use(errorHandler());
