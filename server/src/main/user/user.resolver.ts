import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BooleanResponse, PaginationInput } from '../app.entity';
import { GqlAuthGuard } from '../auth/auth.guard';
import {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFilter,
  UserResponse,
  UserSectionFilter,
  UserSectionResponse,
  UserSectionSort,
  UserSort,
  UsersResponse,
} from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private service: UserService) {}

  @Query(() => UserResponse)
  async user(
    @Args('id', { nullable: true }) id: number,
    @Args('filter', { nullable: true }) filter: UserFilter,
  ) {
    return this.service.user(id, filter);
  }

  @Query(() => UsersResponse)
  async users(
    @Args('sort', { nullable: true }) sort: UserSort,
    @Args('filter', { nullable: true }) filter: UserFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.users(sort, filter, pagination);
  }

  @Query(() => UserSectionResponse)
  async userSections(
    @Args('sort', { nullable: true }) sort: UserSectionSort,
    @Args('filter', { nullable: true }) filter: UserSectionFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.userSections(sort, filter, pagination);
  }

  @Mutation(() => UserResponse)
  async createUser(@Args('input') input: CreateUserInput) {
    const eInput = { ...input, UserName: input.UserName.trim(), Email: input.Email.trim() };
    return this.service.createUser(eInput);
  }

  @Mutation(() => UserResponse)
  async updateUser(@Args('id') id: number, @Args('input') input: UpdateUserInput) {
    return this.service.updateUser(id, input);
  }

  @Mutation(() => BooleanResponse)
  async deleteManyUsers(@Args('ids', { type: () => [Number] }) ids: number[]) {
    return this.service.deleteManyUsers(ids);
  }
}
