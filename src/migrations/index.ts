import * as migration_20260723_120532_initial from './20260723_120532_initial';

export const migrations = [
  {
    up: migration_20260723_120532_initial.up,
    down: migration_20260723_120532_initial.down,
    name: '20260723_120532_initial'
  },
];
