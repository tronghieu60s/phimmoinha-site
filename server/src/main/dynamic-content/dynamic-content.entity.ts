import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNumber } from 'class-validator';
import {
  AppResponse,
  FilterOperatorInput,
  ModeSortOperator,
  PaginationResponse,
} from '../app.entity';

@ObjectType()
export class DynamicContent {
  @Field()
  Id: number;

  @Field()
  Key: string;

  @Field()
  Value: string;

  @Field()
  @IsDate()
  CreatedAt: string;

  @Field()
  @IsDate()
  UpdatedAt: string;
}

@ObjectType()
export class DynamicContentResponse extends AppResponse(DynamicContent) {}

@ObjectType()
export class DynamicContentsPaginationResponse extends PaginationResponse(DynamicContent) {}

@ObjectType()
export class DynamicContentsResponse extends AppResponse(DynamicContentsPaginationResponse) {}

@InputType()
export class DynamicContentSort {
  @Field({ nullable: true })
  Id: ModeSortOperator;

  @Field({ nullable: true })
  Key: ModeSortOperator;

  @Field({ nullable: true })
  Value: ModeSortOperator;
}

@InputType()
export class DynamicContentFilter {
  @Field({ nullable: true })
  Id: FilterOperatorInput;

  @Field({ nullable: true })
  Key: FilterOperatorInput;

  @Field({ nullable: true })
  Value: FilterOperatorInput;
}

@InputType()
export class RatingMovieInput {
  @Field()
  @IsNumber()
  Value: number;
}

@InputType()
export class CreateDynamicContentInput {
  @Field()
  Key: string;

  @Field({ nullable: true })
  Value: string;
}

@InputType()
export class UpdateDynamicContentInput {
  @Field()
  Value: string;
}
