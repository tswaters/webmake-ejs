'use strict';

/**
 * @module webmake-ejs
 * @requires ejs
 * @requires deferred
 * @requires webmake
 * @author Tyler Waters
 **/

var ejs = require('ejs');
var deferred = require('deferred');

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
    'code': compileEjs(src)
  };
};

function compileEjs (src) {
  var def = deferred();
  try {
    var template = ejs.compile(src, {'client': true});
    def.resolve([
      'module.exports = function (opts) {',
      ' return (' + template.toString() + ')(opts || {});',
      '};'
    ].join('\n'));
  }
  catch (e) {
    def.reject(e);
  }
  return def.promise;
}
