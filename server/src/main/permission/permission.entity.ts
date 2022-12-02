import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import {
  AppResponse,
  FilterOperatorInput,
  ModeSortOperator,
  PaginationResponse,
} from '../app.entity';

@ObjectType()
export class Permission {
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
}

@ObjectType()
export class PermissionResponse extends AppResponse(Permission) {}

@ObjectType()
export class PermissionsPaginationResponse extends PaginationResponse(Permission) {}

@ObjectType()
export class PermissionsResponse extends AppResponse(PermissionsPaginationResponse) {}

@InputType()
export class PermissionSort {
  @Field(() => ModeSortOperator, { nullable: true })
  Id: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Name: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Description: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  CreatedAt: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  UpdatedAt: ModeSortOperator;
}

@InputType()
export class PermissionFilter {
  @Field({ nullable: true })
  Id: FilterOperatorInput;

  @Field({ nullable: true })
  Name: FilterOperatorInput;

  @Field({ nullable: true })
  Description: FilterOperatorInput;
}

@InputType()
export class CreatePermissionInput {
  @Field()
  Name: string;

  @Field({ nullable: true })
  Description: string;
}

@InputType()
export class UpdatePermissionInput {
  @Field({ nullable: true })
  Name: string;

  @Field({ nullable: true })
  Description: string;
}
