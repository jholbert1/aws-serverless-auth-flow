import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ErrorResponseInterface } from "../interfaces/errors/ErrorResponseInterface";
import { ERROR_RESPONSE } from "../utils/ErrorResponseCatalog";

/**
 * Check if errors is comming from Middy
 *
 * @param {request} request middy data
 * @returns {boolean} boolean
 */
const ifMiddyError = (request): Boolean => {
  return (
    !request.error?.code && request.error?.statusCode && request.error?.message
  );
};

export const errorHandler = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const onError = async (request): Promise<APIGatewayProxyResult> => {
    let message: ErrorResponseInterface | undefined;

    if (ifMiddyError(request)) {
      switch (request.error.statusCode) {
        case 400:
          message = ERROR_RESPONSE.MIDDY_REQUIRED_PARAMS;
          break;
        case 422:
          message = ERROR_RESPONSE.MIDDY_INVALID_JSON;
          break;
        default:
          message = ERROR_RESPONSE.GENERAL_UNKNOWN;
      }

      return {
        statusCode: request.error.statusCode,
        body: JSON.stringify(message),
      };
    }

    // Check if error is thrown by our services
    if (ERROR_RESPONSE[request.error.name]) {
      return {
        statusCode: ERROR_RESPONSE[request.error.name].statusCode!,
        body: JSON.stringify({
          ...ERROR_RESPONSE[request.error.name],
          errorMessage: request.error.error,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify(ERROR_RESPONSE.GENERAL_UNKNOWN),
    };
  };

  return {
    onError,
  };
};
