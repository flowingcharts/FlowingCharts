var flowingcharts = (function (fc)
{
	'use strict';
	var canvas = fc.canvas = fc.canvas || {};

	/** 
	 * Check if canvas is supported.
	 * @method isSupported
	 */
	canvas.isSupported = function ()
	{
        return !!document.createElement('canvas').getContext;
	};

	return fc;
}) (flowingcharts || {});