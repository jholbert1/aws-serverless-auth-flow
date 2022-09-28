import { Callback, Context, CustomAuthorizerEvent } from "aws-lambda";
import { AttributeListType } from "aws-sdk/clients/cognitoidentityserviceprovider";
import CognitoService from "../../services/CognitoService";

interface ContextUser {
  email: string;
  username: string;
}

const generatePolicy = (
  principalId: string,
  effect: string,
  resourceARN: string,
  user: ContextUser
) => {
  return {
    principalId,
    context: {
      username: user.username,
      email: user.email,
    },
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resourceARN,
        },
      ],
    },
  };
};

// Todo replace CustomAuthorizerEvent to not deprecated type
const processRequest = async (
  event: CustomAuthorizerEvent,
  _context: Context,
  callback: Callback
) => {
  console.log("CognitoAuthorizer@processRequest: Incoming event", { event });
  const eventHeaders: any = event.headers;

  const idToken = eventHeaders.Authorization || eventHeaders.authorization;
  const accessToken =
    eventHeaders["X-Access-Token"] || eventHeaders["x-access-token"];

  if (!idToken || !accessToken) {
    console.log("CognitoAuthorizer@processRequest: Access Token is not valid");
    callback("Error: Invalid token");
    return;
  }

  console.log("CognitoAuthorizer@processRequest: Access Token", { idToken });

  try {
    const cognito = CognitoService.getInstance();

    const user = await cognito.getUser(accessToken);

    console.log("CognitoAuthorizer@processRequest: User allowed", user);
    const userEmail = user.UserAttributes.find(
      (userData) => userData.Name === "email"
    );

    const userContext: ContextUser = {
      email: userEmail?.Value ?? "",
      username: user.Username!,
    };

    callback(
      null,
      generatePolicy("user", "Allow", event.methodArn, userContext)
    );
  } catch (error) {
    console.log(
      "CognitoAuthorizer@processRequest: Cannot validate user by auth token",
      { error }
    );
    callback("Unauthorized");
  }
};

export const handler = processRequest;
