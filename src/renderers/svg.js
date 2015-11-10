/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains functions for handling SVG.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/svg 
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
        var canvas = document.createElement('svg');
        return canvas;
    }
};