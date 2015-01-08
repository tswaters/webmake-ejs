/*eslint-env mocha*/
/*eslint-disable no-unused-expressions*/
'use strict';

var async = require('async');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');

var extension = require('..');
var template = {};
var expected = {};

chai.use(require('chai-as-promised'));


/**
 * before hook loads expected/ejs from filesystem...
 * @param {function(object)} callback callback when done.
 */
before(function (callback) {
  async.each(['names', 'noLocal', 'syntaxError'], function (item, cb) {
    async.auto({
      'expected': function (next) { fs.readFile('./test/fixtures/expected/' + item + '.html', next); },
      'template': function (next) { fs.readFile('./test/fixtures/template/' + item + '.ejs', next); }
    }, function (err, results) {
      if (err) { return cb(err, null); }
      template[item] = results.template.toString();
      expected[item] = results.expected.toString();
      cb();
    });
  }, callback);
});

it('should deal properly with a blank local parameter', function () {
  compileTemplate(template.noLocal).then(function (tmpl) {
    expect(expected.noLocal).to.equal(tmpl());
  });
});

it('should compile properly', function () {
  var names = require('./fixtures/names');
  compileTemplate(template.name).then(function (tmpl) {
    expect(expected.names).to.equal(tmpl(names));
  });
});

it('should reject the promise when encountering a syntax error', function () {
  var promise = extension.compile(template.syntaxError).code;
  expect(promise).to.be.rejected;
});

it('should resolve the promise when everything is OK', function () {
  var promise = extension.compile(template.name).code;
  expect(promise).to.be.resolved;
});


/**
 * Compiles an ejs template.
 * @param {string} src source of the template
 * @returns {promise} upon resolve, a callable ejs function.
 */
function compileTemplate (src) {
  return extension.compile(src).code.then(function (val) {
    return requireFromString(val);
  });
}

// wizardry, load an node module from a string.
// http://stackoverflow.com/a/17585470
function requireFromString(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}
