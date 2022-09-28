import { AdminSetUserPasswordResponse } from "@aws-sdk/client-cognito-identity-provider";
import { AWSError, CognitoIdentityServiceProvider } from "aws-sdk";
import {
  AdminCreateUserRequest,
  AdminCreateUserResponse,
  AdminDeleteUserRequest,
  AdminDisableUserRequest,
  AdminDisableUserResponse,
  AdminEnableUserRequest,
  AdminEnableUserResponse,
  AdminGetUserRequest,
  AdminGetUserResponse,
  AdminInitiateAuthRequest,
  AdminInitiateAuthResponse,
  AdminSetUserPasswordRequest,
  GetUserRequest,
  GetUserResponse,
  InitiateAuthResponse,
  ListUsersRequest,
  ListUsersResponse,
  SignUpRequest,
  SignUpResponse,
} from "aws-sdk/clients/cognitoidentityserviceprovider";
import { BaseError } from "../models/BaseError";

export default class CognitoService {
  private static instance?: CognitoService;

  private readonly COGNITO_CLIENT_ID: string = process.env.COGNITO_CLIENT_ID!;
  private readonly COGNITO_POOL_ID: string = process.env.COGNITO_POOL_ID!;
  private readonly FLOW_USER_PASSWORD_AUTH: string = "ADMIN_USER_PASSWORD_AUTH";

  private cognito: CognitoIdentityServiceProvider;

  private constructor() {
    this.cognito = new CognitoIdentityServiceProvider({});
  }

  static getInstance(): CognitoService {
    if (!CognitoService.instance) {
      CognitoService.instance = new CognitoService();
    }
    return CognitoService.instance;
  }

  static destroyInstance(): void {
    delete this.instance;
  }

  /**
   * Creates a new user in the specified user pool.
   *
   * @param {email} email user email
   * @param {password} password user password
   * @returns {Promise<AdminCreateUserResponse>}
   */
  async adminCreateUser(
    email: string,
    password: string
  ): Promise<AdminCreateUserResponse> {
    let response: AdminCreateUserResponse = {};

    try {
      const request: AdminCreateUserRequest = {
        UserPoolId: this.COGNITO_POOL_ID,
        Username: email,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
        MessageAction: "SUPPRESS",
      };

      response = await this.cognito.adminCreateUser(request).promise();
    } catch (error) {
      console.log(error);
      const code = (error as AWSError).code;
      throw new BaseError("COGNITO_ADMIN_CREATE_USER_PASSWORD", code);
    }

    return response;
  }

  /**
   * Sets the specified user's password in a user pool as an administrator.
   *
   * @param {email} email user email
   * @param {password} password user password
   * @returns {Promise<AdminSetUserPasswordResponse>}
   */
  async adminSetUserPassword(
    email: string,
    password: string
  ): Promise<AdminSetUserPasswordResponse> {
    let response: AdminSetUserPasswordResponse = {};

    const paramsForSetPass: AdminSetUserPasswordRequest = {
      UserPoolId: this.COGNITO_POOL_ID,
      Password: password,
      Username: email,
      Permanent: true,
    };

    try {
      response = await this.cognito
        .adminSetUserPassword(paramsForSetPass)
        .promise();
    } catch (error) {
      console.log("error set password", error);
      const code = (error as AWSError).code;
      throw new BaseError("COGNITO_SET_USER_PASSWORD", code);
    }

    return response;
  }

  /**
   * Registers the user in the specified user pool and creates a user name, password, and user attributes
   *
   * @param {User} user
   * @returns {Promise<SignUpResponse>} .
   */
  async signUp(email: string, password: string): Promise<SignUpResponse> {
    let response: SignUpResponse;

    try {
      const request: SignUpRequest = {
        ClientId: this.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
      };

      response = await this.cognito.signUp(request).promise();
    } catch (error) {
      console.log(error);
      const code = (error as AWSError).code;
      throw new BaseError("COGNITO_SIGN_UP_USER", code);
    }
    return response;
  }

