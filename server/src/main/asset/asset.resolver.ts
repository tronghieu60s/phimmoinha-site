import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BooleanResponse, PaginationInput } from '../app.entity';
import { CurrentUser } from '../auth/auth.decorator';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../user/user.entity';
import {
  Asset,
  AssetFilter,
  AssetResponse,
  AssetSort,
  AssetsResponse,
  CreateAssetInput,
} from './asset.entity';
import { AssetService } from './asset.service';

@Resolver(() => Asset)
@UseGuards(GqlAuthGuard)
export class AssetResolver {
  constructor(private service: AssetService) {}

  @Query(() => AssetResponse)
  async asset(
    @Args('id', { nullable: true }) id: number,
    @Args('filter', { nullable: true }) filter: AssetFilter,
  ) {
    return this.service.asset(id, filter);
  }

  @Query(() => AssetsResponse)
  async assets(
    @Args('sort', { nullable: true }) sort: AssetSort,
    @Args('filter', { nullable: true }) filter: AssetFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.assets(sort, filter, pagination);
  }

  @Mutation(() => BooleanResponse)
  async createAsset(@CurrentUser() user: User, @Args('input') input: CreateAssetInput) {
    return this.service.createAsset(user, input);
  }

  @Mutation(() => BooleanResponse)
  async deleteManyAssets(@Args('ids', { type: () => [Number] }) ids: number[]) {
    return this.service.deleteManyAssets(ids);
  }
}
