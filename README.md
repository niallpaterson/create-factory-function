# 🏭 create-factory-function

Syntactically concise, curry-friendly convenience method for factory function creation.

## Usage

Install locally with npm:

````shell
npm i create-factory-function
````

Import:

````JavaScript
const factory = require('create-factory-function');
````

or

````JavaScript
import factory from 'create-factory-function';
````

## API

### factory.create

#### Syntax

````JavaScript
factory.create([proto[, keys[, props]]]);
````

#### Parameters

`proto`

Optional. Object specifying the prototype of objects created by the returned factory.

Defaults to `Object.prototype` if no argument is provided.

`keys`

Optional. Array of zero or more strings or symbols specifying the keys of properties to be assigned to objects created by the returned factory (e.g., 'key'). Used for keys without predefined values.

`props`

Optional. Object, the enumerable properties of which specify properties to be assigned to objects returned by the returned factory. Used for methods and keys with predefined values.

## Examples

Passing a proto:

````JavaScript
const factory = require('create-factory-function');

const proto = {
  greetWorld() {
    return 'hello, world!';
  },
};

const factoryFunction = factory.create(proto);

const obj = factoryFunction(); // {}

Object.getPrototypeOf(obj); // { greetWorld: [Function: greetWorld] }

obj.greetWorld(); // hello, world!
````

Passing keys with no predefined value:

````JavaScript
const factoryFunction = factory.create(proto, ['key1', 'key2']);

const obj = factoryFunction('val1', 'val2'); // { key1: 'val1', key2: 'val2' }
````

Passing properties:

````JavaScript
const factoryFunction = factory.create(proto, ['key1'], {
  key2: 'val2',
  method: () => "I'm a method!",
}
);

const obj = factoryFunction('val1'); // { key1: 'val1', key2: 'val2', method: [Function: method] }

obj.method(); // I'm a method!
````

Passing no arguments:

````JavaScript
const factoryFunction = factory.create();

const obj = factoryFunction(); // {}

Object.getPrototypeOf(obj); // [Object: null prototype] {}
````

## Purpose

ES6 introduced concise object literal syntax and implicit function returns, which combine to permit highly concise factory function creation:

````JavaScript
const factoryFunction = (key1, key2) => ({ key1, key2 });
````

This style of object creation's reliance on object literals means that prototype assignment is not possible during object creation. Since prototype assigment post-creation is a performance sink, this makes prototype assignment difficult.

One option is to use Object.create, but to assign properties to the returned object either one must use verbose property descriptors:

````JavaScript
const factoryFunction = (key1, key2) => Object.create(someProto, {
  key1: {
    value: 'val1',
    enumerable: true,
    writable: true,
  },
  key2: {
    value: 'val2',
    enumerable: true,
    writable: true,
  },
});
````

Or explicitly assign parameter values to argument values:

````JavaScript
const factoryFunction = (key1, key2) => {
  const obj = Object.create(someProto);
  obj.key1 = key1;
  obj.key2 = key2;
  return obj;
};
````

Both options remove the concision ES6 permits.

This package provides a syntactically concise method for creating factories that assign prototypes and properties during object creation.

## Currying

To keep the package minimal and comply with the single-use principle, currying is not implemented in factory.create. But the `create` method is structured so as to be friendly to currying. Currying `factory.create` allows for partial application of the prototype parameter:

````JavaScript
const curry = require('curry-function');
const factory = require('create-factory-function');

const animalProto = {
  makeNoise() {
    return this.noise;
  },
};

const animal = curry(factory.create)(animalProto);

const lion = animal(['name', { noise: 'Roar!' }]);
const eagle = animal(['name', { noise: 'Caw!' }]);

const leanne = lion('leanne'); // { name: 'leanne', noise: 'Roar!' }
const ernie = eagle('ernie'); // { name: 'ernie', noise: 'Caw!' }

leanne.makeNoise(); // Roar!
ernie.makeNoise(); // Caw!
````

Flipping the parameter order is possible, allowing for partial application of the keys/props parameter:

````JavaScript
const curry = require('curry-function');
const factory = require('create-factory-function');

const lionProto = {
  type: 'lion',
  makeNoise() {
    return 'Roar!';
  },
};

const eagleProto = {
  type: 'eagle',
  makeNoise() {
    return 'Caw!';
  },
};

const flip = (f) => (a, b, c) => f(b, c, a);

const getType = function getType() {
    return this.type;
}

const animal = curry(flip(factory.create))(['name'], { getType });

const lion = animal(lionProto);
const eagle = animal(eagleProto);

const leanne = lion('leanne'); // { name: 'leanne'}
const ernie = eagle('ernie'); // { name: 'ernie'}

leanne.makeNoise(); // Roar!
leanne.getType(); // lion

ernie.makeNoise(); // Caw!
ernie.getType(); // eagle
````

## Test

Tested with [AVA](https://www.npmjs.com/package/ava).

````shell
npm test
````

or

````shell
npx ava
````
