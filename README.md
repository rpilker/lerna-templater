<h1 align="center">lerna-templater</h1>
<p align="center">Generates Package from Template for a Lerna Monorepo</p>
<p align="center">
  <img src="https://david-dm.org/rdarida/lerna-templater/status.svg" alt="dependencies">
  <img src="https://david-dm.org/rdarida/lerna-templater/dev-status.svg" alt="devDependencies">
</p>
<hr>

## Install
```
npm i -D lerna-templater
```

## Usage
### API
```
npx lerna-templater -n "Name of the new package" -d "Description of the new package"
```

or

```js
"scripts": {
  "create": "lerna-templater"
}
```

```
npm run create -- -n "Name of the new package" -d "Description of the new package"
```

### Options
TBD

## Resources

## License
The **lerna-templater** is released under the MIT license.
