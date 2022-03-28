/**
 * Helpers
 * @module helpers
 */

/**
 * Build a request url string based on the pathname and the object params
 * @param { string } pathname
 * @param { object } queryStringMap
 * @returns {string}
 */
const pathnameBuilder = (pathname, queryStringMap) => {
  /* istanbul ignore else */
  if (!pathname || !queryStringMap) {
    throw new Error('pathname or queryStringMap is missing', {});
  }

  const search = Object.keys(queryStringMap).reduce((acc, key) => {
    /* istanbul ignore else */
    if (queryStringMap[key]) {
      acc.push(`${key}=${encodeURIComponent(queryStringMap[key])}`);
    }

    return acc;
  }, []);

  return `/${pathname}?${search.join('&')}`;
};

/**
 * Slugifies strings
 * @param { string } str
 * @returns {string}
 */
const slugify = (str) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return str.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/&/g, '-and-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

module.exports = {
  pathnameBuilder,
  slugify,
};
