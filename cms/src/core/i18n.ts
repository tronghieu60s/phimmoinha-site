import viAuth from '@translations/vi/auth.json';
import viCommon from '@translations/vi/common.json';
import viConfig from '@translations/vi/config.json';
import viErrors from '@translations/vi/errors.json';
import viLibraries from '@translations/vi/libraries.json';
import viMovies from '@translations/vi/movies.json';
import viPermissions from '@translations/vi/permissions.json';
import viPosts from '@translations/vi/posts.json';
import viRoles from '@translations/vi/roles.json';
import viSite from '@translations/vi/site.json';
import viTaxonomies from '@translations/vi/taxonomies.json';
import viTools from '@translations/vi/tools.json';
import viUploads from '@translations/vi/uploads.json';
import viUsers from '@translations/vi/users.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    translation: {
      auth: viAuth,
      common: viCommon,
      config: viConfig,
      errors: viErrors,
      libraries: viLibraries,
      movies: viMovies,
      permissions: viPermissions,
      posts: viPosts,
      roles: viRoles,
      site: viSite,
      taxonomies: viTaxonomies,
      tools: viTools,
      uploads: viUploads,
      users: viUsers,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  interpolation: { escapeValue: false },
  keySeparator: ':',
});

export default i18n;
