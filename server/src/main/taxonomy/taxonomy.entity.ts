import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import {
  AppResponse,
  FilterOperatorInput,
  ModeSortOperator,
  PaginationResponse,
} from '../app.entity';

export enum TaxonomiesType {
  Cast = 'Cast',
  Director = 'Director',
  Country = 'Country',
  Post_Category = 'Post_Category',
  Movie_Category = 'Movie_Category',
  Tag = 'Tag',
}

registerEnumType(TaxonomiesType, { name: 'TaxonomiesType' });

@ObjectType()
export class Taxonomy {
  @Field()
  Id: number;

  @Field()
  Type: TaxonomiesType;

  @Field()
  Name: string;

  @Field()
  Slug: string;

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
export class TaxonomyResponse extends AppResponse(Taxonomy) {}

@ObjectType()
export class TaxonomiesPaginationResponse extends PaginationResponse(Taxonomy) {}

@ObjectType()
export class TaxonomiesResponse extends AppResponse(TaxonomiesPaginationResponse) {}

@InputType()
export class TaxonomySort {
  @Field(() => ModeSortOperator, { nullable: true })
  Id: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Name: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Slug: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Description: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  CreatedAt: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  UpdatedAt: ModeSortOperator;
}

@InputType()
export class TaxonomyFilter {
  @Field({ nullable: true })
  Id: FilterOperatorInput;

  @Field({ nullable: true })
  Type: FilterOperatorInput;

  @Field({ nullable: true })
  Name: FilterOperatorInput;

  @Field({ nullable: true })
  Slug: FilterOperatorInput;

  @Field({ nullable: true })
  Description: FilterOperatorInput;
}

@InputType()
export class TaxonomyInput {
  @Field({ nullable: true })
  Id: number;

  @Field({ nullable: true })
  Type: TaxonomiesType;

  @Field({ nullable: true })
  Name: string;

  @Field({ nullable: true })
  Slug: string;

  @Field({ nullable: true })
  Description: string;
}

@InputType()
export class CreateTaxonomyInput {
  @Field()
  Type: TaxonomiesType;

  @Field()
  Name: string;

  @Field({ nullable: true })
  Slug: string;

  @Field({ nullable: true })
  Description: string;
}

@InputType()
export class UpdateTaxonomyInput {
  @Field({ nullable: true })
  Name: string;

  @Field({ nullable: true })
  Slug: string;

  @Field({ nullable: true })
  Description: string;
}
