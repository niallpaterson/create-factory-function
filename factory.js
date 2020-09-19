const create = (proto, keys, props) => (...vals) => {
  const obj = Object.create(proto || Object.prototype);

  if (keys) {
    keys.forEach((key, i) => {
      obj[key] = vals[i];
    });
  }

  if (props) {
    Object.assign(obj, props);
  }

  return obj;
};

const factory = { create };

module.exports = factory;
