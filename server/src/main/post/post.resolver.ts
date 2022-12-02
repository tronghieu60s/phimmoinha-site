import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BooleanResponse, PaginationInput } from '../app.entity';
import { CurrentUser } from '../auth/auth.decorator';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../user/user.entity';
import {
  CreatePostInput,
  PostFilter,
  PostResponse,
  PostSort,
  PostsResponse,
  UpdatePostInput,
} from './post.entity';
import { PostService } from './post.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class PostResolver {
  constructor(private service: PostService) {}

  @Query(() => PostResponse)
  async post(
    @Args('id', { nullable: true }) id: number,
    @Args('filter', { nullable: true }) filter: PostFilter,
    @Args('isFilterId', { nullable: true }) isFilterId: boolean,
  ) {
    return this.service.post(id, filter, isFilterId);
  }

  @Query(() => PostsResponse)
  async posts(
    @Args('sort', { nullable: true }) sort: PostSort,
    @Args('filter', { nullable: true }) filter: PostFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.posts(sort, filter, pagination);
  }

  @Mutation(() => PostResponse)
  async createPost(@CurrentUser() user: User, @Args('input') input: CreatePostInput) {
    const eInput = { ...input, Title: input?.Title?.trim(), Slug: input?.Slug?.trim() };
    return this.service.createPost(user, eInput);
  }

  @Mutation(() => PostResponse)
  async updatePost(
    @Args('id') id: number,
    @CurrentUser() user: User,
    @Args('input') input: UpdatePostInput,
  ) {
    const eInput = { ...input, Title: input?.Title?.trim(), Slug: input?.Slug?.trim() };
    return this.service.updatePost(id, user, eInput);
  }

  @Mutation(() => PostResponse)
  async deletePost(@Args('id') id: number) {
    return this.service.deletePost(id);
  }

  @Mutation(() => BooleanResponse)
  async deleteManyPosts(@Args('ids', { type: () => [Number] }) ids: number[]) {
    return this.service.deleteManyPosts(ids);
  }

  @Mutation(() => BooleanResponse)
  async deleteTrashPosts(@Args('ids', { type: () => [Number], nullable: true }) ids: number[]) {
    return this.service.deleteTrashPosts(ids);
  }

  @Mutation(() => BooleanResponse)
  async restoreManyPosts(@Args('ids', { type: () => [Number] }) ids: number[]) {
    return this.service.restoreManyPosts(ids);
  }

  @Mutation(() => BooleanResponse)
  async increaseViewPost(@Args('id') id: number) {
    return this.service.increaseViewPost(id);
  }
}
