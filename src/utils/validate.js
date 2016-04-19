/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Provides functions for validation.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          util 
 */

/** 
 * Check if n is a valid number. Returns false if n is equal to NaN, Infinity, -Infinity or a string eg '10'.
 *
 * @since 0.1.0
 *
 * @param {*} n The number to test.
 *
 * @return {boolean} true, if n is a number, otherwise false.
 */
var isNumber = function (n)
{
    // (typeof n == 'number')   Reject objects that arent number types eg numbers stored as strings such as '10'.
    //                          NaN, Infinity and -Infinity are number types so will pass this test.
    // isFinite(n)              Reject infinite numbers.
    // !isNaN(n))               Reject NaN.
    return (typeof n == 'number') && isFinite(n) && !isNaN(n);
};

module.exports = 
{
    isNumber        : isNumber
};