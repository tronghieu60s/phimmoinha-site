import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../app.entity';
import { GqlAuthGuard } from '../auth/auth.guard';
import {
  CreateRoleInput,
  Role,
  RoleFilter,
  RoleResponse,
  RoleSort,
  RolesResponse,
  UpdateRoleInput,
} from './role.entity';
import { RoleService } from './role.service';

@Resolver(() => Role)
@UseGuards(GqlAuthGuard)
export class RoleResolver {
  constructor(private service: RoleService) {}

  @Query(() => RoleResponse)
  async role(
    @Args('id', { nullable: true }) id: number,
    @Args('filter', { nullable: true }) filter: RoleFilter,
  ) {
    return this.service.role(id, filter);
  }

  @Query(() => RolesResponse)
  async roles(
    @Args('sort', { nullable: true }) sort: RoleSort,
    @Args('filter', { nullable: true }) filter: RoleFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.roles(sort, filter, pagination);
  }

  @Mutation(() => RoleResponse)
  async createRole(@Args('input') input: CreateRoleInput) {
    const eInput = { ...input, Name: input.Name.trim() };
    return this.service.createRole(eInput);
  }

  @Mutation(() => RoleResponse)
  async updateRole(@Args('id') id: number, @Args('input') input: UpdateRoleInput) {
    const eInput = { ...input, Name: input.Name.trim() };
    return this.service.updateRole(id, eInput);
  }

  @Mutation(() => RoleResponse)
  async deleteRole(@Args('id') id: number) {
    return this.service.deleteRole(id);
  }
}
