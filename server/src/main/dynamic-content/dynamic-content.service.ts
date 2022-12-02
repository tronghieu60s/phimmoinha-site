import { Injectable } from '@nestjs/common';
import { mapDataFilter } from 'src/core/commonService';
import { PaginationInput } from '../app.entity';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDynamicContentInput,
  DynamicContentFilter,
  DynamicContentSort,
  UpdateDynamicContentInput,
} from './dynamic-content.entity';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

@Injectable()
export class DynamicContentService {
  constructor(private readonly prisma: PrismaService) {}

  async dynamicContents(
    sort: DynamicContentSort,
    filter: DynamicContentFilter,
    pagination: PaginationInput,
  ) {
    const { Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const usersModel = this.prisma.dynamicContents;

    const query = {
      take: PageSize,
      where: mapDataFilter(filter || {}),
      orderBy: sort || { Id: 'desc' },
    };
    const [items, totalItems] = await this.prisma.$transaction([
      usersModel.findMany({ ...query, skip: (Page - 1) * PageSize }),
      usersModel.count(query),
    ]);

    const pageTotal = Math.ceil(totalItems / PageSize);
    const nextPage = Page >= pageTotal ? null : Page + 1;
    const previousPage = Page <= 1 ? null : Page - 1;

    return {
      Data: {
        Items: items,
        Pagination: {
          Page,
          PageSize,
          PageTotal: pageTotal,
          NextPage: nextPage,
          PreviousPage: previousPage,
        },
      },
    };
  }

  async createDynamicContent(input: CreateDynamicContentInput) {
    const dynamicContentsModel = this.prisma.dynamicContents;
    const item = await dynamicContentsModel.create({ data: input });
    return { Data: item, InsertId: item.Id };
  }

  async updateDynamicContent(id: number, input: UpdateDynamicContentInput) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const dynamicContentsModel = tx.dynamicContents;
      const dynamicContentHistoriesModel = tx.dynamicContentHistories;

      const item = await dynamicContentsModel.findUnique({ where: { Id: id } });
      if (!item) {
        throw new Error('ERROR_DYNAMIC_CONTENT_NOT_FOUND');
      }

      await dynamicContentHistoriesModel.create({
        data: {
          User_Ref: 1,
          DynamicContent_Ref: id,
          Value: input.Value,
          PreviousValue: item.Value,
        },
      });

      const updated = await dynamicContentsModel.update({ where: { Id: id }, data: input });

      return { Data: updated, RowAffected: 1 };
    });
  }
}
