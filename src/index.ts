import { join } from 'path';
import {
  existsSync,
  copySync,
  readJSONSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'fs-extra';
import mustache from 'mustache';
import { sync as rimraf } from 'rimraf';

export type TemplaterOptions = {
  name: string;
  scope?: string;
  description?: string;
  packages?: string;
  template?: string;
};

type Lerna = {
  packages: string[];
  version: string;
};

function getDefaults({
  name,
  scope = '',
  description = '',
  ...props
}: TemplaterOptions): TemplaterOptions {
  return {
    name,
    scope: scope.length ? `${scope}/` : undefined,
    description,
    ...props
  };
}

function getLerna(cwd: string): Lerna {
  const path = join(cwd, 'lerna.json');

  if (!existsSync(path)) {
    throw new Error('Could not find lerna.json!');
  }

  const lerna = readJSONSync(path) as Lerna;
  lerna.packages = lerna.packages.map((p) => p.replace('/*', ''));
  return lerna;
}

function getScope(cwd: string): string {
  const path = join(cwd, 'package.json');

  if (!existsSync(path)) return '';

  const name = readJSONSync(path).name as string;

  if (!name) return '';

  const array = name.split('/');

  if (array.length < 2) return '';

  return array[0];
}

function copyTemplate(cwd: string, template: string, target: string): boolean {
  cwd = join(cwd, template);

  if (!existsSync(cwd)) {
    return false;
  }

  copySync(cwd, target);
  return true;
}

function getMustacheFiles(target: string): string[] {
  return readdirSync(target).filter((f) => f.endsWith('.mustache'));
}

export function templater(cwd: string, options: TemplaterOptions): void {
  options = getDefaults(options);
  const lerna = getLerna(cwd);

  if (!options.scope) {
    options.scope = getScope(cwd);
  }

  if (!options.packages) {
    options.packages = lerna.packages[0];
  }

  if (!options.template) {
    options.template = '__template__';
  }

  const target = join(cwd, options.packages, options.name);

  if (existsSync(target)) {
    throw new Error(`The package already exists!\n${target}`);
  }

  if (!copyTemplate(cwd, options.template, target)) {
    throw new Error(`The template folder is not found!\n${options.template}`);
  }

  const templates = getMustacheFiles(target);

  templates.forEach((t) => {
    const name = t.replace('.mustache', '');
    const file = join(target, name);

    const template = readFileSync(join(target, t), {
      encoding: 'utf-8',
      flag: 'r'
    });

    const content = mustache.render(template, {
      ...options,
      version: lerna.version,
      repoDir: `${options.packages}/${options.name}`
    });
    writeFileSync(file, content);
  });

  templates.forEach((t) => rimraf(join(target, t)));
}
