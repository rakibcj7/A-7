import test from 'node:test';
import assert from 'node:assert/strict';

import { SORT_OPTIONS, sortProducts, type SortOption } from '../types';

test('sort options use numeric values for product sorting', () => {
  assert.deepEqual(
    SORT_OPTIONS.map((option) => option.value),
    [0, 1, 2],
  );

  const products = [
    { id: 1, price: 30 },
    { id: 2, price: 10 },
    { id: 3, price: 20 },
  ];

  assert.deepEqual(sortProducts(products, 1).map((product) => product.price), [10, 20, 30]);
  assert.deepEqual(sortProducts(products, 2).map((product) => product.price), [30, 20, 10]);
  assert.deepEqual(sortProducts(products, 0).map((product) => product.price), [30, 10, 20]);
});

test('sort option type is numeric', () => {
  const value: SortOption = 1;
  assert.equal(value, 1);
});
