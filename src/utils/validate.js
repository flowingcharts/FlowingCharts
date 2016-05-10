/* jshint browserify: true */
'use strict';

/**
 * @fileoverview    Provides functions for validation.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          util 
 */

var toString = Object.prototype.toString;

/** 
 * Check if obj is a valid number. Returns false if obj is equal to NaN, Infinity, -Infinity or a string eg '10'.
 *
 * @since 0.1.0
 *
 * @param {*} obj The number to test.
 *
 * @return {boolean} true, if obj is a number, otherwise false.
 */
var isNumber = function (obj)
{
    // (typeof n == 'number')   Reject objects that arent number types eg numbers stored as strings such as '10'.
    //                          NaN, Infinity and -Infinity are number types so will pass this test.
    // isFinite(n)              Reject infinite numbers.
    // !isNaN(n))               Reject NaN.
    return (typeof obj == 'number') && isFinite(obj) && !isNaN(obj);
};

/** 
 * Check if obj is a valid string.
 *
 * @since 0.1.0
 *
 * @param {*} obj The string to test.
 *
 * @return {boolean} true, if obj is a string, otherwise false.
 */
var isString = function (obj) 
{
    return toString.call(obj) == '[object String]';
};

module.exports = 
{
    isNumber : isNumber,
    isString : isNumber
};