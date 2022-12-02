import { Injectable } from '@nestjs/common';
import { mapDataFilter } from 'src/core/commonService';
import { PaginationInput } from '../app.entity';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePermissionInput,
  PermissionFilter,
  PermissionSort,
  UpdatePermissionInput,
} from './permission.entity';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async permission(id: number, filter: PermissionFilter) {
    let item = null;
    const permissionsModel = this.prisma.permissions;

    if (id) {
      item = await permissionsModel.findUnique({ where: { Id: id } });
    } else if (filter) {
      item = await permissionsModel.findFirst({ where: mapDataFilter(filter || {}) });
    }

    return { Data: item };
  }

  async permissions(sort: PermissionSort, filter: PermissionFilter, pagination: PaginationInput) {
    const { All = false, Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const permissionsModel = this.prisma.permissions;

    const query = {
      where: mapDataFilter(filter || {}),
      orderBy: sort || { Id: 'desc' },
    };
    const paginationQuery = {
      take: PageSize,
      skip: (Page - 1) * PageSize,
    };
    const [items, totalItems] = await this.prisma.$transaction([
      permissionsModel.findMany({ ...query, ...(All ? {} : paginationQuery) }),
      permissionsModel.count(query),
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

  async createPermission(input: CreatePermissionInput) {
    const { Name } = input;
    const permissionsModel = this.prisma.permissions;

    const findPermission = await permissionsModel.findUnique({ where: { Name } });
    if (findPermission) {
      throw new Error('VALIDATE_PERMISSION_NAME_EXISTED');
    }

    const item = await permissionsModel.create({ data: { ...input } });

    return { Data: item, InsertId: item.Id };
  }

  async updatePermission(id: number, input: UpdatePermissionInput) {
    const { Name } = input;
    const permissionsModel = this.prisma.permissions;

    if (Name) {
      const findPermission = await permissionsModel.findUnique({ where: { Name } });
      if (findPermission && findPermission.Id !== id) {
        throw new Error('VALIDATE_PERMISSION_NAME_EXISTED');
      }
    }

    const item = await permissionsModel.update({ data: { ...input }, where: { Id: id } });
    if (!item) {
      throw new Error('ERROR_PERMISSION_NOT_FOUND');
    }

    return { Data: item, RowsAffected: 1 };
  }

  async deletePermission(id: number) {
    const permissionsModel = this.prisma.permissions;

    const findPermission = await permissionsModel.findUnique({ where: { Id: id } });
    if (!findPermission) {
      throw new Error('ERROR_PERMISSION_NOT_FOUND');
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const permissionsModel = tx.permissions;
      const permissionRelationshipsModel = tx.rolePermissionRelationships;

      await permissionRelationshipsModel.deleteMany({ where: { Permission_Ref: id } });
      const item = await permissionsModel.delete({ where: { Id: id } });

      return { Data: item, RowsAffected: 1 };
    });
  }
}
