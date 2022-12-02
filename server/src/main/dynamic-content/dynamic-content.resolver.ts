import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../app.entity';
import {
  CreateDynamicContentInput,
  DynamicContentFilter,
  DynamicContentResponse,
  DynamicContentSort,
  DynamicContentsResponse,
  UpdateDynamicContentInput,
} from './dynamic-content.entity';
import { DynamicContentService } from './dynamic-content.service';

@Resolver()
export class DynamicContentResolver {
  constructor(private service: DynamicContentService) {}

  @Query(() => DynamicContentsResponse)
  async dynamicContents(
    @Args('sort', { nullable: true }) sort: DynamicContentSort,
    @Args('filter', { nullable: true }) filter: DynamicContentFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.dynamicContents(sort, filter, pagination);
  }

  @Mutation(() => DynamicContentResponse)
  async createDynamicContent(@Args('input') input: CreateDynamicContentInput) {
    return this.service.createDynamicContent(input);
  }

  @Mutation(() => DynamicContentResponse)
  async updateDynamicContent(
    @Args('id') id: number,
    @Args('input') input: UpdateDynamicContentInput,
  ) {
    return this.service.updateDynamicContent(id, input);
  }
}
