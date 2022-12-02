import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BooleanResponse, PaginationInput } from '../app.entity';
import { CurrentUser } from '../auth/auth.decorator';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../user/user.entity';
import {
  CreateTaxonomyInput,
  TaxonomiesResponse,
  Taxonomy,
  TaxonomyFilter,
  TaxonomyResponse,
  TaxonomySort,
  UpdateTaxonomyInput,
} from './taxonomy.entity';
import { TaxonomyService } from './taxonomy.service';

@Resolver(() => Taxonomy)
@UseGuards(GqlAuthGuard)
export class TaxonomyResolver {
  constructor(private readonly service: TaxonomyService) {}

  @Query(() => TaxonomyResponse)
  async taxonomy(
    @Args('id', { nullable: true }) id: number,
    @Args('filter', { nullable: true }) filter: TaxonomyFilter,
  ) {
    return this.service.taxonomy(id, filter);
  }

  @Query(() => TaxonomiesResponse)
  async taxonomies(
    @Args('sort', { nullable: true }) sort: TaxonomySort,
    @Args('filter', { nullable: true }) filter: TaxonomyFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.taxonomies(sort, filter, pagination);
  }

  @Mutation(() => TaxonomyResponse)
  async createTaxonomy(@CurrentUser() user: User, @Args('input') input: CreateTaxonomyInput) {
    const eInput = { ...input, Name: input?.Name?.trim(), Slug: input?.Slug?.trim() };
    return this.service.createTaxonomy(user, eInput);
  }

  @Mutation(() => TaxonomyResponse)
  async updateTaxonomy(@Args('id') id: number, @Args('input') input: UpdateTaxonomyInput) {
    const eInput = { ...input, Name: input?.Name?.trim(), Slug: input?.Slug?.trim() };
    return this.service.updateTaxonomy(id, eInput);
  }

  @Mutation(() => BooleanResponse)
  async deleteManyTaxonomies(@Args('ids', { type: () => [Number] }) ids: number[]) {
    return this.service.deleteManyTaxonomies(ids);
  }
}
