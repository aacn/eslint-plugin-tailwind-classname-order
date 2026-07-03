import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import defaultOrderConfig from '@/rules/orderConfig.json';
import { CONFIG_FILE, loadOrderConfig } from './load-order-config';

test('loads project config, validates it, and falls back to defaults', () => {
  const root = mkdtempSync(join(tmpdir(), 'tw-class-order-'));

  expect(loadOrderConfig(root)).toEqual(defaultOrderConfig);

  writeFileSync(join(root, CONFIG_FILE), '{"priority":["custom","block"]}');
  expect(loadOrderConfig(root).priority).toEqual(['custom', 'block']);

  writeFileSync(join(root, CONFIG_FILE), '{"priority":"invalid"}');
  expect(() => loadOrderConfig(root)).toThrow(CONFIG_FILE);
});
