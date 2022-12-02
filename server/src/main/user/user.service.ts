import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { mapDataFilter } from 'src/core/commonService';
import { PaginationInput } from '../app.entity';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserInput,
  UpdateUserInput,
  UserFilter,
  UserSectionFilter,
  UserSectionSort,
  UserSort,
} from './user.entity';

const { APP_LIMIT_PAGINATION, APP_LIMIT_BCRYPT_ROUNDS: rounds } = process.env;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async user(id: number, filter: UserFilter) {
    let item = null;
    const usersModel = this.prisma.users;

    if (id) {
      item = await usersModel.findUnique({ where: { Id: id }, include: { Role: true } });
    } else if (filter) {
      item = await usersModel.findFirst({
        where: mapDataFilter(filter || {}),
        include: { Role: true },
      });
    }

    return { Data: item };
  }

  async users(sort: UserSort, filter: UserFilter, pagination: PaginationInput) {
    const { All, Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const usersModel = this.prisma.users;

    const query = {
      where: mapDataFilter(filter || {}),
      orderBy: sort || { Id: 'desc' },
    };
    const paginationQuery = {
      take: PageSize,
      skip: (Page - 1) * PageSize,
    };
    const [items, totalItems] = await this.prisma.$transaction([
      usersModel.findMany({
        ...query,
        ...(All ? {} : paginationQuery),
        include: { Role: true, UserSections: true },
      }),
      usersModel.count(query),
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

  async userSections(
    sort: UserSectionSort,
    filter: UserSectionFilter,
    pagination: PaginationInput,
  ) {
    const { All = false, Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const usersModel = this.prisma.userSections;

    const query = {
      where: mapDataFilter(filter || {}),
      orderBy: sort,
    };
    const paginationQuery = {
      take: PageSize,
      skip: (Page - 1) * PageSize,
    };
    const [items, totalItems] = await this.prisma.$transaction([
      usersModel.findMany({
        ...query,
        ...(All ? {} : paginationQuery),
        include: { User: true },
      }),
      usersModel.count(query),
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

  async createUser(input: CreateUserInput) {
    const { Role_Ref, UserName, Email, Password } = input;
    const rolesModel = this.prisma.roles;
    const usersModel = this.prisma.users;

    const firstUser = await usersModel.findFirst({
      where: { OR: [{ UserName }, { Email }] },
    });
    if (firstUser) {
      if (firstUser.UserName === UserName) {
        throw new Error('VALIDATE_USER_USERNAME_EXISTED');
      }
      if (firstUser.Email === Email) {
        throw new Error('VALIDATE_USER_EMAIL_EXISTED');
      }
    }

    if (!Role_Ref) {
      const findRole = await rolesModel.upsert({
        where: { Name: 'Member' },
        update: {},
        create: { Name: 'Member' },
      });
      input.Role_Ref = findRole.Id;
    }

    if (Password) {
      input.Password = bcrypt.hashSync(Password, Number(rounds));
    }

    const item = await usersModel.create({ data: { ...input } });

    return { Data: item, InsertId: item.Id };
  }

  async updateUser(id: number, input: UpdateUserInput) {
    const { Role_Ref, Password } = input;
    const rolesModel = this.prisma.roles;
    const usersModel = this.prisma.users;

    if (!Role_Ref) {
      const findRole = await rolesModel.upsert({
        where: { Name: 'Member' },
        update: {},
        create: { Name: 'Member' },
      });
      input.Role_Ref = findRole.Id;
    }

    if (Password) {
      input.Password = bcrypt.hashSync(Password, Number(rounds));
    }

    const item = await usersModel.update({ data: { ...input }, where: { Id: id } });
    if (!item) {
      throw new Error('ERROR_USER_NOT_FOUND');
    }

    return { Data: item, RowsAffected: 1 };
  }

  async deleteManyUsers(ids: number[]) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const usersModel = tx.users;

      const items = await usersModel.deleteMany({ where: { Id: { in: ids } } });

      return {
        Data: ids.length === items.count,
        RowsAffected: items.count,
      };
    });
  }
}
