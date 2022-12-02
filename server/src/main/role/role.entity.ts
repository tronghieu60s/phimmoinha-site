import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import {
  AppResponse,
  FilterOperatorInput,
  ModeSortOperator,
  PaginationResponse,
} from '../app.entity';
import { Permission } from '../permission/permission.entity';

@ObjectType()
export class Role {
  @Field()
  Id: number;

  @Field()
  Name: string;

  @Field({ nullable: true })
  Description: string;

  @Field()
  @IsDate()
  CreatedAt: string;

  @Field()
  @IsDate()
  UpdatedAt: string;

  @Field(() => [Permission], { nullable: true })
  Permissions: Permission[];
}

@ObjectType()
export class RoleResponse extends AppResponse(Role) {}

@ObjectType()
export class RolesPaginationResponse extends PaginationResponse(Role) {}

@ObjectType()
export class RolesResponse extends AppResponse(RolesPaginationResponse) {}

@InputType()
export class RoleSort {
  @Field(() => ModeSortOperator, { nullable: true })
  Id: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Name: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Description: ModeSortOperator;
}

@InputType()
export class RoleFilter {
  @Field({ nullable: true })
  Id: FilterOperatorInput;

  @Field({ nullable: true })
  Name: FilterOperatorInput;

  @Field({ nullable: true })
  Description: FilterOperatorInput;

  @Field(() => ModeSortOperator, { nullable: true })
  CreatedAt: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  UpdatedAt: ModeSortOperator;
}

@InputType()
export class CreateRoleInput {
  @Field()
  Name: string;

  @Field({ nullable: true })
  Description: string;

  @Field(() => [Number], { nullable: true })
  Permissions: number[];
}

@InputType()
export class UpdateRoleInput {
  @Field({ nullable: true })
  Name: string;

  @Field({ nullable: true })
  Description: string;

  @Field(() => [Number], { nullable: true })
  Permissions: number[];
}
