import { gql } from '@apollo/client';
import { ResponseType } from '@const/types';
import { apolloMutation } from '@core/apollo';
import { UserType } from '@service/user/user.types';
import { CreateSignInType, CreateSignUpType, SignInType } from './auth.types';

const APP_JWT_TOKEN_EXPIRES_IN = process.env.APP_JWT_TOKEN_EXPIRES_IN || 86400000;

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    Id
    UserName
    Email
    IsAdministrator
    FirstName
    LastName
    FullName
  }
`;

export const signIn = async (args: CreateSignInType) => {
  const { Login, Password, Service_Id, Expires = Number(APP_JWT_TOKEN_EXPIRES_IN) } = args;

  return apolloMutation<{ signIn: ResponseType<SignInType> }>(
    gql`
      ${CORE_USER_FIELDS}
      mutation ($Login: String!, $Password: String!, $Service_Id: String!, $Expires: Float) {
        signIn(
          input: { Login: $Login, Password: $Password, Service_Id: $Service_Id, Expires: $Expires }
        ) {
          Data {
            User {
              ...CoreUserFields
            }
            AccessToken
          }
          InsertId
          RowsAffected
        }
      }
    `,
    { Login, Password, Service_Id, Expires },
  );
};

export const signUp = async (args: CreateSignUpType) => {
  const { UserName, Email, Password } = args;

  return apolloMutation<{
    signUp: ResponseType<UserType>;
  }>(
    gql`
      ${CORE_USER_FIELDS}
      mutation ($UserName: String!, $Email: String!, $Password: String!) {
        signUp(input: { UserName: $UserName, Email: $Email, Password: $Password }) {
          Data {
            ...CoreUserFields
          }
          InsertId
        }
      }
    `,
    { UserName, Email, Password },
  );
};
