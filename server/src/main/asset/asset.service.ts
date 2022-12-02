import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { readFileStream } from 'src/core/commonFuncs';
import { mapDataFilter } from 'src/core/commonService';
import { PaginationInput } from '../app.entity';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../user/user.entity';
import { AssetFilter, AssetSort, CreateAssetInput } from './asset.entity';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}

  async asset(id: number, filter: AssetFilter) {
    let item = null;
    const assetsModel = this.prisma.assets;

    if (id) {
      item = await assetsModel.findUnique({ where: { Id: id }, include: { User: true } });
    } else if (filter) {
      item = await assetsModel.findFirst({
        where: mapDataFilter(filter || {}),
        include: { User: true },
      });
    }

    return { Data: item };
  }

  async assets(sort: AssetSort, filter: AssetFilter, pagination: PaginationInput) {
    const { All, Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const assetsModel = this.prisma.assets;

    const query = {
      where: mapDataFilter(filter || {}),
      orderBy: sort || { Id: 'desc' },
    };
    const paginationQuery = {
      take: PageSize,
      skip: (Page - 1) * PageSize,
    };
    const [items, totalItems] = await this.prisma.$transaction([
      assetsModel.findMany({
        ...query,
        ...(All ? {} : paginationQuery),
        include: { User: true },
      }),
      assetsModel.count(query),
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

  async createAsset(user: User, input: CreateAssetInput) {
    const { Id: User_Ref } = user;

    const assetsModel = this.prisma.assets;

    const file = await readFileStream(await input.File, 'imports');
    const { size, filename, pathfile } = file as any;

    const item = await assetsModel.create({
      data: { Type: 'Upload', Name: filename, Path: pathfile, Size: size, User_Ref },
    });

    return { Data: item, InsertId: item.Id };
  }

  async deleteManyAssets(ids: number[]) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const assetsModel = tx.assets;

      const items = await assetsModel.findMany({ where: { Id: { in: ids } } });
      const deleted = await assetsModel.deleteMany({ where: { Id: { in: ids } } });
      if (deleted) {
        for (const item of items) {
          if (fs.existsSync(item.Path)) {
            fs.unlinkSync(item.Path);
          }
        }
      }

      return {
        Data: ids.length === deleted.count,
        RowsAffected: deleted.count,
      };
    });
  }
}
