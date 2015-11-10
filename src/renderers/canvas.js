/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains functions for handling HTML5 Canvas.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/canvas 
 */

module.exports = 
{
    /** 
     * Get the drawing canvas.
     *
     * @return {HTMLElement} The drawing canvas.
     */
    getDrawingCanvas : function ()
    {
        var canvas = document.createElement('canvas');
        return canvas;
    },

    /** 
     * Add a drawing canvas to a html element.
     *
     * @param {HTMLElement} canvas The drawing canvas.
     * @param {HTMLElement} element The html element.
     */
    appendTo : function (canvas, element)
    {
        // http://stackoverflow.com/questions/2588181/canvas-is-stretched-when-using-css-but-normal-with-width-height-properties
        canvas.style.width ='100%';
        canvas.style.height ='100%';
        canvas.width  = element.offsetWidth;
        canvas.height = element.offsetHeight;
        element.appendChild(canvas);

        (function() // Execute immediately
        { 
            var c = canvas;
            var ele = element;
            var resizeTimeout;
            window.onresize = function ()
            {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function ()
                {
                    window.console.log('resize');
                    c.width  = ele.offsetWidth;
                    c.height = ele.offsetHeight;

                    var context = c.getContext('2d');
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(450, 50);
                    context.stroke();
                }, 100);
            };
        })();
    }
};