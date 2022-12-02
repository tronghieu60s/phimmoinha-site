import { Injectable } from '@nestjs/common';
import { mapDataFilter } from 'src/core/commonService';
import { PaginationInput } from '../app.entity';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleInput, RoleFilter, RoleSort, UpdateRoleInput } from './role.entity';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async role(id: number, filter: RoleFilter) {
    let item = null;
    const rolesModel = this.prisma.roles;

    const include = {
      RolePermissionRelationships: {
        select: { Permission: true },
      },
    };
    if (id) {
      item = await rolesModel.findUnique({ where: { Id: id }, include });
    } else if (filter) {
      item = await rolesModel.findFirst({ where: mapDataFilter(filter || {}), include });
    }

    item.Permissions = item.RolePermissionRelationships.map((item) => item.Permission);
    delete item.RolePermissionRelationships;

    return { Data: item };
  }

  async roles(sort: RoleSort, filter: RoleFilter, pagination: PaginationInput) {
    const { All = false, Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const rolesModel = this.prisma.roles;

    const query = {
      where: mapDataFilter(filter || {}),
      orderBy: sort || { Id: 'desc' },
    };
    const paginationQuery = {
      take: PageSize,
      skip: (Page - 1) * PageSize,
    };
    const [items, totalItems] = await this.prisma.$transaction([
      rolesModel.findMany({ ...query, ...(All ? {} : paginationQuery) }),
      rolesModel.count(query),
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

  async createRole(input: CreateRoleInput) {
    const { Name } = input;
    const { Permissions, ...restInput } = input;
    const rolesModel = this.prisma.roles;

    const findRole = await rolesModel.findUnique({ where: { Name } });
    if (findRole) {
      throw new Error('VALIDATE_ROLE_NAME_EXISTED');
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const rolesModel = tx.roles;
      const roleRelationshipsModel = tx.rolePermissionRelationships;

      const item = await rolesModel.create({ data: { ...restInput } });

      if (Permissions) {
        const roleRelationships = Permissions.map((Id) => ({
          Role_Ref: item.Id,
          Permission_Ref: Id,
        }));
        await roleRelationshipsModel.createMany({ data: roleRelationships });
      }

      return { Data: item, InsertId: item.Id };
    });
  }

  async updateRole(id: number, input: UpdateRoleInput) {
    const { Name } = input;
    const { Permissions, ...restInput } = input;
    const rolesModel = this.prisma.roles;

    if (Name) {
      const findName = await rolesModel.findFirst({ where: { Name } });
      if (findName && findName.Id !== id) {
        throw new Error('VALIDATE_ROLE_NAME_EXISTED');
      }
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const rolesModel = tx.roles;
      const roleRelationshipsModel = tx.rolePermissionRelationships;

      const item = await rolesModel.update({ data: { ...restInput }, where: { Id: id } });
      if (!item) {
        throw new Error('ERROR_ROLE_NOT_FOUND');
      }

      if (Permissions) {
        await roleRelationshipsModel.deleteMany({ where: { Role_Ref: item.Id } });
        const roleRelationships = Permissions.map((Id) => ({
          Role_Ref: item.Id,
          Permission_Ref: Id,
        }));
        await roleRelationshipsModel.createMany({ data: roleRelationships });
      }

      return { Data: item, RowsAffected: 1 };
    });
  }

  async deleteRole(id: number) {
    const rolesModel = this.prisma.roles;

    const findRoles = await rolesModel.findUnique({ where: { Id: id } });
    if (!findRoles) {
      throw new Error('ERROR_ROLE_NOT_FOUND');
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const rolesModel = tx.roles;
      const roleRelationshipsModel = tx.rolePermissionRelationships;

      await roleRelationshipsModel.deleteMany({ where: { Role_Ref: id } });
      const item = await rolesModel.delete({ where: { Id: id } });

      return { Data: item, RowsAffected: 1 };
    });
  }
}
