import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import defaultOrderConfig from '@/rules/orderConfig.json';
import { OrderConfig, OrderOverrides } from '@/types/OrderConfig';

const CONFIG_FILE = 'tw-class-order.json';

/**
 * Loads the nearest project order config, falling back to bundled defaults.
 * @param root Directory from which to search toward the filesystem root.
 * @returns The validated project config or bundled default config.
 * @throws Error when the project config exists but is invalid.
 */
function loadOrderConfig(root: string = process.cwd()): OrderConfig {
  let current = resolve(root);
  let contents: string | undefined;

  while(contents === undefined) {
    try {
      contents = readFileSync(join(current, CONFIG_FILE), 'utf8');
    } catch (error) {
      if((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
      const parent = dirname(current);
      if(parent === current) {
        return defaultOrderConfig;
      }
      current = parent;
    }
  }

  const config: unknown = JSON.parse(contents);
  if(typeof config !== 'object' || config === null) {
    throw new Error(`${CONFIG_FILE} must contain an object.`);
  }

  if('priority' in config) {
    if(
      !Array.isArray((config as OrderConfig).priority) ||
      !(config as OrderConfig).priority.every(item => typeof item === 'string')
    ) {
      throw new Error(`${CONFIG_FILE} priority must be an array of strings.`);
    }
    return config as OrderConfig;
  }

  const overrides = config as OrderOverrides;
  const keys = Object.keys(overrides);
  if(
    keys.some(key => key !== 'before' && key !== 'after') ||
    !isStringRecord(overrides.before) ||
    !isStringRecord(overrides.after)
  ) {
    throw new Error(`${CONFIG_FILE} before and after must map classes to anchors.`);
  }

  const priority = Array.from(defaultOrderConfig.priority);
  applyOverrides(priority, overrides.before ?? {}, 0);
  applyOverrides(priority, overrides.after ?? {}, 1);
  return { priority };
}

function isStringRecord(value: unknown): boolean {
  return (
    value === undefined ||
    (typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.values(value).every(item => typeof item === 'string'))
  );
}

function applyOverrides(
  priority: Array<string>,
  overrides: Record<string, string>,
  offset: number
): void {
  Object.entries(overrides).forEach(([className, anchor]) => {
    const anchorIndex = priority.findIndex(entry =>
      entry.split(' ').includes(anchor)
    );
    if(anchorIndex === -1) {
      throw new Error(`${CONFIG_FILE} anchor "${anchor}" was not found.`);
    }
    priority.splice(anchorIndex + offset, 0, className);
  });
}

export { CONFIG_FILE, loadOrderConfig };
