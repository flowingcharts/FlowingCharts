/* jshint browserify: true */
'use strict';

/**
 * Utility module.
 * @module util
 */
module.exports = 
{
    /** 
     * Check if n is a number. Returns false if n is a string eg '10' or equal to NaN, Infinity or -Infinity.
     *
     * @param {*} n The number to test.
     * @return {boolean} true, if n is a number, otherwise false.
     */
    isNumber : function (n)
    {
        if (typeof n !== 'number')  return false; // Checks for a number type - this discounts any numbers contained in strings eg '10'.

        // NaN, Infinity and -Infinity are number types so will pass.
        if (!isFinite(n))           return false; // Test for infinite numbers.
        if (isNaN(n))               return false; // Test for NaN.
        else                        return true;
        //else return !isNaN(parseFloat(n)) && isFinite(n);
    }
};