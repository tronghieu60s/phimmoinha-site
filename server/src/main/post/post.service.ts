import { Injectable } from '@nestjs/common';
import { PostsStatus } from '@prisma/client';
import { generateSlug } from 'src/core/commonFuncs';
import { mapDataFilter } from 'src/core/commonService';
import { PaginationInput } from '../app.entity';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../user/user.entity';
import { CreatePostInput, PostFilter, PostSort, UpdatePostInput } from './post.entity';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async post(id: number, filter: PostFilter, isFilterId = false) {
    let item = null;
    const postsModel = this.prisma.posts;

    if (id) {
      item = await postsModel.findFirst({
        where: {
          Id: id,
          Status: { equals: PostsStatus.Published },
          ...(isFilterId ? { ...mapDataFilter(filter || {}) } : {}),
        },
        include: { User: true, PostTaxonomyRelationships: { include: { Taxonomy: true } } },
      });
    } else if (filter && !isFilterId) {
      item = await postsModel.findFirst({
        where: { Status: { equals: PostsStatus.Published }, ...mapDataFilter(filter || {}) },
        include: { User: true, PostTaxonomyRelationships: { include: { Taxonomy: true } } },
      });
    }

    if (item) {
      item.Taxonomies = item.PostTaxonomyRelationships.map((item) => item.Taxonomy);
      delete item.PostTaxonomyRelationships;
    }

    return { Data: item };
  }

  async posts(sort: PostSort, filter: PostFilter, pagination: PaginationInput) {
    const { All, Page = 1, PageSize = Number(APP_LIMIT_PAGINATION) } = pagination || {};
    const postsModel = this.prisma.posts;

    const query = {
      where: {
        Status: { equals: PostsStatus.Published },
        ...mapDataFilter(filter || {}),
      },
      orderBy: sort || { Id: 'desc' },
    };
    const paginationQuery = {
      take: PageSize,
      skip: (Page - 1) * PageSize,
    };
    const [items, totalItems] = await this.prisma.$transaction([
      postsModel.findMany({
        ...query,
        ...(All ? {} : paginationQuery),
        include: { User: true, PostTaxonomyRelationships: { include: { Taxonomy: true } } },
      }),
      postsModel.count(query),
    ]);

    const itemsData = items.map((item) => ({
      ...item,
      Taxonomies: item.PostTaxonomyRelationships.map((item) => item.Taxonomy),
    }));

    const pageTotal = Math.ceil(totalItems / PageSize);
    const nextPage = Page >= pageTotal ? null : Page + 1;
    const previousPage = Page <= 1 ? null : Page - 1;

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

  async createPost(user: User, input: CreatePostInput) {
    const { Id: User_Ref } = user;
    const { Title, Slug } = input;
    const postsModel = this.prisma.posts;

    if (Title) {
      const findPost = await postsModel.findFirst({ where: { Title } });
      if (findPost) {
        throw new Error('VALIDATE_POST_TITLE_EXISTED');
      }
    }

    if (Slug) {
      const findPost = await postsModel.findFirst({ where: { Slug } });
      if (findPost) {
        throw new Error('VALIDATE_POST_SLUG_EXISTED');
      }
    }

    if (Title && !Slug) {
      input.Slug = generateSlug(Title);
      const findPosts = await postsModel.findMany({ where: { Slug: input.Slug } });
      if (findPosts.length > 0) {
        input.Slug += findPosts.length;
      }
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const { Taxonomies, DatePublish, ...restInput } = input;

      const postsModel = tx.posts;
      const taxonomiesModel = tx.taxonomies;
      const taxonomyRelationshipsModel = tx.postTaxonomyRelationships;

      const item = await postsModel.create({
        data: {
          ...restInput,
          User_Ref,
          DatePublish: new Date(DatePublish),
        },
      });

      if (Taxonomies) {
        await taxonomyRelationshipsModel.deleteMany({
          where: { Post_Ref: item.Id },
        });

        const taxonomies = Taxonomies.map(async (taxonomy) => {
          const { Name, Slug } = taxonomy;

          if (Name && !Slug) {
            taxonomy.Slug = generateSlug(Name);
            const findPosts = await postsModel.findMany({ where: { Slug: taxonomy.Slug } });
            if (findPosts.length > 0) {
              taxonomy.Slug += findPosts.length;
            }
          }

          const { Id, ...restTaxonomy } = taxonomy;
          if (Id) {
            return await taxonomyRelationshipsModel.create({
              data: { Taxonomy_Ref: Id, Post_Ref: item.Id },
            });
          }

          const created = await taxonomiesModel.create({ data: { User_Ref, ...restTaxonomy } });
          await taxonomyRelationshipsModel.create({
            data: { Taxonomy_Ref: created.Id, Post_Ref: item.Id },
          });
        });
        await Promise.all(taxonomies);
      }

      return { Data: item, InsertId: item.Id };
    });
  }

  async updatePost(id: number, user: User, input: UpdatePostInput) {
    const { Id: User_Ref } = user;
    const { Title, Slug } = input;
    const postsModel = this.prisma.posts;

    if (Title) {
      const findPost = await postsModel.findFirst({ where: { Title } });
      if (findPost && findPost.Id !== id) {
        throw new Error('VALIDATE_POST_TITLE_EXISTED');
      }
    }

    if (Slug) {
      const findPost = await postsModel.findFirst({ where: { Slug } });
      if (findPost && findPost.Id !== id) {
        throw new Error('VALIDATE_POST_SLUG_EXISTED');
      }
    }

    if (Title && !Slug) {
      input.Slug = generateSlug(Title);
      const findPosts = await postsModel.findMany({ where: { Slug: input.Slug } });
      if (findPosts.length > 0) {
        input.Slug += findPosts.length;
      }
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const { Taxonomies, DatePublish, ...restInput } = input;

      const postsModel = tx.posts;
      const taxonomiesModel = tx.taxonomies;
      const taxonomyRelationshipsModel = tx.postTaxonomyRelationships;

      const item = await postsModel.update({
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

      if (Taxonomies) {
        await taxonomyRelationshipsModel.deleteMany({
          where: { Post_Ref: item.Id },
        });

        const taxonomies = Taxonomies.map(async (taxonomy) => {
          const { Name, Slug } = taxonomy;

          if (Name && !Slug) {
            taxonomy.Slug = generateSlug(Name);
            const findPosts = await postsModel.findMany({ where: { Slug: taxonomy.Slug } });
            if (findPosts.length > 0) {
              taxonomy.Slug += findPosts.length;
            }
          }

          const { Id, ...restTaxonomy } = taxonomy;
          if (Id) {
            return await taxonomyRelationshipsModel.create({
              data: { Taxonomy_Ref: Id, Post_Ref: item.Id },
            });
          }

          const created = await taxonomiesModel.create({ data: { User_Ref, ...restTaxonomy } });
          await taxonomyRelationshipsModel.create({
            data: { Taxonomy_Ref: created.Id, Post_Ref: item.Id },
          });
        });
        await Promise.all(taxonomies);
      }

      return { Data: item, RowsAffected: 1 };
    });
  }

  async deletePost(id: number) {
    const postsModel = this.prisma.posts;

    const findPost = await postsModel.findUnique({ where: { Id: id } });
    if (!findPost) {
      throw new Error('ERROR_MOVIE_NOT_FOUND');
    }

    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const postsModel = tx.posts;
      const taxonomyRelationshipsModel = tx.postTaxonomyRelationships;

      const item = await postsModel.findUnique({ where: { Id: id } });
      if (item.Status === 'Trash') {
        await taxonomyRelationshipsModel.deleteMany({ where: { Post_Ref: id } });

        await postsModel.delete({ where: { Id: id } });
      }

      if (item.Status !== 'Trash') {
        await postsModel.update({ data: { Status: 'Trash' }, where: { Id: id } });
      }

      return { Data: item, RowsAffected: 1 };
    });
  }

  async deleteManyPosts(ids: number[]) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const postsModel = tx.posts;
      const taxonomyRelationshipsModel = tx.postTaxonomyRelationships;

      const itemsTrash = await postsModel.findMany({
        where: { Id: { in: ids }, Status: 'Trash' },
      });
      const idsTrash = itemsTrash.map((item) => item.Id);

      await taxonomyRelationshipsModel.deleteMany({
        where: { Post_Ref: { in: idsTrash } },
      });
      const items = await postsModel.deleteMany({ where: { Id: { in: idsTrash } } });

      const itemsNotTrash = await postsModel.updateMany({
        data: { Status: 'Trash' },
        where: { Id: { in: ids }, Status: { not: 'Trash' } },
      });

      return {
        Data: ids.length === items.count + itemsNotTrash.count,
        RowsAffected: items.count + itemsNotTrash.count,
      };
    });
  }

  async deleteTrashPosts(ids: number[]) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const postsModel = tx.posts;
      const taxonomyRelationshipsModel = tx.postTaxonomyRelationships;

      if (!ids) {
        const items = await postsModel.findMany({
          where: { Status: 'Trash' },
        });
        ids = items.map((item) => item.Id);
      }

      await taxonomyRelationshipsModel.deleteMany({
        where: { Post_Ref: { in: ids } },
      });
      const deleted = await postsModel.deleteMany({ where: { Id: { in: ids } } });

      return { Data: ids.length === deleted.count, RowsAffected: deleted.count };
    });
  }

  async restoreManyPosts(ids: number[]) {
    return await this.prisma.$transaction(async (tx: PrismaService) => {
      const postsModel = tx.posts;

      const items = await postsModel.updateMany({
        data: { Status: 'Draft' },
        where: { Id: { in: ids }, Status: 'Trash' },
      });

      return { Data: ids.length === items.count, RowsAffected: items.count };
    });
  }

  async increaseViewPost(id: number) {
    const postsModel = this.prisma.posts;

    const findPost = await postsModel.findUnique({ where: { Id: id } });
    if (!findPost) {
      throw new Error('ERROR_MOVIE_NOT_FOUND');
    }

    await postsModel.update({ data: { Views: { increment: 1 } }, where: { Id: id } });

    return { Data: true, RowsAffected: 1 };
  }
}
