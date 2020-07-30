export const isObjectEmpty = object => {
  for (const key in object) {
    if (object.hasOwnProperty(key)) return false;
  }

  return true;
};

export const DnDReorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const memoizeFunction = f => {
  return function () {
    const args = Array.prototype.slice.call(arguments);

    // we've confirmed this isn't really influencing
    // speed positively
    f.memoize = f.memoize || {};

    // this is the section we're interested in
    return args in f.memoize ? f.memoize[args] : (f.memoize[args] = f.apply(this, args));
  };
};
