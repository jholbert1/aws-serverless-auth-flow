import middy from "@middy/core";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BaseError } from "../models/BaseError";

const CLIENT_COGNITO_ID = process.env.COGNITO_CLIENT_ID!;
const COGNITO_POOL_ID = process.env.COGNITO_POOL_ID!;

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_POOL_ID,
  tokenUse: "id",
  clientId: CLIENT_COGNITO_ID,
});

export const validateJwtToken = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const before = async (request): Promise<any> => {
    const eventHeaders: any = request.event.headers;
    const idToken = eventHeaders.Authorization || eventHeaders.authorization;

    let jwtVerify: any;

    if (request.event.body === null || request.event.body === undefined) {
      request.event.body = {};
    }

    try {
      jwtVerify = await jwtVerifier.verify(idToken);
      request.event.body.mdUser = {
        username: jwtVerify["cognito:username"],
        email: jwtVerify.email,
      };
    } catch (error) {
      const code = error as any;
      if (code?.message.includes("expired")) {
        console.log(`JWT Token is expired errorMessage: ${error}`);
        throw new BaseError("JWT_EXPIRED_TOKEN", error);
      }
      throw new BaseError("JWT_INVALID_TOKEN", error);
    }
  };

  return {
    before,
  };
};
