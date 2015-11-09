/* jshint browserify: true */
'use strict';

var chai = require('chai');
var expect = chai.expect;

/**
 * Test utility module.
 * @module util
 */

/** 
 * Check if an error is thrown when the argument passed to fnc is not a number.
 *
 * @param {function} fnc The function to test.
 */
var shouldThrowErrorIfTypeIsNotNumber = function (fnc)
{        
    expect(function(){fnc(NaN);}).to.throw(Error);
    expect(function(){fnc(null);}).to.throw(Error);
    expect(function(){fnc(undefined);}).to.throw(Error);
    expect(function(){fnc(Infinity);}).to.throw(Error);
    expect(function(){fnc(-Infinity);}).to.throw(Error);
    expect(function(){fnc('');}).to.throw(Error);
    expect(function(){fnc(' ');}).to.throw(Error);
    expect(function(){fnc('1');}).to.throw(Error);
    expect(function(){fnc('one');}).to.throw(Error);
}

/** 
 * Check if an error is thrown when the argument passed to fnc negative.
 *
 * @param {function} fnc The function to test.
 */
var shouldNotThrowErrorIfNumberIsNegative = function (fnc)
{       
    expect(function(){fnc(-1);}).to.not.throw(Error);
    expect(function(){fnc(-1.0000000000000000000001);}).to.not.throw(Error);
    expect(function(){fnc(-999999999999999999999999);}).to.not.throw(Error);
    expect(function(){fnc(8e-5);}).to.not.throw(Error);
    expect(function(){fnc(1e-24);}).to.not.throw(Error);
}

/** 
 * Check if an error is thrown when the argument passed to fnc is 0.
 *
 * @param {function} fnc The function to test.
 */
var shouldNotThrowErrorIfNumberEqualsZero = function (fnc)
{       
    expect(function(){fnc(0);}).to.not.throw(Error);
}

/** 
 * Check if an error is thrown when the argument passed to fnc is positive.
 *
 * @param {function} fnc The function to test.
 */
var shouldNotThrowErrorIfNumberIsPositive = function (fnc)
{       
    expect(function(){fnc(0);}).to.not.throw(Error);
    expect(function(){fnc(1);}).to.not.throw(Error);
    expect(function(){fnc(1.0000000000000000000001);}).to.not.throw(Error);
    expect(function(){fnc(999999999999999999999999);}).to.not.throw(Error);
    expect(function(){fnc(8e5);}).to.not.throw(Error);
    expect(function(){fnc(1e+24);}).to.not.throw(Error);
}

/** 
 * Check if an error is thrown when the argument passed to fnc is not a number.
 *
 * @param {function} fnc The function to test.
 */
var shouldThrowErrorIfNotNumber = function (fnc)
{       
    shouldThrowErrorIfTypeIsNotNumber(fnc);
    shouldNotThrowErrorIfNumberIsNegative(fnc);
    shouldNotThrowErrorIfNumberEqualsZero(fnc);
    shouldNotThrowErrorIfNumberIsPositive(fnc);
}

/** 
 * Check if an error is thrown when the argument passed to fnc is not a number.
 *
 * @param {function} fnc The function to test.
 */
var shouldThrowErrorIfNotNumber = function (fnc)
{        
    shouldThrowErrorIfTypeIsNotNumber(fnc);
    shouldNotThrowErrorIfNumberEqualsZero(fnc);
    shouldNotThrowErrorIfNumberIsPositive(fnc);
    shouldThrowErrorIfNumberIsNegative(fnc);

    expect(function(){fnc(-1);}).to.not.throw(Error);
    expect(function(){fnc(-1.0000000000000000000001);}).to.not.throw(Error);
    expect(function(){fnc(-999999999999999999999999);}).to.not.throw(Error);
    expect(function(){fnc(8e-5);}).to.not.throw(Error);
    expect(function(){fnc(1e-24);}).to.not.throw(Error);
}

/** 
 * Check if an error is thrown when the argument passed to fnc is not a positve number.
 *
 * @param {function} fnc The function to test.
 */
var shouldThrowErrorIfNotPositiveNumber = function (fnc)
{
    expect(function(){fnc(NaN);}).to.throw(Error);
    expect(function(){fnc(null);}).to.throw(Error);
    expect(function(){fnc(undefined);}).to.throw(Error);
    expect(function(){fnc(Infinity);}).to.throw(Error);
    expect(function(){fnc(-Infinity);}).to.throw(Error);
    expect(function(){fnc('');}).to.throw(Error);
    expect(function(){fnc(' ');}).to.throw(Error);
    expect(function(){fnc('1');}).to.throw(Error);
    expect(function(){fnc('one');}).to.throw(Error);

    expect(function(){fnc(0);}).to.not.throw(Error);
    expect(function(){fnc(1);}).to.not.throw(Error);
    expect(function(){fnc(1.0000000000000000000001);}).to.not.throw(Error);
    expect(function(){fnc(999999999999999999999999);}).to.not.throw(Error);
    expect(function(){fnc(8e5);}).to.not.throw(Error);
    expect(function(){fnc(1e+24);}).to.not.throw(Error);

    expect(function(){fnc(-1);}).to.throw(Error);
    expect(function(){fnc(-1.0000000000000000000001);}).to.throw(Error);
    expect(function(){fnc(-999999999999999999999999);}).to.throw(Error);
    //expect(function(){fnc(8e-5);}).to.throw(Error);
    //expect(function(){fnc(1e-24);}).to.throw(Error);
}

module.exports = 
{
  shouldThrowErrorIfNotNumber: shouldThrowErrorIfNotNumber,
  shouldThrowErrorIfNotPositiveNumber: shouldThrowErrorIfNotPositiveNumber
}