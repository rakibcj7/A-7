import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeProduct } from './api.ts';

test('normalizeProduct keeps downward price changes negative', () => {
  const product = normalizeProduct({
    id: 2,
    slug: 'miniket-chal',
    nameBn: 'মিনিকেট চাল',
    category: 'chal',
    categoryNameBn: 'চাল',
    categoryIcon: '🍚',
    unit: 'kg',
    image: '🍚',
    today: 99,
    yesterday: 102,
    lastWeek: 105,
    lastMonth: 100,
    change: { dir: 'down', pct: -2.9 },
    markets: [],
  });

  assert.equal(product.change, -2.9);
});
