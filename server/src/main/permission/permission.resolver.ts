import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../app.entity';
import { GqlAuthGuard } from '../auth/auth.guard';
import {
  CreatePermissionInput,
  Permission,
  PermissionFilter,
  PermissionResponse,
  PermissionSort,
  PermissionsResponse,
  UpdatePermissionInput,
} from './permission.entity';
import { PermissionService } from './permission.service';

@Resolver(() => Permission)
@UseGuards(GqlAuthGuard)
export class PermissionResolver {
  constructor(private service: PermissionService) {}

  @Query(() => PermissionResponse)
  async permission(
    @Args('id', { nullable: true }) id: number,
    @Args('filter', { nullable: true }) filter: PermissionFilter,
  ) {
    return this.service.permission(id, filter);
  }

  @Query(() => PermissionsResponse)
  async permissions(
    @Args('sort', { nullable: true }) sort: PermissionSort,
    @Args('filter', { nullable: true }) filter: PermissionFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.permissions(sort, filter, pagination);
  }

  @Mutation(() => PermissionResponse)
  async createPermission(@Args('input') input: CreatePermissionInput) {
    const eInput = { ...input, Name: input.Name.trim() };
    return this.service.createPermission(eInput);
  }

  @Mutation(() => PermissionResponse)
  async updatePermission(@Args('id') id: number, @Args('input') input: UpdatePermissionInput) {
    const eInput = { ...input, Name: input.Name.trim() };
    return this.service.updatePermission(id, eInput);
  }

  @Mutation(() => PermissionResponse)
  async deletePermission(@Args('id') id: number) {
    return this.service.deletePermission(id);
  }
}
