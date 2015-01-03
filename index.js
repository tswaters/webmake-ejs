'use strict';

/**
 * @typedef {object} webmake-extension-return
 * @description the object that webmake is expecting
 * @property {string} code code rendered in module block.
 * @property {string} [sourceMap] sourcemap to provide.
 */

/**
 * @type Array<string>
 * @description Extensions this plugin applies to.
 */
exports.extension = ['ejs'];

/**
 * Compile function called from webmake.
 * @param {string} src source of the referenced file.
 * @param {Object} info information about context (unused).
 * @param {string} info.filename full path of the referenced file.
 * @param {string} info.localFilename package name.
 * @param {boolean} info.sourceMap whether or not to include source map.
 * @param {string} info.generatedFilename generated package name.
 * @returns {webmake-extension-return} value returned to webmake.
 */
exports.compile = function (src, info) {
  return {
    'code': [
      'var template = ejs.compile(' + JSON.stringify(src) + ');',
      'module.exports = function (opts) {',
      '  return template(opts);',
      '};'
    ].join('\n')
  };
};