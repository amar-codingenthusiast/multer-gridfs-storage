'use strict';

var __ = require('../lib/utils');
var chai = require('chai');
var expect = chai.expect;
var mute = require('mute');
var Promise = require('bluebird');
var Grid = require('gridfs-stream');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var settings = require('./utils/settings');
var testutils = require('./utils/testutils');
var getNodeVersion = testutils.getNodeVersion();

describe('utility functions', function () {
  var unmute;
  var values = testutils.values;
  
  function resolved(resolve) {
    resolve();
  }
  
  before(function () {
    unmute = mute(process.stderr);
  });
  
  describe('isPromise', function () {
    it('should return true for native Promise objects', function () {
      if (global.Promise) {
        expect(__.isPromise(new global.Promise(resolved))).to.equal(true);
      } else {
        this.skip();
      }
    });
    
    it('should return true for custom Promise objects', function () {
      expect(__.isPromise(new Promise(resolved))).to.equal(true);
    });
    
    it('should return true for thenable objects', function () {
      var thenable = {
        then: function () {
        }
      };
      expect(__.isPromise(thenable)).to.equal(true);
    });
    
    it('should return false for non promise objects', function () {
      values.forEach(function (value) {
        expect(__.isPromise(value)).to.equal(false);
      });
    });
  });
  
  
  describe('isGfsOrPromise', function () {
    var db, gfs;
    before(function () {
      return MongoClient
        .connect(settings.mongoUrl())
        .then(function (database) {
          db = database;
          gfs = new Grid(db, mongo);
        });
    });
    
    it('should return true for native Promise objects', function () {
      if (global.Promise) {
        expect(__.isGfsOrPromise(new global.Promise(resolved))).to.equal(true);
      } else {
        this.skip();
      }
    });
    
    it('should return true for custom Promise objects', function () {
      expect(__.isGfsOrPromise(new Promise(resolved))).to.equal(true);
    });
    
    it('should return true for thenable objects', function () {
      var thenable = {
        then: function () {
        }
      };
      expect(__.isGfsOrPromise(thenable)).to.equal(true);
    });
    
    it('should return true for Grid objects', function () {
      expect(__.isGfsOrPromise(gfs)).to.equal(true);
    });
    
    it('should return false for non promise objects', function () {
      values.forEach(function (value) {
        expect(__.isGfsOrPromise(value)).to.equal(false);
      });
    });
    
    after(function () {
      db.dropDatabase()
        .then(function () {
          db.close(true);
        });
    });
  });
  
  describe('isFuncOrGeneratorFunc', function () {
    it('should return true for functions', function () {
      function noop1() {
      }
      
      var functions = [
        noop1,
        function () {
        },
        new Function('')
      ];
      functions.forEach(function (fn) {
        expect(__.isFuncOrGeneratorFunc(fn)).to.equal(true);
      });
    });
    
    it('should return true for generator functions', function () {
      if (getNodeVersion.major < 6) {
        return this.skip();
      }
      var GeneratorFunction = Object.getPrototypeOf(function*() {
      }).constructor;
      
      function* noop1() {
      }
      
      var genFn = [
        noop1,
        function*() {
        },
        new GeneratorFunction('')
      ];
      genFn.forEach(function (fn) {
        expect(__.isFuncOrGeneratorFunc(fn)).to.equal(true);
      });
    });
    
    it('should return false for other value types', function () {
      values.forEach(function (value) {
        expect(__.isFuncOrGeneratorFunc(value)).to.equal(false);
      });
    });
  });
  
  describe('getFileName', function () {
    it('should generate a 16 bytes hex string', function () {
      __.getFilename(null, null, function (err, data) {
        expect(err).to.equal(null);
        expect(data).to.match(/^[a-f0-9]{16}$/);
      });
      
    });
  });
  
  describe('generateValue', function () {
    it('should generate the same value passed in args', function () {
      __.generateValue(123)(null, null, function (err, data) {
        expect(err).to.equal(null);
        expect(data).to.equal(123);
      });
      
    });
  });
  
  describe('noop', function () {
    it('should generate null in both arguments', function () {
      __.noop(null, null, function (err, data) {
        expect(err).to.equal(null);
        expect(data).to.equal(null);
      });
      
    });
  });
  
  describe('isFunction', function () {
    var genFn = function*() {
    
    };
    var gen = genFn();
    
    it('should return false for non function values', function () {
      values.forEach(function (value) {
        expect(__.isFunction(value)).to.equal(false);
      });
    });
    
    it('should return false for generator functions', function () {
      expect(__.isFunction(genFn)).to.equal(false);
    });
  
    it('should return false for generators', function () {
      expect(__.isFunction(gen)).to.equal(false);
    });
  });
  
  describe('isGeneratorFunction', function () {
    var genFn = function*() {
    
    };
    var gen = genFn();
    
    it('should return false for non function values', function () {
      values.forEach(function (value) {
        expect(__.isGeneratorFunction(value)).to.equal(false);
      });
    });
    
    it('should return false for generator functions', function () {
      expect(__.isGeneratorFunction(genFn)).to.equal(true);
    });
    
    it('should return false for generators', function () {
      expect(__.isGeneratorFunction(gen)).to.equal(false);
    });
  });
  
  describe('isGenerator', function () {
    var genFn = function*() {
    
    };
    var gen = genFn();
    
    it('should return false for non function values', function () {
      values.forEach(function (value) {
        expect(__.isGenerator(value)).to.equal(false);
      });
    });
    
    it('should return false for generator functions', function () {
      expect(__.isGenerator(genFn)).to.equal(false);
    });
    
    it('should return false for generators', function () {
      expect(__.isGenerator(gen)).to.equal(true);
    });
  });
  
  after(function () {
    unmute();
  });
  
});
