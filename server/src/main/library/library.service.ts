import { Injectable } from '@nestjs/common';
import { mapDataFilter } from 'src/core/commonService';
import { PaginationInput } from '../app.entity';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../user/user.entity';
import {
  CreateLibraryInput,
  LibraryFilter,
  LibrarySort,
  UpdateLibraryInput,
} from './library.entity';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async library(id: number, filter: LibraryFilter) {
    let item = null;
    const librariesModel = this.prisma.libraries;

    if (id) {
      item = await librariesModel.findUnique({ where: { Id: id } });
    } else if (filter) {
      item = await librariesModel.findFirst({ where: mapDataFilter(filter || {}) });
    }

    return { Data: item };
  }

  async libraries(sort: LibrarySort, filter: LibraryFilter, pagination: PaginationInput) {
    const { All, Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const librariesModel = this.prisma.libraries;

    const query = {
      where: mapDataFilter(filter || {}),
      orderBy: sort || { Id: 'desc' },
    };
    const paginationQuery = {
      take: PageSize,
      skip: (Page - 1) * PageSize,
    };
    const [items, totalItems] = await this.prisma.$transaction([
      librariesModel.findMany({ ...query, ...(All ? {} : paginationQuery) }),
      librariesModel.count(query),
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

  async createLibrary(user: User, input: CreateLibraryInput) {
    const { Id: User_Ref } = user;
    const { Type, Key } = input;

    if (Key) {
      const findLibrary = await this.prisma.libraries.findFirst({ where: { Type, Key } });
      if (findLibrary) {
        throw new Error('VALIDATE_LIBRARY_KEY_EXISTED');
      }
    }

    const librariesModel = this.prisma.libraries;
    const item = await librariesModel.create({ data: { ...input, User_Ref } });

    return { Data: item, InsertId: item.Id };
  }

  async updateLibrary(id: number, input: UpdateLibraryInput) {
    const librariesModel = this.prisma.libraries;
    const { Key } = input;

    const library = await librariesModel.findFirst({ where: { Id: id } });
    if (!library) {
      throw new Error('ERROR_TAXONOMY_NOT_FOUND');
    }

    if (Key) {
      const findLibrary = await this.prisma.libraries.findFirst({
        where: { Type: library.Type, Key },
      });
      if (findLibrary && findLibrary.Id !== id) {
        throw new Error('VALIDATE_LIBRARY_KEY_EXISTED');
      }
    }

    const item = await librariesModel.update({ where: { Id: id }, data: input });

    return { Data: item, RowsAffected: 1 };
  }

  async deleteLibrary(id: number) {
    const librariesModel = this.prisma.libraries;
    const item = await librariesModel.delete({ where: { Id: id } });

    return { Data: item, RowsAffected: 1 };
  }
}
