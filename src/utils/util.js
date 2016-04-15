/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains utility functions.
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

/** 
 * Clone an object literal.
 *
 * @since 0.1.0
 *
 * @param {Object} obj The object to be cloned.
 *
 * @return {Object} A clone of the object.
 */
var cloneObject = function (obj) 
{
    var copy = {};

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
            copy[i] = cloneObject(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) 
    {
        copy = {};
        for (var attr in obj) 
        {
            if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr]);
        }
        return copy;
    }
};

/** 
 * Extend an object objA with the properties of object objB.
 *
 * @since 0.1.0
 *
 * @param {Object}  objA                            The object to be extended.
 * @param {Object}  objB                            The object whose properties will be added to objA.
 * @param {Boolean} [overwriteProperties = true]    Should objA properties be overwritten if they already exist.
 */
var extendObject = function (objA, objB, overwriteProperties)
{
    for (var key in objB)
    {
         if (objB.hasOwnProperty(key))
         {
            if (overwriteProperties === false)
            {
                if (objA[key] === undefined) objA[key] = objB[key];
            } 
            else objA[key] = objB[key];
         }
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
var extendClass = function (baseClass, subClass)
{
    function Inheritance() {}
    Inheritance.prototype = baseClass.prototype;
    subClass.prototype = new Inheritance();
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
};

/** 
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered.
 *
 * @since 0.1.0
 *
 * @param {Function} func      The function to call.
 * @param {Object}   wait      The function will be called after it stops being called for 'wait' milliseconds.
 * @param {Object}   immediate If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
 */
var debounce = function (func, wait, immediate) 
{
    var timeout;
    return function() 
    {
        var me = this, args = arguments;
        var later = function() 
        {
            timeout = null;
            if (!immediate) func.apply(me, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(me, args);
    };
};

module.exports = 
{
    isNumber        : isNumber,
    cloneObject     : cloneObject,
    extendObject    : extendObject,
    extendClass     : extendClass,
    debounce        : debounce
};