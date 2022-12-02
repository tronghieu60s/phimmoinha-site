import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/core/types';
import {
  AppResponse,
  FilterOperatorInput,
  ModeSortOperator,
  PaginationResponse,
} from '../app.entity';
import { User } from '../user/user.entity';

@ObjectType()
export class Asset {
  @Field()
  Id: number;

  @Field()
  User: User;

  @Field()
  Type: string;

  @Field()
  Name: string;

  @Field({ nullable: true })
  Size: number;

  @Field({ nullable: true })
  Path: string;

  @Field()
  @IsDate()
  CreatedAt: string;

  @Field()
  @IsDate()
  UpdatedAt: string;
}

@ObjectType()
export class AssetResponse extends AppResponse(Asset) {}

@ObjectType()
export class AssetsPaginationResponse extends PaginationResponse(Asset) {}

@ObjectType()
export class AssetsResponse extends AppResponse(AssetsPaginationResponse) {}

@InputType()
export class AssetSort {
  @Field(() => ModeSortOperator, { nullable: true })
  Id: ModeSortOperator;
}

@InputType()
export class AssetFilter {
  @Field({ nullable: true })
  Id: FilterOperatorInput;
}

@InputType()
export class CreateAssetInput {
  @Field(() => GraphQLUpload)
  File: Promise<FileUpload>;
}
