import PageNotFound from '@common/Pages/PageNotFound';
import { SiteType } from '@const/types';
import ConfigLibraryPage from '@pages/Config/ConfigLibraryPage';
import MoviesCreatePage from '@pages/Movies/MoviesCreatePage';
import MoviesListPage from '@pages/Movies/MoviesListPage';
import MoviesTrashPage from '@pages/Movies/MoviesTrashPage';
import MoviesUpdatePage from '@pages/Movies/MoviesUpdatePage';
import PagesCreatePage from '@pages/Pages/PagesCreatePage';
import PagesListPage from '@pages/Pages/PagesListPage';
import PagesTrashPage from '@pages/Pages/PagesTrashPage';
import PagesUpdatePage from '@pages/Pages/PagesUpdatePage';
import PermissionsListPage from '@pages/Permissions/PermissionsListPage';
import PostsCreatePage from '@pages/Posts/PostsCreatePage';
import PostsListPage from '@pages/Posts/PostsListPage';
import PostsTrashPage from '@pages/Posts/PostsTrashPage';
import PostsUpdatePage from '@pages/Posts/PostsUpdatePage';
import RolesListPage from '@pages/Roles/RolesListPage';
import TaxonomiesListPage from '@pages/Taxonomies/TaxonomiesListPage';
import UsersCreatePage from '@pages/Users/UsersCreatePage';
import UsersListPage from '@pages/Users/UsersListPage';
import UsersUpdatePage from '@pages/Users/UsersUpdatePage';

export default function useSite() {
  return [
    {
      key: '',
      element: PageNotFound,
    },
    {
      key: 'dashboard',
      element: PageNotFound,
    },
    {
      key: 'pages',
      element: UsersListPage,
      children: [
        {
          key: 'list',
          element: PagesListPage,
        },
        {
          key: 'create',
          element: PagesCreatePage,
        },
        {
          key: 'update',
          path: '/:id/update',
          element: PagesUpdatePage,
        },
        {
          key: 'trash',
          element: PagesTrashPage,
        },
      ],
    },
    {
      key: 'posts',
      element: PostsListPage,
      children: [
        {
          key: 'list',
          element: PostsListPage,
        },
        {
          key: 'create',
          element: PostsCreatePage,
        },
        {
          key: 'update',
          path: '/:id/update',
          element: PostsUpdatePage,
        },
        {
          key: 'trash',
          element: PostsTrashPage,
        },
        {
          key: 'terms',
          path: '/taxonomy',
          element: TaxonomiesListPage,
        },
      ],
    },
    {
      key: 'movies',
      element: UsersListPage,
      children: [
        {
          key: 'list',
          element: MoviesListPage,
        },
        {
          key: 'create',
          element: MoviesCreatePage,
        },
        {
          key: 'update',
          path: '/:id/update',
          element: MoviesUpdatePage,
        },
        {
          key: 'trash',
          element: MoviesTrashPage,
        },
        {
          key: 'terms',
          path: '/taxonomy',
          element: TaxonomiesListPage,
        },
      ],
    },
    // {
    //   key: 'media',
    //   element: MediaListPage,
    //   children: [
    //     {
    //       key: 'list',
    //       element: MediaListPage,
    //     },
    //     {
    //       key: 'create',
    //       element: MediaCreatePage,
    //     },
    //   ],
    // },
    {
      key: 'users',
      element: UsersListPage,
      children: [
        {
          key: 'role',
          element: RolesListPage,
        },
        {
          key: 'permission',
          element: PermissionsListPage,
        },
        {
          key: 'list',
          element: UsersListPage,
        },
        {
          key: 'create',
          element: UsersCreatePage,
        },
        {
          key: 'update',
          path: '/:id/update',
          element: UsersUpdatePage,
        },
      ],
    },
    // {
    //   key: 'tools',
    //   element: PageNotFound,
    //   children: [
    //     {
    //       key: 'import',
    //       element: ToolsImportPage,
    //     },
    //     {
    //       key: 'export',
    //       element: ToolsExportPage,
    //     },
    //   ],
    // },
    {
      key: 'config',
      element: PageNotFound,
      children: [
        {
          key: 'library',
          element: ConfigLibraryPage,
        },
        // {
        //   key: 'site',
        //   element: ConfigSitePage,
        // },
        // {
        //   key: 'keywords',
        //   element: ConfigKeywordsPage,
        // },
        // {
        //   key: 'header',
        //   element: ConfigHeaderPage,
        // },
        // {
        //   key: 'footer',
        //   element: ConfigFooterPage,
        // },
        // {
        //   key: 'cms',
        //   element: ConfigCmsPage,
        // },
      ],
    },
  ] as SiteType[];
}
