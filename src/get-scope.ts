import { join } from 'path';
import { existsSync, readJSONSync } from 'fs-extra';

export function getScope(cwd: string): string {
  const path = join(cwd, 'package.json');

  if (!existsSync(path)) return '';

  const name = readJSONSync(path).name as string;

  if (!name) return '';

  const array = name.split('/');

  if (array.length < 2) return '';

  return array[0];
}
