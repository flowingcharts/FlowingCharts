/* jshint browserify: true */
'use strict';

/**
 * Canvas utility module.
 * @module canvas/util
 */
module.exports = 
{
	/** 
	 * Check if canvas is supported.
	 * @function isSupported
	 */
	isSupported : function ()
	{
        return !!document.createElement('canvas').getContext;
	}
};