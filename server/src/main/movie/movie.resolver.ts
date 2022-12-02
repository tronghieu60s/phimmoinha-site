import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BooleanResponse, PaginationInput } from '../app.entity';
import { AssetResponse, CreateAssetInput } from '../asset/asset.entity';
import { CurrentUser } from '../auth/auth.decorator';
import { GqlAuthGuard } from '../auth/auth.guard';
import { User } from '../user/user.entity';
import {
  CreateMovieInput,
  Movie,
  MovieFilter,
  MovieResponse,
  MovieSort,
  MoviesResponse,
  UpdateMovieInput,
} from './movie.entity';
import { MovieService } from './movie.service';

@Resolver(() => Movie)
@UseGuards(GqlAuthGuard)
export class MovieResolver {
  constructor(private service: MovieService) {}

  @Query(() => MovieResponse)
  async movie(
    @Args('id', { nullable: true }) id: number,
    @Args('filter', { nullable: true }) filter: MovieFilter,
    @Args('isFilterId', { nullable: true }) isFilterId: boolean,
  ) {
    return this.service.movie(id, filter, isFilterId);
  }

  @Query(() => MoviesResponse)
  async movies(
    @Args('sort', { nullable: true }) sort: MovieSort,
    @Args('filter', { nullable: true }) filter: MovieFilter,
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ) {
    return this.service.movies(sort, filter, pagination);
  }

  @Mutation(() => AssetResponse)
  async importMovies(@CurrentUser() user: User, @Args('input') input: CreateAssetInput) {
    return this.service.importMovies(user, input);
  }

  @Mutation(() => AssetResponse)
  async exportMovies(
    @CurrentUser() user: User,
    @Args('filter', { nullable: true }) filter: MovieFilter,
  ) {
    return this.service.exportMovies(user, filter);
  }

  @Mutation(() => AssetResponse)
  async importEpisodes(@CurrentUser() user: User, @Args('input') input: CreateAssetInput) {
    return this.service.importEpisodes(user, input);
  }

  @Mutation(() => AssetResponse)
  async exportEpisodes(@CurrentUser() user: User) {
    return this.service.exportEpisodes(user);
  }

  @Mutation(() => MovieResponse)
  async createMovie(@CurrentUser() user: User, @Args('input') input: CreateMovieInput) {
    const eInput = { ...input, Title: input?.Title?.trim(), Slug: input?.Slug?.trim() };
    return this.service.createMovie(user, eInput);
  }

  @Mutation(() => MovieResponse)
  async updateMovie(
    @Args('id') id: number,
    @CurrentUser() user: User,
    @Args('input') input: UpdateMovieInput,
  ) {
    const eInput = { ...input, Title: input?.Title?.trim(), Slug: input?.Slug?.trim() };
    return this.service.updateMovie(id, user, eInput);
  }

  @Mutation(() => MovieResponse)
  async deleteMovie(@Args('id') id: number) {
    return this.service.deleteMovie(id);
  }

  @Mutation(() => BooleanResponse)
  async deleteManyMovies(@Args('ids', { type: () => [Number] }) ids: number[]) {
    return this.service.deleteManyMovies(ids);
  }

  @Mutation(() => BooleanResponse)
  async deleteTrashMovies(@Args('ids', { type: () => [Number], nullable: true }) ids: number[]) {
    return this.service.deleteTrashMovies(ids);
  }

  @Mutation(() => BooleanResponse)
  async restoreManyMovies(@Args('ids', { type: () => [Number] }) ids: number[]) {
    return this.service.restoreManyMovies(ids);
  }

  @Mutation(() => BooleanResponse)
  async increaseViewMovie(@Args('id') id: number) {
    return this.service.increaseViewMovie(id);
  }
}
