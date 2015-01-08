/*eslint-env mocha*/
'use strict';

var async = require('async');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');

var extension = require('..');
var names = require('./fixtures/names');
var actual;
var expected;

before(function (cb) {
  async.auto({
    'expected': function (next) { fs.readFile('./test/fixtures/expected.html', next); },
    'template': function (next) { fs.readFile('./test/fixtures/template.ejs', next); }
  }, function (err, results) {
    if (err) { return cb(err); }
    var compiled = extension.compile(results.template.toString());
    actual = requireFromString(compiled.code)(names);
    expected = results.expected.toString();
    cb();
  });
});

it('should compile properly', function () {
  expect(expected).to.equal(actual);
});

// wizardry, load an node module from a string.
// http://stackoverflow.com/a/17585470
function requireFromString(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}
