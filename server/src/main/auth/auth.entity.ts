import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNumber, IsOptional } from 'class-validator';
import { AppResponse } from '../app.entity';
import { User } from '../user/user.entity';

@InputType()
export class SignInInput {
  @Field()
  Login: string;

  @Field()
  Password: string;

  @Field()
  Service_Id: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Expires: number;
}

@ObjectType()
export class SignInDataResponse {
  @Field()
  User: User;

  @Field()
  AccessToken: string;
}

@ObjectType()
export class SignInResponse extends AppResponse(SignInDataResponse) {}

@InputType()
export class SignUpInput {
  @Field()
  UserName: string;

  @Field()
  @IsEmail()
  Email: string;

  @Field()
  Password: string;
}

@ObjectType()
export class SignUpResponse extends AppResponse(User) {}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail()
  Email: string;
}

@ObjectType()
export class ForgotPasswordResponse extends AppResponse(User) {}
