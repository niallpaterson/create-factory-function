# 🏭 create-factory-function

Syntactically concise, curry-friendly convenience method for factory function creation. Given a properties array and a prototype object, returns a factory function that returns objects with the specified prototype and properties.

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
factory.create([proto[, props]]);
````

#### Parameters

`proto`

Optional. Object specifying the prototype of objects created by the returned factory.

Defaults to `Object.prototype` if no argument is provided.

`props`

Optional. Array of:

1. zero or more strings or symbols specifying the keys of properties to be assigned to objects created by the returned factory (e.g., 'key'), and:

2. zero or more arrays specifying a string or symbol to serve as a property key in the first index, and a value of any type specifing the value in the second index (e.g., ['key', 'val']).

Defaults to an empty array if no argument is provided.

When the returned factory is called, any arguments passed to the factory are assigned to the strings/symbols specified by 1, in order. *The ordering does not include any instances of 2*. This means that arrays can feature anywhere in the properties array without affecting the order of value assignment to instances of 1. So a factory created with `[['key1', 'val'], 'key2']` will return the same object when called with a single argument as a factory created with `['key1', ['key2', 'val']]`.

## Examples

Only values to be assigned when calling the returned factory:

````JavaScript
const factory = require('create-factory-function');

const proto = {
  greetWorld() {
    return 'hello, world!';
  },
};

const factoryFunction = factory.create(proto, ['key1', 'key2']);

const obj = factoryFunction('val1', 'val2'); // { key1: 'val1', key2: 'val2' }

Object.getPrototypeOf(obj); // { greetWorld: [Function: greetWorld] }

obj.greetWorld(); // hello, world!
````

With pre-assigned values:

````JavaScript
const factoryFunction = factory.create(proto, [
  'key1',
  ['key2', 'My val was not passed!'],
  ['method', () => "I'm a method!"],
]);

const obj = factoryFunction('My val was passed!');

//  {
//    key1: 'My val was passed!',
//    key2: 'My val was not passed!',
//    method: [Function (anonymous)]
//  }

obj.method(); // I'm a method!

Object.getPrototypeOf(obj); // { greetWorld: [Function: greetWorld] }

obj.greetWorld(); // hello, world!
````

With no arguments:

````JavaScript
const factoryFunction = factory.create();

const obj = factoryFunction();

Object.getPrototypeOf(obj); // [Object: null prototype] {}
````

## Purpose

ES6 introduced concise object literal syntax and implicit function returns, which combine to permit highly concise factory function creation:

````JavaScript
const factoryFunction = (key1, key2) => ({ key1, key2 });
````

This style of object creation's reliance on object literals means that prototype assignment is not possible during object creation. Since prototype assigment post-creation is a performance sink, this makes prototype assignment difficult.

One option is to use Object.create, but to assign properties to the returned object either one must pass the object verbose property descriptors:

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

const lion = animal(['name', ['noise', 'Roar!']]);
const eagle = animal(['name', ['noise', 'Caw!']]);

const leanne = lion('leanne'); // { name: 'leanne', noise: 'Roar!' }
const ernie = eagle('ernie'); // { name: 'ernie', noise: 'Caw!' }

leanne.makeNoise(); // Roar!
ernie.makeNoise(); // Caw!
````

The method can be flipped, allowing for partial application of the properties parameter:

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

const flip = (f) => (a, b) => f(b, a);

const animal = curry(flip(factory.create))([
  'name',
  ['getType', function getType() { return this.type; }],
]);

const lion = animal(lionProto);
const eagle = animal(eagleProto);

const leanne = lion('leanne'); // { name: 'leanne'}
const ernie = eagle('ernie'); // { name: 'ernie'}

leanne.makeNoise(); // Roar!
leanne.getType(); // lion

ernie.makeNoise(); // Caw!
ernie.getType(); // eagle
````
