import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsDate, IsNumber } from 'class-validator';
import {
  AppResponse,
  FilterOperatorInput,
  ModeSortOperator,
  PaginationResponse,
} from '../app.entity';
import { Taxonomy, TaxonomyInput } from '../taxonomy/taxonomy.entity';
import { User } from '../user/user.entity';

export enum PostsType {
  Post = 'Post',
  Page = 'Page',
}
registerEnumType(PostsType, { name: 'PostsType' });

export enum PostsStatus {
  Draft = 'Draft',
  Published = 'Published',
  Trash = 'Trash',
}
registerEnumType(PostsStatus, { name: 'PostsStatus' });

@ObjectType()
export class Post {
  @Field()
  Id: number;

  @Field()
  User: User;

  @Field(() => PostsType)
  Type: PostsType;

  @Field()
  Title: string;

  @Field({ nullable: true })
  Content: string;

  @Field()
  Slug: string;

  @Field(() => PostsStatus, { nullable: true })
  Status: PostsStatus;

  @Field({ nullable: true })
  Views: number;

  @Field({ nullable: true })
  Comment: boolean;

  @Field({ nullable: true })
  Password: string;

  @Field({ nullable: true })
  Avatar: string;

  @Field({ nullable: true })
  DatePublish: number;

  @Field({ nullable: true })
  DateModified: number;

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
export class PostResponse extends AppResponse(Post) {}

@ObjectType()
export class PostsPaginationResponse extends PaginationResponse(Post) {}

@ObjectType()
export class PostsResponse extends AppResponse(PostsPaginationResponse) {}

@InputType()
export class PostSort {
  @Field(() => ModeSortOperator, { nullable: true })
  Id: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Title: ModeSortOperator;

  @Field(() => ModeSortOperator, { nullable: true })
  Status: ModeSortOperator;
}

@InputType()
export class PostFilter {
  @Field({ nullable: true })
  Id: FilterOperatorInput;

  @Field({ nullable: true })
  Type: FilterOperatorInput;

  @Field({ nullable: true })
  Title: FilterOperatorInput;

  @Field({ nullable: true })
  Status: FilterOperatorInput;
}

@InputType()
export class RatingPostInput {
  @Field()
  @IsNumber()
  Value: number;
}

@InputType()
export class CreatePostInput {
  @Field(() => PostsType)
  Type: PostsType;

  @Field()
  Title: string;

  @Field({ nullable: true })
  Content: string;

  @Field()
  Slug: string;

  @Field(() => PostsStatus, { nullable: true })
  Status: PostsStatus;

  @Field({ nullable: true })
  Comment: boolean;

  @Field({ nullable: true })
  Password: string;

  @Field({ nullable: true })
  Avatar: string;

  @Field({ nullable: true })
  DatePublish: string;

  @Field(() => [TaxonomyInput], { nullable: true })
  Taxonomies: TaxonomyInput[];
}

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  Title: string;

  @Field({ nullable: true })
  Content: string;

  @Field({ nullable: true })
  Slug: string;

  @Field(() => PostsStatus, { nullable: true })
  Status: PostsStatus;

  @Field({ nullable: true })
  Comment: boolean;

  @Field({ nullable: true })
  Password: string;

  @Field({ nullable: true })
  Avatar: string;

  @Field({ nullable: true })
  DatePublish: string;

  @Field(() => [TaxonomyInput], { nullable: true })
  Taxonomies: TaxonomyInput[];
}
