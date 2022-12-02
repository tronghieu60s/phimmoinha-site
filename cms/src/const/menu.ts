import { MenuType } from '@const/types';
import { t } from 'i18next';
import { Activity, Camera, File, FileMinus, Film, Monitor, Settings, User } from 'react-feather';

export default function useMenu() {
  return [
    {
      key: '',
      icon: Activity,
      hidden: true,
    },
    {
      key: 'dashboard',
      title: t('site:title.dashboard'),
      icon: Activity,
    },
    {
      key: 'pages',
      title: t('site:title.pages'),
      icon: FileMinus,
      children: [
        {
          key: 'list',
          title: t('site:title.pages.list'),
        },
        {
          key: 'create',
          title: t('site:title.pages.create'),
        },
        {
          key: 'update',
          title: t('site:title.pages.update'),
          hidden: true,
        },
        {
          key: 'trash',
          title: t('site:title.pages.trash'),
          hidden: true,
        },
      ],
    },
    {
      key: 'posts',
      title: t('site:title.posts'),
      icon: File,
      children: [
        {
          key: 'list',
          title: t('site:title.posts.list'),
        },
        {
          key: 'create',
          title: t('site:title.posts.create'),
        },
        {
          key: 'update',
          title: t('site:title.posts.update'),
          hidden: true,
        },
        {
          key: 'trash',
          title: t('site:title.posts.trash'),
          hidden: true,
        },
        {
          key: 'post_tag',
          path: '/posts/taxonomy?type=Tag',
          title: t('site:title.terms.tag.list'),
        },
        {
          key: 'post_category',
          path: '/posts/taxonomy?type=Post_Category',
          title: t('site:title.terms.post_category.list'),
        },
      ],
    },
    {
      key: 'movies',
      title: t('site:title.movies'),
      icon: Film,
      children: [
        {
          key: 'list',
          title: t('site:title.movies.list'),
        },
        {
          key: 'create',
          title: t('site:title.movies.create'),
        },
        {
          key: 'update',
          title: t('site:title.movies.update'),
          hidden: true,
        },
        {
          key: 'trash',
          title: t('site:title.movies.trash'),
          hidden: true,
        },
        {
          key: 'movie_tag',
          path: '/movies/taxonomy?type=Tag',
          title: t('site:title.terms.tag.list'),
        },
        {
          key: 'movie_category',
          path: '/movies/taxonomy?type=Movie_Category',
          title: t('site:title.terms.movie_category.list'),
        },
        {
          key: 'movie_country',
          path: '/movies/taxonomy?type=Country',
          title: t('site:title.terms.country.list'),
        },
        {
          key: 'movie_director',
          path: '/movies/taxonomy?type=Director',
          title: t('site:title.terms.director.list'),
        },
        {
          key: 'movie_cast',
          path: '/movies/taxonomy?type=Cast',
          title: t('site:title.terms.cast.list'),
        },
      ],
    },
    {
      key: 'media',
      title: t('site:title.media'),
      icon: Camera,
      children: [
        {
          key: 'list',
          title: t('site:title.media.list'),
        },
        {
          key: 'create',
          title: t('site:title.media.create'),
        },
      ],
    },
    {
      key: 'users',
      title: t('site:title.users'),
      icon: User,
      children: [
        {
          key: 'role',
          title: t('site:title.users.role'),
        },
        {
          key: 'permission',
          title: t('site:title.users.permission'),
        },
        {
          key: 'list',
          title: t('site:title.users.list'),
        },
        {
          key: 'create',
          title: t('site:title.users.create'),
        },
        {
          key: 'update',
          title: t('site:title.users.update'),
          hidden: true,
        },
      ],
    },
    // {
    //   key: 'tools',
    //   title: t('site:title.tools'),
    //   icon: Tool,
    //   children: [
    //     {
    //       key: 'import',
    //       title: t('site:title.tools.import'),
    //     },
    //     {
    //       key: 'export',
    //       title: t('site:title.tools.export'),
    //     },
    //   ],
    // },
    {
      key: 'config',
      title: t('site:title.config'),
      icon: Settings,
      children: [
        {
          key: 'site',
          title: t('site:title.config.site'),
        },
        {
          key: 'cms',
          title: t('site:title.config.cms'),
        },
        {
          key: 'library',
          title: t('site:title.config.library'),
        },
      ],
    },
    {
      key: 'interface',
      title: t('site:title.interface'),
      icon: Monitor,
      children: [
        {
          key: 'keywords',
          title: t('site:title.interface.keywords'),
        },
        {
          key: 'header',
          title: t('site:title.interface.header'),
        },
        {
          key: 'footer',
          title: t('site:title.interface.footer'),
        },
      ],
    },
  ] as MenuType[];
}
