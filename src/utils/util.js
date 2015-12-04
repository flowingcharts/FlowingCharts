/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains utility functions.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module util 
 */

/** 
 * Check if n is a valid number. Returns false if n is equal to NaN, Infinity, -Infinity or a string eg '10'.
 *
 * @since 0.1.0
 * @param {*} n The number to test.
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

/** 
 * Extend an object a with the properties of object b.
 *
 * @since 0.1.0
 * @param {Object} a The object to be extended.
 * @param {Object} b The object to add to the first one.
 */
var extendObject = function (a, b)
{
    for (var key in b)
    {
        if (b.hasOwnProperty(key)) a[key] = b[key];
    }
    return a;
};

/** 
 * A function used to extend one class with another.
 *
 * @since 0.1.0
 * @param {Object} baseClass The class from which to inherit.
 * @param {Object} subClass The inheriting class, or subclass.
 */
var extendClass = function(baseClass, subClass)
{
    function Inheritance() {}
    Inheritance.prototype = baseClass.prototype;
    subClass.prototype = new Inheritance();
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
};

module.exports = 
{
    isNumber        : isNumber,
    extendObject    : extendObject,
    extendClass     : extendClass
};