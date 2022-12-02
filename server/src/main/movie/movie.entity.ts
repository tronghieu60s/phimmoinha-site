import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import {
  AppResponse,
  FilterOperatorInput,
  ModeSortOperator,
  PaginationResponse,
} from '../app.entity';
import { Taxonomy, TaxonomyInput } from '../taxonomy/taxonomy.entity';
import { User } from '../user/user.entity';

export enum MoviesType {
  Movie = 'Movie',
  Series = 'Series',
}
registerEnumType(MoviesType, { name: 'MoviesType' });

export enum MoviesStatus {
  Draft = 'Draft',
  Published = 'Published',
  Trash = 'Trash',
}
registerEnumType(MoviesStatus, { name: 'MoviesStatus' });

@ObjectType()
export class Movie {
  @Field()
  Id: number;

  @Field()
  User: User;

  @Field(() => MoviesType)
  Type: MoviesType;

  @Field()
  Title: string;

  @Field({ nullable: true })
  Content: string;

  @Field()
  Slug: string;

  @Field(() => MoviesStatus, { nullable: true })
  Status: MoviesStatus;

  @Field({ nullable: true })
  Views: number;

  @Field({ nullable: true })
  Comment: boolean;

  @Field({ nullable: true })
  Password: string;

  @Field({ nullable: true })
  Avatar: string;

  @Field({ nullable: true })
  Original: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Duration: number;

  @Field({ nullable: true })
  Quality: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Quantity: number;

  @Field({ nullable: true })
  Trailer: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Publish: number;

  @Field({ nullable: true })
  DatePublish: number;

  @Field({ nullable: true })
  DateModified: number;

  @Field(() => [Episode], { nullable: true })
  Episodes: Episode[];

  @Field({ nullable: true })
  EpisodesCount: number;

  @Field(() => [Taxonomy], { nullable: true })
  Taxonomies: Taxonomy[];

  @Field()
  @IsDate()
  CreatedAt: string;

  @Field()
  @IsDate()
  UpdatedAt: string;
}

@ObjectType()
export class MovieResponse extends AppResponse(Movie) {}

@ObjectType()
export class MoviesPaginationResponse extends PaginationResponse(Movie) {}

@ObjectType()
export class MoviesResponse extends AppResponse(MoviesPaginationResponse) {}

@InputType()
export class MovieSort {
  @Field(() => ModeSortOperator, { nullable: true })
  Id: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Title: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Status: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Original: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Publish: ModeSortOperator;
}

@InputType()
export class MovieFilter {
  @Field({ nullable: true })
  Id: FilterOperatorInput;

  @Field({ nullable: true })
  Title: FilterOperatorInput;

  @Field({ nullable: true })
  Status: FilterOperatorInput;

  @Field({ nullable: true })
  Original: FilterOperatorInput;

  @Field({ nullable: true })
  Publish: FilterOperatorInput;
}

@InputType()
export class RatingMovieInput {
  @Field()
  @IsNumber()
  Value: number;
}

@InputType()
export class ReportMovieInput {
  @Field()
  Reason: string;
}

@ObjectType()
export class Episode {
  @Field()
  Id: number;

  @Field()
  Title: string;

  @Field()
  Slug: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Order: number;

  @Field({ nullable: true })
  Source: string;

  @Field({ nullable: true })
  Date: number;

  @Field()
  @IsDate()
  CreatedAt: string;

  @Field()
  @IsDate()
  UpdatedAt: string;
}

@InputType()
export class EpisodeInput {
  @Field({ nullable: true })
  Id: number;

  @Field()
  Title: string;

  @Field()
  Slug: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Order: number;

  @Field({ nullable: true })
  Source: string;

  @Field({ nullable: true })
  Date: number;
}

@InputType()
export class CreateMovieInput {
  @Field(() => MoviesType)
  Type: MoviesType;

  @Field()
  Title: string;

  @Field({ nullable: true })
  Content: string;

  @Field()
  Slug: string;

  @Field(() => MoviesStatus, { nullable: true })
  Status: MoviesStatus;

  @Field({ nullable: true })
  Views: number;

  @Field({ nullable: true })
  Comment: boolean;

  @Field({ nullable: true })
  Password: string;

  @Field({ nullable: true })
  Avatar: string;

  @Field({ nullable: true })
  Original: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Duration: number;

  @Field({ nullable: true })
  Quality: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Quantity: number;

  @Field({ nullable: true })
  Trailer: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Publish: number;

  @Field({ nullable: true })
  DatePublish: string;

  @Field(() => [EpisodeInput], { nullable: true })
  Episodes: EpisodeInput[];

  @Field(() => [TaxonomyInput], { nullable: true })
  Taxonomies: TaxonomyInput[];
}

@InputType()
export class UpdateMovieInput {
  @Field(() => MoviesType)
  Type: MoviesType;

  @Field({ nullable: true })
  Title: string;

  @Field({ nullable: true })
  Content: string;

  @Field({ nullable: true })
  Slug: string;

  @Field(() => MoviesStatus, { nullable: true })
  Status: MoviesStatus;

  @Field({ nullable: true })
  Comment: boolean;

  @Field({ nullable: true })
  Password: string;

  @Field({ nullable: true })
  Avatar: string;

  @Field({ nullable: true })
  Original: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Duration: number;

  @Field({ nullable: true })
  Quality: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Quantity: number;

  @Field({ nullable: true })
  Trailer: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  Publish: number;

  @Field({ nullable: true })
  DatePublish: string;

  @Field(() => [EpisodeInput], { nullable: true })
  Episodes: EpisodeInput[];

  @Field(() => [TaxonomyInput], { nullable: true })
  Taxonomies: TaxonomyInput[];
}
