<h1 align="center">lerna-templater</h1>
<p align="center">Generates Package from Template for a Lerna Monorepo</p>
<p align="center">
  <img src="https://david-dm.org/rdarida/lerna-templater/status.svg" alt="dependencies">
  <img src="https://david-dm.org/rdarida/lerna-templater/dev-status.svg" alt="devDependencies">
</p>
<hr>

## Installing
```
npm i -D lerna-templater
```

## Usage
### As Import
```ts
import { TemplaterOptions, templater } from 'lerna-template';

/**
 * @param {string} cwd The current working directory.
 * @param {TemplaterOptions} options The options for templater.
 */
templater(cwd, options);
```
### As Commandline Tool
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
Generates a new package from **`cwd`/`options.template`** folder into **`cwd`/`options.packages`/`options.name`** folder.

### `TemplaterOptions`
- **`name`** **string**, **required**  
  The name of the new package
- **`description`** **string**, **optional**  
  The description of the new package.
- **`scope`** **string**, **optional**  
  The scope of the new package. Default value is the scope of the *main package.json*.
- **`packages`** **string**, **optional**  
  The path of the packages folder. Default value is the first element of the *lerna.json's packages array*.
- **`template`** **string**, **optional**  
  The path of the template folder. Default values is *\_\_template\_\_*.

### [Mustache templating](https://npmjs.org/packages/mustache)
TBD

### Example
TBD

## Resources
- [Example repository](https://github.com/rdarida/base-scripts)

## License
The **lerna-templater** is released under the MIT license.
