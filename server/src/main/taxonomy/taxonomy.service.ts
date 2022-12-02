import { Injectable } from '@nestjs/common';
import { generateSlug } from 'src/core/commonFuncs';
import { mapDataFilter } from 'src/core/commonService';
import { PaginationInput } from '../app.entity';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../user/user.entity';
import {
  CreateTaxonomyInput,
  TaxonomyFilter,
  TaxonomySort,
  UpdateTaxonomyInput,
} from './taxonomy.entity';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

@Injectable()
export class TaxonomyService {
  constructor(private readonly prisma: PrismaService) {}

  async taxonomy(id: number, filter: TaxonomyFilter) {
    let item = null;
    const taxonomiesModel = this.prisma.taxonomies;

    if (id) {
      item = await taxonomiesModel.findUnique({ where: { Id: id } });
    } else if (filter) {
      item = await taxonomiesModel.findFirst({ where: mapDataFilter(filter || {}) });
    }

    return { Data: item };
  }

  async taxonomies(sort: TaxonomySort, filter: TaxonomyFilter, pagination: PaginationInput) {
    const { All, Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const taxonomiesModel = this.prisma.taxonomies;

    const query = {
      where: mapDataFilter(filter || {}),
      orderBy: sort || { Id: 'desc' },
    };
    const paginationQuery = {
      take: PageSize,
      skip: (Page - 1) * PageSize,
    };
    const [items, totalItems] = await this.prisma.$transaction([
      taxonomiesModel.findMany({ ...query, ...(All ? {} : paginationQuery) }),
      taxonomiesModel.count(query),
    ]);

    const pageTotal = Math.ceil(totalItems / PageSize);
    const nextPage = Page >= pageTotal ? null : Page + 1;
    const previousPage = Page <= 1 ? null : Page - 1;

    return {
      Data: {
        Items: items,
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

  async createTaxonomy(user: User, input: CreateTaxonomyInput) {
    const { Id: User_Ref } = user;
    const { Type, Name, Slug } = input;
    const taxonomiesModel = this.prisma.taxonomies;

    const findTaxonomy = await taxonomiesModel.findFirst({ where: { Type, Name } });
    if (findTaxonomy) {
      throw new Error('VALIDATE_TAXONOMY_NAME_EXISTED');
    }

    if (Slug) {
      const findTaxonomy = await taxonomiesModel.findFirst({ where: { Type, Slug } });
      if (findTaxonomy) {
        throw new Error('VALIDATE_TAXONOMY_SLUG_EXISTED');
      }
    }

    if (Name && !Slug) {
      input.Slug = generateSlug(Name);
      const findTaxonomies = await taxonomiesModel.findMany({ where: { Type, Slug: input.Slug } });
      if (findTaxonomies.length > 0) {
        input.Slug += findTaxonomies.length;
      }
    }

    const item = await taxonomiesModel.create({ data: { User_Ref, ...input } });

    return { Data: item, InsertId: item.Id };
  }

  async updateTaxonomy(id: number, input: UpdateTaxonomyInput) {
    const { Name, Slug } = input;
    const taxonomiesModel = this.prisma.taxonomies;

    const taxonomy = await taxonomiesModel.findFirst({ where: { Id: id } });
    if (!taxonomy) {
      throw new Error('ERROR_TAXONOMY_NOT_FOUND');
    }

    if (Name) {
      const findTaxonomy = await taxonomiesModel.findFirst({
        where: { Type: taxonomy.Type, Name },
      });
      if (findTaxonomy && findTaxonomy.Id !== id) {
        throw new Error('VALIDATE_TAXONOMY_NAME_EXISTED');
      }
    }

    if (Slug) {
      const findTaxonomy = await taxonomiesModel.findFirst({
        where: { Type: taxonomy.Type, Slug },
      });
      if (findTaxonomy && findTaxonomy.Id !== id) {
        throw new Error('VALIDATE_TAXONOMY_SLUG_EXISTED');
      }
    }

    if (Name && !Slug) {
      input.Slug = generateSlug(Name);
      const findTaxonomies = await taxonomiesModel.findMany({
        where: { Type: taxonomy.Type, Slug: input.Slug },
      });
      if (findTaxonomies.length > 0) {
        input.Slug += findTaxonomies.length;
      }
    }

    const item = await taxonomiesModel.update({ data: input, where: { Id: id } });

    return { Data: item, RowsAffected: 1 };
  }

  async deleteManyTaxonomies(ids: number[]) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const taxonomiesModel = tx.taxonomies;
      const postTaxonomyRelationshipsModel = tx.postTaxonomyRelationships;
      const movieTaxonomyRelationshipsModel = tx.movieTaxonomyRelationships;

      await postTaxonomyRelationshipsModel.deleteMany({ where: { Taxonomy_Ref: { in: ids } } });
      await movieTaxonomyRelationshipsModel.deleteMany({ where: { Taxonomy_Ref: { in: ids } } });
      const item = await taxonomiesModel.deleteMany({ where: { Id: { in: ids } } });

      return { Data: ids.length === item.count, RowsAffected: item.count };
    });
  }
}
