import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsDate, IsEmail, IsNumber, IsOptional } from 'class-validator';
import {
  AppResponse,
  FilterOperatorInput,
  ModeSortOperator,
  PaginationResponse,
} from '../app.entity';
import { Role } from '../role/role.entity';

@ObjectType()
export class User {
  @Field()
  Id: number;

  @Field()
  Role: Role;

  @Field()
  UserName: string;

  @Field()
  @IsEmail()
  Email: string;

  @Field()
  Password: string;

  @Field()
  IsAdministrator: boolean;

  @Field({ nullable: true })
  FirstName: string;

  @Field({ nullable: true })
  LastName: string;

  @Field({ nullable: true })
  FullName: string;

  @Field()
  @IsDate()
  CreatedAt: string;

  @Field()
  @IsDate()
  UpdatedAt: string;

  @Field(() => [UserSection], { nullable: true })
  UserSections: UserSection[];
}

@ObjectType()
export class UserResponse extends AppResponse(User) {}

@ObjectType()
export class UsersPaginationResponse extends PaginationResponse(User) {}

@ObjectType()
export class UsersResponse extends AppResponse(UsersPaginationResponse) {}

@InputType()
export class UserSort {
  @Field(() => ModeSortOperator, { nullable: true })
  Id: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  UserName: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Email: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  FirstName: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  LastName: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  FullName: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  CreatedAt: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  UpdatedAt: ModeSortOperator;
}

@InputType()
export class UserFilter {
  @Field({ nullable: true })
  UserName: FilterOperatorInput;

  @Field({ nullable: true })
  Email: FilterOperatorInput;

  @Field({ nullable: true })
  FirstName: FilterOperatorInput;

  @Field({ nullable: true })
  LastName: FilterOperatorInput;

  @Field({ nullable: true })
  FullName: FilterOperatorInput;
}

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Role_Ref: number;

  @Field()
  UserName: string;

  @Field()
  @IsEmail()
  Email: string;

  @Field()
  Password: string;

  @Field({ nullable: true })
  IsAdministrator: boolean;

  @Field({ nullable: true })
  FirstName: string;

  @Field({ nullable: true })
  LastName: string;

  @Field({ nullable: true })
  FullName: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Role_Ref: number;

  @Field({ nullable: true })
  Password: string;

  @Field({ nullable: true })
  IsAdministrator: boolean;

  @Field({ nullable: true })
  FirstName: string;

  @Field({ nullable: true })
  LastName: string;

  @Field({ nullable: true })
  FullName: string;
}

export enum UserSectionsStatus {
  Active = 'Active',
  Banned = 'Banned',
}
registerEnumType(UserSectionsStatus, { name: 'UserSectionsStatus' });

export enum UserSectionsOnlineStatus {
  Away = 'Away',
  Online = 'Online',
  Offline = 'Offline',
}
registerEnumType(UserSectionsOnlineStatus, { name: 'UserSectionsOnlineStatus' });

@ObjectType()
export class UserSection {
  @Field()
  Id: number;

  @Field({ nullable: true })
  User: User;

  @Field({ nullable: true })
  Section_Id: string;

  @Field()
  Socket_Id: string;

  @Field()
  Service_Id: string;

  @Field(() => UserSectionsStatus)
  Status: UserSectionsStatus;

  @Field(() => UserSectionsOnlineStatus)
  OnlineStatus: UserSectionsOnlineStatus;

  @Field()
  @IsDate()
  CreatedAt: string;

  @Field()
  @IsDate()
  UpdatedAt: string;
}

@ObjectType()
export class UserSectionPaginationResponse extends PaginationResponse(UserSection) {}

@ObjectType()
export class UserSectionResponse extends AppResponse(UserSectionPaginationResponse) {}

@InputType()
export class UserSectionSort {
  @Field(() => ModeSortOperator, { nullable: true })
  Status: ModeSortOperator;
}

@InputType()
export class UserSectionFilter {
  @Field({ nullable: true })
  Status: FilterOperatorInput;
}

@InputType()
export class PingUserSectionInput {
  @Field()
  Section_Id: string;

  @Field()
  Service_Id: string;

  @Field()
  Socket_Id: string;

  @Field(() => UserSectionsOnlineStatus)
  OnlineStatus: UserSectionsOnlineStatus;
}
