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
     * Check if n is a number. Returns false if n is equal to NaN, Infinity, -Infinity or a string eg '10'.
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
     * Extend an object a with the properties of object b.
     *
     * @param {Object} a The object to be extended.
     * @param {Object} b The object to add to the first one.
     */
    extend : function (a, b)
    {
        for (var key in b)
        {
            if (b.hasOwnProperty(key)) a[key] = b[key];
        }
        return a;
    },

    /** 
     * Appends a child element to a parent element and have the child resize to fit the parent.
     *
     * @param {HTMLElement} childElement The child element.
     * @param {HTMLElement} parentElement The parent element.
     * @param {function} onResize A function to call when the resize takes place.
     */
    appendTo : function (childElement, parentElement, onResize)
    {
        // http://stackoverflow.com/questions/2588181/canvas-is-stretched-when-using-css-but-normal-with-width-height-properties
        childElement.setAttribute('width', parentElement.offsetWidth);
        childElement.setAttribute('height', parentElement.offsetHeight);
        parentElement.appendChild(childElement);

        (function() // Execute immediately
        { 
            var svg = childElement;
            var container = parentElement;
            var resizeTimeout;
            window.onresize = function ()
            {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function ()
                {
                    childElement.setAttribute('width', parentElement.offsetWidth);
                    childElement.setAttribute('height', parentElement.offsetHeight);
                    if (onResize) onResize.call(null);
                }, 100);
            };
        })();
    }
};