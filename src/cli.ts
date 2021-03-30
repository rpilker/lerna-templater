#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { TemplaterOptions, templater } from '.';

type ArgvType = {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
};

((argv: ArgvType): void => {
  try {
    const options: TemplaterOptions = {
      name: 'name'
    };

    templater(process.cwd(), options);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }

  process.exit();
})
(
  yargs(process.argv.slice(2))
  .option('n', {
    alias: 'name',
    demandOption: true,
    describe: 'The name of the new package'
  })
  .option('d', {
    alias: 'description',
    default: '',
    describe: 'The description of the new package'
  })
  .option('s', {
    alias: 'scope',
    describe: 'The scope of the new package'
  })
  .options('p', {
    alias: 'packages',
    describe: 'The path of the destination folder'
  })
  .options('t', {
    alias: 'template',
    describe: 'The path of the template folder'
  })
  .help()
  .argv
);
