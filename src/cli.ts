#!/usr/bin/env node

import log from '.';

((cwd: string, argv: string[]): void => {
  try {
    log(cwd, ...argv);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }

  process.exit();
})(process.cwd(), process.argv.slice(2));
