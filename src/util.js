/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains utility functions.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module util 
 */

module.exports = 
{
    /** 
     * Check if n is a valid number. Returns false if n is equal to NaN, Infinity, -Infinity or a string eg '10'.
     *
     * @param {*} n The number to test.
     * @return {boolean} true, if n is a number, otherwise false.
     */
    isNumber : function (n)
    {
        // (typeof n == 'number')   Reject objects that arent number types eg numbers stored as strings such as '10'.
        //                          NaN, Infinity and -Infinity are number types so will pass this test.
        // isFinite(n)              Reject infinite numbers.
        // !isNaN(n))               Reject NaN.
        return (typeof n == 'number') && isFinite(n) && !isNaN(n);
    },

    /** 
     * Check if c is a valid color.
     *
     * @param {*} c The number to test.
     * @return {boolean} true, if c is a number, otherwise false.
     */
    isColor : function (c)
    {
        // TODO test for rgb colors.
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test('#ac3');
    },

    /** 
     * Check if c is a valid color.
     *
     * @param {*} c The number to test.
     * @return {boolean} true, if c is a number, otherwise false.
     */
    isHexColor : function (c)
    {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test('#ac3');
    },

    /** 
     * Extend an object a with the properties of object b.
     *
     * @param {Object} a The object to be extended.
     * @param {Object} b The object to add to the first one.
     */
    extendObject : function (a, b)
    {
        for (var key in b)
        {
            if (b.hasOwnProperty(key)) a[key] = b[key];
        }
        return a;
    },

    /** 
     * A function used to extend one class with another.
     *
     * @param {Object} baseClass The class from which to inherit.
     * @param {Object} subClass The inheriting class, or subclass.
     */
    extendClass : function(baseClass, subClass)
    {
        function Inheritance() {}
        Inheritance.prototype = baseClass.prototype;
        subClass.prototype = new Inheritance();
        subClass.prototype.constructor = subClass;
        subClass.baseConstructor = baseClass;
        subClass.superClass = baseClass.prototype;
    },

    /** 
     * Adjusts a bounding box to fit a rectangle in order to maintain the aspect ratio.
     *
     * @private
     * @param {BoundingBox} bBox The bounding box.
     * @param {Rectangle} rect The rectangle.
     */
    fitBBoxToRect : function (bBox, rect)
    {
        var sy = bBox.height() / rect.height();
        var sx = bBox.height() / rect.width();

        var sBBoxX, sBBoxY, sBBoxW, sBBoxH; 

        if (sy > sx)
        {
            sBBoxY = bBox.yMin();
            sBBoxH = bBox.height();
            sBBoxW = (rect.width() / rect.height()) * sBBoxH;
            sBBoxX = bBox.xMin() - ((sBBoxW - bBox.width()) / 2);
        }
        else if (sx > sy)
        {
            sBBoxX = bBox.xMin();
            sBBoxW = bBox.width();
            sBBoxH = (rect.height() / rect.width()) * sBBoxW;
            sBBoxY = bBox.yMin() - ((sBBoxH - bBox.height()) / 2);
        }
        else
        {
            sBBoxX = bBox.xMin();
            sBBoxY = bBox.yMin();
            sBBoxW = bBox.width();
            sBBoxH = bBox.height();
        }

        bBox.xMin(sBBoxX).yMin(sBBoxY).width(sBBoxW).height(sBBoxH);
    }
};