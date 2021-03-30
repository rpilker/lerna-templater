import { sync as rimraf } from 'rimraf';
import { mkdirSync, readFileSync } from 'fs-extra';
import { resolve, join } from 'path';
import { templater, TemplaterOptions } from '../src';

const TMPL = resolve(__dirname, '__template__');
const DIST = resolve(__dirname, 'dist');
const COVE = resolve(__dirname, 'coverage');

const FILES = [
  ['package.json', 'package.test.json'],
  ['README.md', 'README.test.md'],
  ['package.test.json', 'package.test.json'],
  ['README.test.md', 'README.test.md']
];

const FILE_OPTS = {
  encoding: 'utf-8',
  flag: 'r'
};

describe('Test index', () => {
  beforeEach(() => {
    rimraf(DIST);
    mkdirSync(DIST);
  });

  test('should copy files', () => {
    const options: TemplaterOptions = {
      name: 'name',
      description: 'Description',
      scope: '@scope'
    };

    templater(__dirname, options);

    FILES.forEach((v) => {
      const received = readFileSync(join(DIST, options.name, v[0]), {
        encoding: 'utf-8',
        flag: 'r'
      });

      const expected = readFileSync(join(TMPL, v[1]), {
        encoding: 'utf-8',
        flag: 'r'
      });
      expect(received).toEqual(expected);
    });
  });

  test('should throw "The package arleady exists!"', () => {
    const options: TemplaterOptions = {
      name: 'error'
    };

    mkdirSync(join(DIST, options.name));
    expect(() => {
      templater(__dirname, options);
    }).toThrow('The package already exists!');
  });

  test('should handle package parameter', () => {
    const options: TemplaterOptions = {
      name: 'name',
      scope: '@scope',
      description: 'Description',
      packages: 'coverage'
    };

    templater(__dirname, options);

    FILES.forEach((v) => {
      const received = readFileSync(join(COVE, options.name, v[0]), {
        encoding: 'utf-8',
        flag: 'r'
      });

      const expected = readFileSync(join(TMPL, v[1]), {
        encoding: 'utf-8',
        flag: 'r'
      });
      expect(received).toEqual(expected);
    });
  });

  test('should throw "The template folder is not found!"', () => {
    const options: TemplaterOptions = {
      name: 'name',
      template: 'wrongtemplate'
    };

    const expected = `The template folder is not found!\n${options.template}`;
    expect(() => {
      templater(__dirname, options);
    }).toThrow(expected);
  });

  afterAll(() => {
    rimraf(DIST);
    rimraf(COVE);
  });
});
