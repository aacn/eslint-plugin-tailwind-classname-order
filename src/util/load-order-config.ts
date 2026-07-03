import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import defaultOrderConfig from '@/rules/orderConfig.json';
import { OrderConfig } from '@/types/OrderConfig';

const CONFIG_FILE = 'tw-class-order.json';

/**
 * Loads a project order config, falling back to the bundled defaults.
 * @param root Directory in which to look for `tw-class-order.json`.
 * @returns The validated project config or bundled default config.
 * @throws Error when the project config exists but is invalid.
 */
function loadOrderConfig(root: string = process.cwd()): OrderConfig {
  let contents: string;

  try {
    contents = readFileSync(join(root, CONFIG_FILE), 'utf8');
  } catch (error) {
    if((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return defaultOrderConfig;
    }
    throw error;
  }

  const config: unknown = JSON.parse(contents);
  if(
    typeof config !== 'object' ||
    config === null ||
    !Array.isArray((config as OrderConfig).priority) ||
    !(config as OrderConfig).priority.every(item => typeof item === 'string')
  ) {
    throw new Error(`${CONFIG_FILE} must contain a string array named "priority".`);
  }

  return config as OrderConfig;
}

export { CONFIG_FILE, loadOrderConfig };
