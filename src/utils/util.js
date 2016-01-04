/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains utility functions.
 * @author          Jonathan Clare 
 * @copyright   FlowingCharts 2015
 * @module      util 
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

/** 
 * Clone a simple object.
 *
 * @since 0.1.0
 *
 * @param {Object} obj The object to be cloned.
 * @param {Object} [copy] An optional class.
 * @param {Object} A clone of the object.
 */
var clone = function (obj, copy) 
{
    copy = copy !== undefined ? copy : {};

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) 
    {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) 
    {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) 
        {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) 
    {
        copy = {};
        for (var attr in obj) 
        {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
};

/** 
 * Extend an object objA with the properties of object objB.
 *
 * @since 0.1.0
 *
 * @param {Object} objA The object to be extended.
 * @param {Object} objB The object to add to the first one.
 */
var extendObject = function (objA, objB)
{
    for (var key in objB)
    {
        if (objB.hasOwnProperty(key)) objA[key] = objB[key];
    }
};

/** 
 * Add properties to object objA from object objB if object a does not already contain the properties.
 *
 * @since 0.1.0
 *
 * @param {Object} objA The object that the properties are added to.
 * @param {Object} objB The object that provides the properties.
 */
var addProperties = function (objA, objB)
{
    for (var key in objB)
    {
        if (objA[key] === undefined && objB.hasOwnProperty(key)) objA[key] = objB[key];
    }
};

/** 
 * A function used to extend one class with another.
 *
 * @since 0.1.0
 *
 * @param {Object} baseClass    The class from which to inherit.
 * @param {Object} subClass     The inheriting class, or subclass.
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
    clone           : clone,
    extendObject    : extendObject,
    addProperties   : addProperties,
    extendClass     : extendClass
};