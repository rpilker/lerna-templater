<h1 align="center">lerna-templater</h1>
<p align="center">Generates Package from Template for a Lerna Monorepo</p>
<p align="center">
  <img src="https://david-dm.org/rdarida/lerna-templater/status.svg" alt="dependencies">
  <img src="https://david-dm.org/rdarida/lerna-templater/dev-status.svg" alt="devDependencies">
</p>
<hr>

## Installing
You can get **`lerna-templater`** via **[npm](https://npmjs.org/package/lerna-templater)**.
```
npm i -D lerna-templater
```

## Usage
### As an import
```ts
import { TemplaterOptions, templater } from 'lerna-template';

/**
 * @param {string} cwd The current working directory.
 * @param {TemplaterOptions} options The options for templater.
 */
templater(cwd, options);
```
### As a commandline tool
```
npx lerna-templater -n "Name of the new package" -d "Description of the new package"
```

or

```json
"scripts": {
  "create": "lerna-templater"
}
```

```
npm run create -- -n "Name of the new package" -d "Description of the new package"
```

## API
### `templater(cwd, optioins)`
Generates a new package from **`cwd`/`options.template`** directory into **`cwd`/`options.packages`/`options.name`** directory. The **`cwd`** argument is the current working directory.

### `TemplaterOptions`
- **`name`** **string**, **required**  
  The name of the new package
- **`description`** **string**, **optional**  
  The description of the new package.
- **`scope`** **string**, **optional**  
  The scope of the new package. Default value is the scope of the *main package.json*.
- **`packages`** **string**, **optional**  
  The path of the packages directory. Default value is the first element of the *lerna.json's packages array*.
- **`template`** **string**, **optional**  
  The path of the template directory. Default values is *\_\_template\_\_*.

### [Mustache templating](https://npmjs.org/packages/mustache)
The **lerna-templater** uses Mustache.js for templating. If the *template* directory contains files which ends with **.mustache**, the templater will render them with Mustache.js. After the rendering, the **.mustache** extension will be removed from the filename. For example: `package.json.mustache` will be saved as `package.json`.

#### Available tags:
- `{{{name}}}` -- The name of the new package.
- `{{{descriptio}}}` -- The description of the new package.
- `{{{scope}}}` -- The scope of the new package.
- `{{{packages}}}` -- The relative path of the packages (output) directory.
- `{{{template}}}` -- The relative path of the template (input) directory.
- `{{{version}}}` -- The version of the new package.
- `{{{repoDir}}}` -- The relative path of the new package in the repository.

### Example
TBD

## Resources
- [Example repository](https://github.com/rdarida/base-scripts)

## License
The **lerna-templater** is released under the MIT license.
