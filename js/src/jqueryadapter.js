var flowingcharts = (function (fc, $)
{
    'use strict';
    var jquery = fc.jquery = fc.jquery || {};

	$.fn.flowingcharts = function (options) 
	{
        var settings = $.extend(
        {
            color 			: "#556b2f",
            backgroundColor	: "brown"
        }, options );

        this.css(  
        {
            color 			: settings.color,
            backgroundColor	: settings.backgroundColor
        });
        
        return this;
	};

	return fc;
}) (flowingcharts || {}, window.jQuery);