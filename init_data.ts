// This script aggregates all initial data for services in the apps folder.

import providers from './scripts/data/providers.json';
import categories from './scripts/data/categories.json';
import tags from './scripts/data/tags.json';
import pages from './scripts/data/pages.json';
import components from './scripts/data/components.json';
import menus from './scripts/data/menus.json';

export const initData = {
  providers,
  categories,
  tags,
  pages,
  components,
  menus,
};
