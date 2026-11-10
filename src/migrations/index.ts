import * as migration_20260723_120532_initial from './20260723_120532_initial';
import * as migration_20261009_174952_ai_assistant from './20261009_174952_ai_assistant';
import * as migration_20261110_120228_add_product_pricing from './20261110_120228_add_product_pricing';

export const migrations = [
  {
    up: migration_20260723_120532_initial.up,
    down: migration_20260723_120532_initial.down,
    name: '20260723_120532_initial',
  },
  {
    up: migration_20261009_174952_ai_assistant.up,
    down: migration_20261009_174952_ai_assistant.down,
    name: '20261009_174952_ai_assistant',
  },
  {
    up: migration_20261110_120228_add_product_pricing.up,
    down: migration_20261110_120228_add_product_pricing.down,
    name: '20261110_120228_add_product_pricing'
  },
];
