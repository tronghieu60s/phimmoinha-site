import { UserType } from '@service/user/user.types';

export type SignInType = {
  User: UserType;
  AccessToken: string;
};

export type CreateSignInType = {
  Login: string;
  Password: string;
  Service_Id: String;
  Expires?: number;
};

export type CreateSignUpType = {
  UserName: string;
  Email: string;
  Password: string;
};