  /**
   * Initiates the authentication flow
   * @param {email} email email user
   * @param {password} password password user
   * @returns {Promise<AdminInitiateAuthResponse>} .
   */
  async adminInitiateAuth(
    username: string,
    password: string
  ): Promise<InitiateAuthResponse> {
    let response: AdminInitiateAuthResponse;

    try {
      const request: AdminInitiateAuthRequest = {
        UserPoolId: this.COGNITO_POOL_ID,
        ClientId: this.COGNITO_CLIENT_ID,
        AuthFlow: this.FLOW_USER_PASSWORD_AUTH,
        AuthParameters: { USERNAME: username, PASSWORD: password },
      };

      response = await this.cognito.adminInitiateAuth(request).promise();
    } catch (error) {
      console.log(error);
      const code = (error as AWSError).code;
      throw new BaseError("COGNITO_ADMIN_INITIATE_AUTH", code);
    }

    return response;
  }

  /**
   * Disables the specified user as administrator
   *
   * @param {string} username
   * @returns {Promise<AdminDisableUserResponse>}.
   */
  async adminDisableUser(username: string): Promise<AdminDisableUserResponse> {
    let response: AdminDisableUserResponse;

    try {
      const request: AdminDisableUserRequest = {
        UserPoolId: this.COGNITO_POOL_ID,
        Username: username,
      };

      response = await this.cognito.adminDisableUser(request).promise();
    } catch (error) {
      console.log("Failed disabled user from cognito", error);
      const code = (error as AWSError).code;
      throw new BaseError("DISABLED_USER_ADMINISTRATOR", code);
    }

    return response;
  }

  /**
   * Enables the specified user as an administrator.
   *
   * @param {string} username
   * @returns {Promise<AdminEnableUserResponse>}.
   */
  async adminEnableUser(username: string): Promise<AdminEnableUserResponse> {
    let response: AdminEnableUserResponse;

    try {
      const request: AdminEnableUserRequest = {
        UserPoolId: this.COGNITO_POOL_ID,
        Username: username,
      };

      response = await this.cognito.adminEnableUser(request).promise();
    } catch (error) {
      const code = (error as AWSError).code;
      throw new BaseError("ENABLE_USER_ADMINISTRATOR", code);
    }

    return response;
  }

  /**
   * Lists the users in the Amazon Cognito user pool
   *
   * @param options
   * @returns {Promise<ListUsersResponse>} .
   */
  async listUsers(): Promise<ListUsersResponse> {
    let response: ListUsersResponse;

    try {
      const request: ListUsersRequest = { UserPoolId: this.COGNITO_POOL_ID };

      response = await this.cognito.listUsers(request).promise();
    } catch (error) {
      console.log("Error list user from cognito", error);
      const code = (error as AWSError).code;
      throw new BaseError("COGNITO_USERS_LIST", code);
    }

    return response;
  }

  /**
   * Gets the user attributes and metadata for a user
   *
   * @param {string} accessToken
   * @returns {Promise<GetUserResponse>}
   */
  async getUser(accessToken: string): Promise<GetUserResponse> {
    console.log(" Start getUser@CognitoService");

    let response: GetUserResponse;

    try {
      const request: GetUserRequest = {
        AccessToken: accessToken,
      };

      response = await this.cognito.getUser(request).promise();
    } catch (error) {
      const code = (error as AWSError).code;
      throw new BaseError("GET_COGNITO_USERS", code);
    }

    console.log(" End getUser@CognitoService");

    return response;
  }

  /**
   * Deletes a user as an administrator
   *
   * @param {string} username
   * @returns {Promise<void>}.
   */
  async adminDeleteUser(username: string): Promise<void> {
    try {
      const request: AdminDeleteUserRequest = {
        UserPoolId: this.COGNITO_POOL_ID,
        Username: username,
      };
      await this.cognito.adminDeleteUser(request).promise();
    } catch (error) {
      console.log(error);
      const code = (error as AWSError).code;
      throw new BaseError("DELETE_COGNITO_USERS", code);
    }
  }

  /**
   * Gets the specified user by user name in a user pool as an administrator
   *
   * @param {string} username
   * @returns {Promise<AdminGetUserResponse>} .
   */
  async adminGetUser(username: string): Promise<AdminGetUserResponse> {
    console.log(" Start adminGetUser@CognitoService: with username", username);
    let response: AdminGetUserResponse;

    try {
      const request: AdminGetUserRequest = {
        UserPoolId: this.COGNITO_POOL_ID,
        Username: username,
      };

      response = await this.cognito.adminGetUser(request).promise();
    } catch (error) {
      console.log(error);
      const code = (error as AWSError).code;
      throw new BaseError("COGNITO_GET_USER", code);
    }

    console.log(" Finish adminGetUser@CognitoService: with username", username);

    return response;
  }
}
