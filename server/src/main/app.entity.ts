import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function AppResponse<T>(TItem: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class AppResponseClass {
    @Field(() => TItem, { nullable: true })
    Data: T;

    @Field({ nullable: true })
    InsertId?: number;

    @Field({ nullable: true })
    RowsAffected?: number;
  }
  return AppResponseClass;
}

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  All: boolean;

  @Field({ nullable: true })
  Page: number;

  @Field({ nullable: true })
  PageSize: number;
}

@ObjectType()
export class PaginationResult {
  @Field()
  All: boolean;

  @Field()
  Page: number;

  @Field()
  PageSize: number;

  @Field()
  Total: number;

  @Field()
  PageTotal: number;

  @Field()
  NextPage: number;

  @Field()
  PreviousPage: number;
}

export function PaginationResponse<T>(TItem: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginationResponseClass {
    @Field(() => [TItem], { nullable: true })
    Items: T[];

    @Field({ nullable: true })
    Pagination: PaginationResult;
  }
  return PaginationResponseClass;
}

export enum ModeSortOperator {
  Asc = 'asc',
  Desc = 'desc',
}
registerEnumType(ModeSortOperator, { name: 'ModeSortOperator' });

export enum ModeFilterOperator {
  Default = 'default',
  Insensitive = 'insensitive',
}
registerEnumType(ModeFilterOperator, { name: 'ModeFilterOperator' });

@InputType()
export class FilterOperatorInput {
  @Field({ nullable: true })
  Eq: string;

  @Field({ nullable: true })
  Ne: string;

  @Field(() => [String], { nullable: true })
  In: string[];

  @Field(() => [String], { nullable: true })
  NIn: string[];

  @Field({ nullable: true })
  Ct: string;

  @Field({ nullable: true })
  Gt: number;

  @Field({ nullable: true })
  Gte: number;

  @Field({ nullable: true })
  Lt: number;

  @Field({ nullable: true })
  Lte: number;

  @Field({ nullable: true })
  Stw: string;

  @Field({ nullable: true })
  Enw: string;

  @Field(() => ModeFilterOperator, { nullable: true })
  Mode: ModeFilterOperator;
}

@ObjectType()
export class BooleanResponse extends AppResponse(Boolean) {}
