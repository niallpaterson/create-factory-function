const it = require('ava');
const isObject = require('isobject');
const factory = require('./factory.js');

it('accepts a proto object as its first and only argument', (t) => {
  factory.create({});
  t.pass('should accept a proto object as its first and only argument');
});

it('returns a function', (t) => {
  const actual = factory.create({}) instanceof Function;
  const expected = true;

  t.is(actual, expected,
    'should return a function');
});

it('returns a factory function', (t) => {
  const actual = isObject(factory.create({})());
  const expected = true;

  t.is(actual, expected,
    'should return a function that returns an object');
});

it('returns a factory that assigns argument object as prototype, if passed an object argument, ', (t) => {
  const testProto = {};
  const actual = Object.getPrototypeOf(factory.create(testProto)());
  const expected = testProto;

  t.is(actual, expected,
    'should assign factory.create\'s object argument as prototype of returned object');
});

it('returns a factory that assigns array items as keys, if passed an array of keys, ', (t) => {
  const keyArray = ['key1', 'key2'];
  const obj = factory.create({}, keyArray)();
  const actual = keyArray.every((key) => obj.hasOwnProperty(key));
  const expected = true;

  t.is(actual, expected,
    'should assign array item as key of returned object');
});

it('assigns created object arguments as values, if factory is called with arguments', (t) => {
  const keys = ['key'];
  const actual = factory.create({}, keys)('value').key === 'value';
  const expected = true;

  t.is(actual, expected,
    'should assign argument as property value');
});

it('can accept both a prototype object and an array of keys', (t) => {
  t.plan(2);
  const proto = {};
  const keys = ['key1', 'key2'];
  const obj = factory.create(proto, keys)();

  const actualProto = Object.getPrototypeOf(obj);
  const expectedProto = proto;
  t.is(actualProto, expectedProto,
    ('should assign correct prototype'));

  const actualKeys = Object.keys(obj);
  const expectedKeys = keys;
  t.deepEqual(actualKeys, expectedKeys,
    'should assign correct keys');
});

it('uses the first object as proto if multiple objects are given', (t) => {
  const firstProto = {};
  const secondProto = {};
  const obj = factory.create(firstProto, [], secondProto)();

  const actual = Object.getPrototypeOf(obj);
  const expected = firstProto;
  t.is(actual, expected,
    ('should assign first object as prototype if multiple are passed'));
});

it('uses the first array as keys array if multiple arrays are given', (t) => {
  const firstKeys = ['firstArray'];
  const secondKeys = ['secondArray'];
  const obj = factory.create({}, firstKeys, secondKeys)();

  const actual = Object.keys(obj);
  const expected = firstKeys;
  t.deepEqual(actual, expected,
    ('should assign first array items as keys if multiple are passed'));
});
