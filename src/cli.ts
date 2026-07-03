#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import orderConfig from '@/rules/orderConfig.json';
import { CONFIG_FILE } from '@/util/load-order-config';

const destination = join(process.cwd(), CONFIG_FILE);

try {
  writeFileSync(destination, `${JSON.stringify(orderConfig, null, 2)}\n`, {
    flag: 'wx',
  });
  console.log(`Created ${CONFIG_FILE}`);
} catch (error) {
  if((error as NodeJS.ErrnoException).code === 'EEXIST') {
    console.error(`${CONFIG_FILE} already exists; leaving it unchanged.`);
    process.exitCode = 1;
  } else {
    throw error;
  }
}
