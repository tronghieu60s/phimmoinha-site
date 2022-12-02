import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../app.entity';
import { CurrentUser } from '../auth/auth.decorator';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../user/user.entity';
import {
  CreateLibraryInput,
  LibrariesResponse,
  Library,
  LibraryFilter,
  LibraryResponse,
  LibrarySort,
  UpdateLibraryInput,
} from './library.entity';
import { LibraryService } from './library.service';

@Resolver(() => Library)
@UseGuards(GqlAuthGuard)
export class LibraryResolver {
  constructor(private service: LibraryService) {}

  @Query(() => LibraryResponse)
  async library(
    @Args('id', { nullable: true }) id: number,
    @Args('filter', { nullable: true }) filter: LibraryFilter,
  ) {
    return this.service.library(id, filter);
  }

  @Query(() => LibrariesResponse)
  async libraries(
    @Args('sort', { nullable: true }) sort: LibrarySort,
    @Args('filter', { nullable: true }) filter: LibraryFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.libraries(sort, filter, pagination);
  }

  @Mutation(() => LibraryResponse)
  async createLibrary(@CurrentUser() user: User, @Args('input') input: CreateLibraryInput) {
    return this.service.createLibrary(user, input);
  }

  @Mutation(() => LibraryResponse)
  async updateLibrary(@Args('id') id: number, @Args('input') input: UpdateLibraryInput) {
    return this.service.updateLibrary(id, input);
  }

  @Mutation(() => LibraryResponse)
  async deleteLibrary(@Args('id') id: number) {
    return this.service.deleteLibrary(id);
  }
}
