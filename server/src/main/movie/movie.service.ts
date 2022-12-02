import { Injectable } from '@nestjs/common';
import { MoviesStatus } from '@prisma/client';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import { generateSlug, readFileStream, writeFileStream } from 'src/core/commonFuncs';
import { mapDataFilter, mapImportEpisodes, mapImportMovies } from 'src/core/commonService';
import { PaginationInput } from '../app.entity';
import { CreateAssetInput } from '../asset/asset.entity';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../user/user.entity';
import { CreateMovieInput, MovieFilter, MovieSort, UpdateMovieInput } from './movie.entity';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  async movie(id: number, filter: MovieFilter, isFilterId = false) {
    let item = null;
    const moviesModel = this.prisma.movies;

    if (id) {
      item = await moviesModel.findFirst({
        where: {
          Id: id,
          Status: { equals: MoviesStatus.Published },
          ...(isFilterId ? { ...mapDataFilter(filter || {}) } : {}),
        },
        include: {
          User: true,
          MovieEpisodes: { orderBy: { Order: 'asc' } },
          MovieTaxonomyRelationships: { include: { Taxonomy: true } },
          _count: { select: { MovieEpisodes: true } },
        },
      });
    } else if (filter && !isFilterId) {
      item = await moviesModel.findFirst({
        where: { Status: { equals: MoviesStatus.Published }, ...mapDataFilter(filter || {}) },
        include: {
          User: true,
          MovieEpisodes: { orderBy: { Order: 'asc' } },
          MovieTaxonomyRelationships: { include: { Taxonomy: true } },
          _count: { select: { MovieEpisodes: true } },
        },
      });
    }

    if (item) {
      item.Episodes = item.MovieEpisodes;
      item.EpisodesCount = item._count.MovieEpisodes;
      item.Taxonomies = item.MovieTaxonomyRelationships.map((item) => item.Taxonomy);
      delete item.MovieTaxonomyRelationships;
    }

    return { Data: item };
  }

  async movies(sort: MovieSort, filter: MovieFilter, pagination: PaginationInput) {
    const { All, Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const moviesModel = this.prisma.movies;

    const query = {
      where: {
        Status: { equals: MoviesStatus.Published },
        ...mapDataFilter(filter || {}),
      },
      orderBy: sort || { Id: 'desc' },
    };
    const paginationQuery = {
      take: PageSize,
      skip: (Page - 1) * PageSize,
    };
    const [items, totalItems] = await this.prisma.$transaction([
      moviesModel.findMany({
        ...query,
        ...(All ? {} : paginationQuery),
        include: {
          User: true,
          MovieTaxonomyRelationships: { include: { Taxonomy: true } },
          _count: { select: { MovieEpisodes: true } },
        },
      }),
      moviesModel.count(query),
    ]);

    const itemsData = items.map((item) => ({
      ...item,
      EpisodesCount: item._count.MovieEpisodes,
      Taxonomies: item.MovieTaxonomyRelationships.map((item) => item.Taxonomy),
    }));

    const pageTotal = Math.ceil(totalItems / PageSize);
    const nextPage = Page >= pageTotal ? null : Page + 1;
    const previousPage = Page <= 1 ? null : Page - 1;
    console.log(itemsData);
    return {
      Data: {
        Items: itemsData,
        Pagination: {
          All,
          Total: totalItems,
          Page,
          PageSize,
          PageTotal: pageTotal,
          NextPage: nextPage,
          PreviousPage: previousPage,
        },
      },
    };
  }

  async importMovies(user: User, input: CreateAssetInput) {
    const { Id: DefaultUserRef } = user;

    const assetsModel = this.prisma.assets;

    const file = await readFileStream(await input.File, 'imports');
    const { size, filename, pathname, pathfile } = file as any;

    const csvString = fs.readFileSync(pathname, 'utf8');
    const { data: csvData } = Papa.parse(csvString, { header: true, skipEmptyLines: true });

    try {
      await this.prisma.$transaction(
        async (tx: PrismaService) => {
          const moviesModel = tx.movies;
          const taxonomiesModel = tx.taxonomies;
          const taxonomyRelationshipsModel = tx.movieTaxonomyRelationships;

          const moviesData = csvData.map((item) => ({
            User_Ref: DefaultUserRef,
            ...mapImportMovies(item),
          }));
          await moviesModel.createMany({ data: moviesData, skipDuplicates: true });

          let taxonomiesData = [];
          for (const csvItem of csvData) {
            const { User_Ref = DefaultUserRef } = csvItem;
            const tagsList = csvItem.Tags ? csvItem.Tags.split(',') : [];
            const categoriesList = csvItem.Categories ? csvItem.Categories.split(',') : [];

            taxonomiesData = taxonomiesData.concat(
              ...tagsList.map((taxonomy) => ({
                Type: 'Tag',
                Name: taxonomy,
                Slug: generateSlug(taxonomy),
                User_Ref,
              })),
            );

            taxonomiesData = taxonomiesData.concat(
              ...categoriesList.map((taxonomy) => ({
                Type: 'Movie_Category',
                Name: taxonomy,
                Slug: generateSlug(taxonomy),
                User_Ref,
              })),
            );
          }

          await taxonomiesModel.createMany({
            data: taxonomiesData,
            skipDuplicates: true,
          });

          let taxonomiesRelationshipsData = [];
          for (const csvItem of csvData) {
            const Id = Number(csvItem.Id);
            const movie = await moviesModel.findUnique({ where: { Id } });

            const Tags = csvItem.Tags ? csvItem.Tags.split(',') : [];
            const Categories = csvItem.Categories ? csvItem.Categories.split(',') : [];

            const taxonomiesRelationships = await taxonomiesModel.findMany({
              where: { Name: { in: [...Tags, ...Categories] } },
            });

            if (movie)
              taxonomiesRelationshipsData = taxonomiesRelationshipsData.concat(
                ...taxonomiesRelationships.map((taxonomy) => ({
                  Taxonomy_Ref: taxonomy.Id,
                  Movie_Ref: Id,
                })),
              );
          }

          await taxonomyRelationshipsModel.createMany({
            data: taxonomiesRelationshipsData,
            skipDuplicates: true,
          });
        },
        { maxWait: csvData.length * 20, timeout: csvData.length * 50 },
      );
    } catch (error) {
      console.error(error);
      fs.unlinkSync(pathname);
      throw new Error('ERROR_MOVIE_IMPORT_FAILED');
    }

    if (fs.existsSync(pathname)) {
      fs.unlinkSync(pathname);
    }

    const item = await assetsModel.create({
      data: {
        Type: 'Import-Movies',
        Name: filename,
        Path: pathfile,
        Size: size,
        User_Ref: DefaultUserRef,
      },
    });

    return { Data: item, RowsAffected: csvData.length };
  }

  async exportMovies(user: User, filter: MovieFilter) {
    const { Id: User_Ref } = user;

    const assetsModel = this.prisma.assets;
    const moviesModel = this.prisma.movies;

    const items = await moviesModel.findMany({
      where: mapDataFilter(filter || {}),
      include: { MovieTaxonomyRelationships: { include: { Taxonomy: true } } },
      orderBy: { Id: 'asc' },
    });

    const csvData = items.map((item) => {
      const { DatePublish, DateModified, MovieTaxonomyRelationships, ...movie } = item;

      delete movie.CreatedAt;
      delete movie.UpdatedAt;

      return {
        ...movie,
        Tags: MovieTaxonomyRelationships.map((item) => item.Taxonomy)
          .filter((taxonomy) => taxonomy.Type === 'Tag')
          .map((taxonomy) => taxonomy.Name)
          .join(','),
        Categories: MovieTaxonomyRelationships.map((item) => item.Taxonomy)
          .filter((taxonomy) => taxonomy.Type === 'Movie_Category')
          .map((taxonomy) => taxonomy.Name)
          .join(','),
        DatePublish,
        DateModified,
      };
    });

    const csvString = Papa.unparse(csvData, { header: true });
    const csvBuffer = Buffer.from(csvString, 'utf8');

    const file = writeFileStream(csvBuffer, 'csv', 'exports');
    const { size, filename, pathfile } = file;

    const item = await assetsModel.create({
      data: { Type: 'Export-Movies', Name: filename, Path: pathfile, Size: size, User_Ref },
    });

    return { Data: item };
  }

  async importEpisodes(user: User, input: CreateAssetInput) {
    const { Id: User_Ref } = user;

    const assetsModel = this.prisma.assets;
    const file = await readFileStream(await input.File, 'imports');
    const { size, filename, pathname, pathfile } = file as any;

    const csvString = fs.readFileSync(pathname, 'utf8');
    const { data: csvData } = Papa.parse(csvString, { header: true, skipEmptyLines: true });

    try {
      await this.prisma.$transaction(
        async (tx: PrismaService) => {
          const moviesModel = tx.movies;
          const movieEpisodesModel = tx.movieEpisodes;

          const movies = await moviesModel.findMany({ select: { Id: true } });
          const moviesIds = movies.map((item) => item.Id);

          const episodesData = csvData
            .filter((item) => moviesIds.includes(Number(item.Movie_Ref)))
            .map((item) => ({ User_Ref, ...mapImportEpisodes(item) }));
          await movieEpisodesModel.createMany({ data: episodesData, skipDuplicates: true });
        },
        { maxWait: csvData.length * 20, timeout: csvData.length * 50 },
      );
    } catch (error) {
      console.error(error);
      fs.unlinkSync(pathname);
      throw new Error('ERROR_EPISODE_IMPORT_FAILED');
    }

    if (fs.existsSync(pathname)) {
      fs.unlinkSync(pathname);
    }

    const item = await assetsModel.create({
      data: { Type: 'Import-Episodes', Name: filename, Path: pathfile, Size: size, User_Ref },
    });

    return { Data: item, RowsAffected: csvData.length };
  }

  async exportEpisodes(user: User) {
    const { Id: User_Ref } = user;

    const assetsModel = this.prisma.assets;
    const movieEpisodesModel = this.prisma.movieEpisodes;

    const items = await movieEpisodesModel.findMany({ orderBy: { Id: 'asc' } });

    const csvData = items.map((item) => {
      delete item.CreatedAt;
      delete item.UpdatedAt;

      return item;
    });

    const csvString = Papa.unparse(csvData, { header: true });
    const csvBuffer = Buffer.from(csvString, 'utf8');

    const file = writeFileStream(csvBuffer, 'csv', 'exports');
    const { size, filename, pathfile } = file;

    const item = await assetsModel.create({
      data: { Type: 'Export-Episodes', Name: filename, Path: pathfile, Size: size, User_Ref },
    });

    return { Data: item };
  }

  async createMovie(user: User, input: CreateMovieInput) {
    const { Id: User_Ref } = user;
    const { Title, Slug } = input;
    const moviesModel = this.prisma.movies;

    if (Title) {
      const findMovie = await moviesModel.findFirst({ where: { Title } });
      if (findMovie) {
        throw new Error('VALIDATE_MOVIE_TITLE_EXISTED');
      }
    }

    if (Slug) {
      const findMovie = await moviesModel.findFirst({ where: { Slug } });
      if (findMovie) {
        throw new Error('VALIDATE_MOVIE_SLUG_EXISTED');
      }
    }

    if (Title && !Slug) {
      input.Slug = generateSlug(Title);
      const findMovies = await moviesModel.findMany({ where: { Slug: input.Slug } });
      if (findMovies.length > 0) {
        input.Slug += findMovies.length;
      }
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const { DatePublish, Episodes, Taxonomies, ...restInput } = input;

      const moviesModel = tx.movies;
      const movieEpisodesModel = tx.movieEpisodes;
      const taxonomiesModel = tx.taxonomies;
      const taxonomyRelationshipsModel = tx.movieTaxonomyRelationships;

      const item = await moviesModel.create({
        data: {
          ...restInput,
          User_Ref,
          DatePublish: new Date(DatePublish),
        },
      });

      if (Episodes) {
        const episodes = Episodes.map(async (episode) => {
          const Id = episode.Id || 0;
          const EDate = new Date(episode.Date) || new Date();

          await movieEpisodesModel.upsert({
            where: { Id },
            create: { ...episode, Date: EDate, User_Ref, Movie_Ref: item.Id },
            update: { ...episode, Date: EDate },
          });
        });

        await Promise.all(episodes);
      }

      if (Taxonomies) {
        const taxonomies = Taxonomies.map(async (taxonomy) => {
          const { Name, Slug } = taxonomy;

          if (Name && !Slug) {
            taxonomy.Slug = generateSlug(Name);
            const findMovies = await moviesModel.findMany({ where: { Slug: taxonomy.Slug } });
            if (findMovies.length > 0) {
              taxonomy.Slug += findMovies.length;
            }
          }

          const { Id, ...restTaxonomy } = taxonomy;
          if (Id) {
            const relationship = await taxonomyRelationshipsModel.findFirst({
              where: { Taxonomy_Ref: Id, Movie_Ref: item.Id },
            });
            if (!relationship) {
              await taxonomyRelationshipsModel.create({
                data: { Taxonomy_Ref: Id, Movie_Ref: item.Id },
              });
            }
            return;
          }

          const created = await taxonomiesModel.create({ data: { ...restTaxonomy, User_Ref } });
          await taxonomyRelationshipsModel.create({
            data: { Taxonomy_Ref: created.Id, Movie_Ref: item.Id },
          });
        });
        await Promise.all(taxonomies);
      }

      return { Data: item, InsertId: item.Id };
    });
  }

  async updateMovie(id: number, user: User, input: UpdateMovieInput) {
    const { Id: User_Ref } = user;
    const { Title, Slug } = input;
    const moviesModel = this.prisma.movies;

    if (Title) {
      const findMovie = await moviesModel.findFirst({ where: { Title } });
      if (findMovie && findMovie.Id !== id) {
        throw new Error('VALIDATE_MOVIE_TITLE_EXISTED');
      }
    }

    if (Slug) {
      const findMovie = await moviesModel.findFirst({ where: { Slug } });
      if (findMovie && findMovie.Id !== id) {
        throw new Error('VALIDATE_MOVIE_SLUG_EXISTED');
      }
    }

    if (Title && !Slug) {
      input.Slug = generateSlug(Title);
      const findMovies = await moviesModel.findMany({ where: { Slug: input.Slug } });
      if (findMovies.length > 0) {
        input.Slug += findMovies.length;
      }
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const { DatePublish, Episodes, Taxonomies, ...restInput } = input;

      const moviesModel = tx.movies;
      const movieEpisodesModel = tx.movieEpisodes;
      const taxonomiesModel = tx.taxonomies;
      const taxonomyRelationshipsModel = tx.movieTaxonomyRelationships;

      const item = await moviesModel.update({
        data: {
          ...restInput,
          DatePublish: new Date(DatePublish),
          DateModified: new Date(),
        },
        where: { Id: id },
      });
      if (!item) {
        throw new Error('ERROR_MOVIE_NOT_FOUND');
      }

      if (Episodes) {
        const episodes = Episodes.map(async (episode) => {
          const Id = episode?.Id || 0;
          const EDate = new Date(episode?.Date || new Date());

          await movieEpisodesModel.upsert({
            where: { Id },
            create: { ...episode, Date: EDate, User_Ref, Movie_Ref: item.Id },
            update: { ...episode, Date: EDate },
          });
        });

        await Promise.all(episodes);
      }

      if (Taxonomies) {
        const taxonomies = Taxonomies.map(async (taxonomy) => {
          const { Name, Slug } = taxonomy;

          if (Name && !Slug) {
            taxonomy.Slug = generateSlug(Name);
            const findMovies = await moviesModel.findMany({ where: { Slug: taxonomy.Slug } });
            if (findMovies.length > 0) {
              taxonomy.Slug += findMovies.length;
            }
          }

          const { Id, ...restTaxonomy } = taxonomy;
          if (Id) {
            const relationship = await taxonomyRelationshipsModel.findFirst({
              where: { Taxonomy_Ref: Id, Movie_Ref: item.Id },
            });
            if (!relationship) {
              await taxonomyRelationshipsModel.create({
                data: { Taxonomy_Ref: Id, Movie_Ref: item.Id },
              });
            }
            return;
          }

          const created = await taxonomiesModel.create({ data: { ...restTaxonomy, User_Ref } });
          await taxonomyRelationshipsModel.create({
            data: { Taxonomy_Ref: created.Id, Movie_Ref: item.Id },
          });
        });
        await Promise.all(taxonomies);
      }

      return { Data: item, RowsAffected: 1 };
    });
  }

  async deleteMovie(id: number) {
    const moviesModel = this.prisma.movies;

    const findMovie = await moviesModel.findUnique({ where: { Id: id } });
    if (!findMovie) {
      throw new Error('ERROR_MOVIE_NOT_FOUND');
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const moviesModel = tx.movies;
      const taxonomyRelationshipsModel = tx.movieTaxonomyRelationships;

      const item = await moviesModel.findUnique({ where: { Id: id } });
      if (item.Status === 'Trash') {
        await taxonomyRelationshipsModel.deleteMany({ where: { Movie_Ref: id } });

        await moviesModel.delete({ where: { Id: id } });
      }

      if (item.Status !== 'Trash') {
        await moviesModel.update({ data: { Status: 'Trash' }, where: { Id: id } });
      }

      return { Data: item, RowsAffected: 1 };
    });
  }

  async deleteManyMovies(ids: number[]) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const moviesModel = tx.movies;
      const taxonomyRelationshipsModel = tx.movieTaxonomyRelationships;

      const itemsTrash = await moviesModel.findMany({
        where: { Id: { in: ids }, Status: 'Trash' },
      });
      const idsTrash = itemsTrash.map((item) => item.Id);

      await taxonomyRelationshipsModel.deleteMany({
        where: { Movie_Ref: { in: idsTrash } },
      });
      const items = await moviesModel.deleteMany({ where: { Id: { in: idsTrash } } });

      const itemsNotTrash = await moviesModel.updateMany({
        data: { Status: 'Trash' },
        where: { Id: { in: ids }, Status: { not: 'Trash' } },
      });

      return {
        Data: ids.length === items.count + itemsNotTrash.count,
        RowsAffected: items.count + itemsNotTrash.count,
      };
    });
  }

  async deleteTrashMovies(ids: number[]) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const moviesModel = tx.movies;
      const taxonomyRelationshipsModel = tx.movieTaxonomyRelationships;

      if (!ids) {
        const items = await moviesModel.findMany({
          where: { Status: 'Trash' },
        });
        ids = items.map((item) => item.Id);
      }

      await taxonomyRelationshipsModel.deleteMany({
        where: { Movie_Ref: { in: ids } },
      });
      const deleted = await moviesModel.deleteMany({ where: { Id: { in: ids } } });

      return { Data: ids.length === deleted.count, RowsAffected: deleted.count };
    });
  }

  async restoreManyMovies(ids: number[]) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const moviesModel = tx.movies;

      const items = await moviesModel.updateMany({
        data: { Status: 'Draft' },
        where: { Id: { in: ids }, Status: 'Trash' },
      });

      return { Data: ids.length === items.count, RowsAffected: items.count };
    });
  }

  async increaseViewMovie(id: number) {
    const moviesModel = this.prisma.movies;

    const findMovie = await moviesModel.findUnique({ where: { Id: id } });
    if (!findMovie) {
      throw new Error('ERROR_MOVIE_NOT_FOUND');
    }

    await moviesModel.update({ data: { Views: { increment: 1 } }, where: { Id: id } });

    return { Data: true, RowsAffected: 1 };
  }
}
