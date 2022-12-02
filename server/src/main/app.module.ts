import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { join } from 'path';
import { AnalyticModule } from './analytic/analytic.module';
import { AuthModule } from './auth/auth.module';
import { DynamicContentModule } from './dynamic-content/dynamic-content.module';
import { EventModule } from './event/event.module';
import { LibraryModule } from './library/library.module';
import { MovieModule } from './movie/movie.module';
import { PermissionModule } from './permission/permission.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesGuard } from './role/role.guard';
import { RoleModule } from './role/role.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { UserModule } from './user/user.module';
import { AssetModule } from './asset/asset.module';

@Module({
  imports: [
    EventModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../public'),
      renderPath: '/',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), '/schema.gql'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    MovieModule,
    TaxonomyModule,
    AnalyticModule,
    PostModule,
    DynamicContentModule,
    LibraryModule,
    AssetModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
