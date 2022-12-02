import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import {
  AppResponse,
  FilterOperatorInput,
  ModeSortOperator,
  PaginationResponse,
} from '../app.entity';

@ObjectType()
export class Library {
  @Field()
  Id: number;

  @Field()
  Type: string;

  @Field()
  Key: string;

  @Field({ nullable: true })
  Value: string;

  @Field({ nullable: true })
  Color: string;

  @Field()
  @IsDate()
  CreatedAt: string;

  @Field()
  @IsDate()
  UpdatedAt: string;
}

@ObjectType()
export class LibraryResponse extends AppResponse(Library) {}

@ObjectType()
export class LibrariesPaginationResponse extends PaginationResponse(Library) {}

@ObjectType()
export class LibrariesResponse extends AppResponse(LibrariesPaginationResponse) {}

@InputType()
export class LibrarySort {
  @Field(() => ModeSortOperator, { nullable: true })
  Id: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Type: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Key: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Value: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Color: ModeSortOperator;
}

@InputType()
export class LibraryFilter {
  @Field({ nullable: true })
  Id: FilterOperatorInput;

  @Field({ nullable: true })
  Type: FilterOperatorInput;

  @Field({ nullable: true })
  Key: FilterOperatorInput;

  @Field({ nullable: true })
  Value: FilterOperatorInput;

  @Field({ nullable: true })
  Color: FilterOperatorInput;
}

@InputType()
export class CreateLibraryInput {
  @Field()
  Type: string;

  @Field()
  Key: string;

  @Field({ nullable: true })
  Value: string;

  @Field({ nullable: true })
  Color: string;
}

@InputType()
export class UpdateLibraryInput {
  @Field({ nullable: true })
  Key: string;

  @Field({ nullable: true })
  Value: string;

  @Field({ nullable: true })
  Color: string;
}
