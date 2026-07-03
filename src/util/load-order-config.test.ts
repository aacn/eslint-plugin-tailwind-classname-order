import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { CONFIG_FILE, loadOrderConfig } from './load-order-config';

test('loads project config, validates it, and falls back to defaults', () => {
  const root = mkdtempSync(join(tmpdir(), 'tw-class-order-'));
  const nested = join(root, 'packages', 'app');
  mkdirSync(nested, { recursive: true });

  expect(loadOrderConfig(root).priority[0]).toBe('(predefined)');

  writeFileSync(
    join(root, CONFIG_FILE),
    '{"before":{"custom":"block"},"after":{"other":"block"}}'
  );
  const priority = loadOrderConfig(nested).priority;
  const block = priority.findIndex((entry: any) => entry.split(' ').includes('block'));
  expect(priority.slice(block - 1, block + 2)).toEqual([
    'custom',
    expect.stringContaining('block'),
    'other',
  ]);

  writeFileSync(join(root, CONFIG_FILE), '{"priority":"invalid"}');
  expect(() => loadOrderConfig(root)).toThrow(CONFIG_FILE);
});
