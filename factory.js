const create = (proto, props) => (...vals) => {
  if (!proto) proto = Object.prototype;
  if (!props) props = [];

  const obj = Object.create(proto);

  const keys = props.filter((x) => ['string', 'symbol'].includes(typeof x));
  keys.forEach((key, i) => {
    obj[key] = vals[i];
  });

  const preAssigned = props.filter((x) => Array.isArray(x));
  preAssigned.forEach((prop) => {
    const [key, val] = prop;
    obj[key] = val;
  });

  return obj;
};

const factory = { create };

module.exports = factory;
