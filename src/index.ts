import { join } from 'path';
import {
  existsSync,
  copySync,
  readJSONSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'fs-extra';
import { lstatSync } from 'fs';
import mustache from 'mustache';
import { sync as rimraf } from 'rimraf';
import { getScope } from './get-scope';

export type TemplaterOptions = {
  /** The name of the new package. */
  name: string;
  /** The description of the new pacakge. */
  description?: string;
  /** The scope of the new package.  */
  scope?: string;
  /** The path of the package (output) directory. */
  packages?: string;
  /** The path of the template (input) directory. */
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

function copyTemplate(cwd: string, template: string, target: string): boolean {
  cwd = join(cwd, template);

  if (!existsSync(cwd)) {
    return false;
  }

  copySync(cwd, target);
  return true;
}

function flatten(array: Array<any>, mutable: boolean = false) {
  var toString = Object.prototype.toString;
  var arrayTypeStr = '[object Array]';

  const result:Array<any> = [];
  var nodes = (mutable && array) || array.slice();
  var node;

  if (!array.length) {
      return result;
  }

  node = nodes.pop();

  do {
      if (toString.call(node) === arrayTypeStr) {
          nodes.push.apply(nodes, node);
      } else {
          result.push(node);
      }
  } while (nodes.length && (node = nodes.pop()) !== undefined);

  result.reverse();
  return result;
}


function getMustacheFiles(target: string, relative = ''): string[] {
  return flatten(readdirSync(target).map((f) => {
    if (lstatSync(join(target, f)).isFile()) {
      if (f.endsWith('.mustache')) {
        return relative ? join(relative, f) : f;
       }
       return [];
    }
    return getMustacheFiles(join(target, f), relative ? join(relative, f) : f);
  }));
}

/**
 * Generates a new package from cwd/options.template directory into
 * cwd/options.packages/options.name directory.
 * @param cwd The current working directory.
 * @param options The options for templater.
 */
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
