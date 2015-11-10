/* jshint browserify: true */
'use strict';

var chai = require('chai');
var expect = chai.expect;

/**
 * Test utility module.
 * @module util
 */

/** 
 * Check if an error is thrown.
 *
 * @param {function} fnc The function to test.
 * @param {...*} args The arguments passed into the function.
 */
function shouldThrowError (fnc, args)
{        
    expect(function(){fnc(args);}).to.throw(Error);
}

/** 
 * Check if an error is not thrown.
 *
 * @param {function} fnc The function to test.
 * @param {...*} args The arguments passed into the function.
 */
function shouldNotThrowError (fnc, args)
{        
    expect(function(){fnc(args);}).to.not.throw(Error);
}

/** 
 * Check if an error is thrown when the argument passed to a function is not a number.
 *
 * @param {function} fnc The function to test.
 */
function shouldThrowErrorIfIsNotNumberType (fnc)
{        
    shouldThrowError(fnc, NaN);
    shouldThrowError(fnc, null);
    shouldThrowError(fnc, undefined);
    shouldThrowError(fnc, Infinity);
    shouldThrowError(fnc, -Infinity);
    shouldThrowError(fnc, null);
    shouldThrowError(fnc, {});
    shouldThrowError(fnc, []);
    shouldThrowError(fnc, [1]);
    shouldThrowError(fnc, '');
    shouldThrowError(fnc, ''+1);
    shouldThrowError(fnc, 1+'');
    shouldThrowError(fnc, ' ');
    shouldThrowError(fnc, '0');
    shouldThrowError(fnc, '1');
    shouldThrowError(fnc, 'foo');
    shouldThrowError(fnc, Number('foo'));
}

/** 
 * Check if an error is thrown when the argument passed to a function is a negative number.
 *
 * @param {function} fnc The function to test.
 */
function shouldThrowErrorIfNumberIsNegative (fnc)
{       
    shouldThrowError(fnc, -1);
    shouldThrowError(fnc, -0.0000000000000000000001);
    shouldThrowError(fnc, -999999999999999999999999);
    shouldThrowError(fnc, -8e5);
    shouldThrowError(fnc, -1e+24);
    shouldThrowError(fnc, -1e-24);
    shouldThrowError(fnc, Number('-123'));
}

/** 
 * Check if an error is not thrown when the argument passed to a function is a negative number.
 *
 * @param {function} fnc The function to test.
 */
function shouldNotThrowErrorIfNumberIsNegative (fnc)
{       
    shouldNotThrowError(fnc, -1);
    shouldNotThrowError(fnc, -0.0000000000000000000001);
    shouldNotThrowError(fnc, -999999999999999999999999);
    shouldNotThrowError(fnc, -8e5);
    shouldNotThrowError(fnc, -1e+24);
    shouldNotThrowError(fnc, -1e-24);
    shouldNotThrowError(fnc, Number('-123'));
}

/** 
 * Check if an error is not thrown when the argument passed to a function equals 0.
 *
 * @param {function} fnc The function to test.
 */
function shouldNotThrowErrorIfNumberEqualsZero (fnc)
{       
    shouldNotThrowError(fnc, 0);
}

/** 
 * Check if an error is not thrown when the argument passed to a function is a positive number.
 *
 * @param {function} fnc The function to test.
 */
function shouldNotThrowErrorIfNumberIsPositive (fnc)
{       
    shouldNotThrowError(fnc, 1);
    shouldNotThrowError(fnc, 0.0000000000000000000001);
    shouldNotThrowError(fnc, 999999999999999999999999);
    shouldNotThrowError(fnc, 8e5);
    shouldNotThrowError(fnc, 1e+24);
    shouldNotThrowError(fnc, 1e-24);
    shouldNotThrowError(fnc, Number('123'));
}

/** 
 * Check if an error is thrown when the argument passed to a function is not a number.
 *
 * @param {function} fnc The function to test.
 */
function shouldThrowErrorIfNotNumber (fnc)
{       
    shouldThrowErrorIfIsNotNumberType(fnc);
    shouldNotThrowErrorIfNumberIsNegative(fnc);
    shouldNotThrowErrorIfNumberEqualsZero(fnc);
    shouldNotThrowErrorIfNumberIsPositive(fnc);
}

/** 
 * Check if an error is not thrown when the argument passed to a function is a positive number.
 *
 * @param {function} fnc The function to test.
 */
function shouldThrowErrorIfNotPositiveNumber (fnc)
{
    shouldThrowErrorIfIsNotNumberType(fnc);
    shouldNotThrowErrorIfNumberEqualsZero(fnc);
    shouldNotThrowErrorIfNumberIsPositive(fnc);
    shouldThrowErrorIfNumberIsNegative(fnc);
}

module.exports = 
{
  shouldThrowErrorIfNotNumber: shouldThrowErrorIfNotNumber,
  shouldThrowErrorIfNotPositiveNumber: shouldThrowErrorIfNotPositiveNumber
};