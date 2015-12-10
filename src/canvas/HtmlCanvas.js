/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link HtmlCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/HtmlCanvas 
 * @requires canvas/Canvas
 * @requires utils/util
 * @requires utils/dom
 * @requires utils/canvas
 */

// Required modules.
var Canvas    = require('./Canvas');
var util      = require('../utils/util');
var dom       = require('../utils/dom');
var canvasUtil = require('../utils/canvas');

/** 
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @class
 * @alias HtmlCanvas
 * @augments Canvas
 * @since 0.1.0
 * @author J Clare
 *
 * @param {CartesianCoords|PolarCoords} coords The coordinate system to use when drawing. 
 */
function HtmlCanvas (coords)
{
    HtmlCanvas.baseConstructor.call(this, coords);
}
util.extendClass(Canvas, HtmlCanvas);

/** 
 * Initialisation code.
 *
 * @since 0.1.0
 * @private
 */
HtmlCanvas.prototype.init = function()
{
    // Public instance members.  
    this.graphicsElement = dom.createElement('canvas',     // The drawing canvas.
    {
        style : {position:'absolute', left:0, right:0}
    });
    this.ctx = this.graphicsElement.getContext('2d');  // The drawing context.
};

/** 
 * Clear the canvas.
 *
 * @since 0.1.0
 */
HtmlCanvas.prototype.clear = function ()
{
    this.items = [];
    canvasUtil.clear(this.graphicsElement, this.ctx);
};

/** 
 * Provides the drawing routine.
 *
 * @since 0.1.0
 * @param {CanvasItem} item A canvas item.
 * @private
 */
HtmlCanvas.prototype.draw = function (item)
{
    var p = item.pixelUnits;
    switch(item.type())
    {
        case 'circle':
            canvasUtil.circle(this.ctx, p.cx, p.cy, p.r);
        break;
        case 'ellipse':
            canvasUtil.ellipse(this.ctx, p.cx, p.cy, p.rx, p.ry);
        break;
        case 'rect':
            canvasUtil.rect(this.ctx, p.x, p.y, p.width, p.height);
        break;
        case 'line':
            canvasUtil.line(this.ctx, p.x1, p.y1, p.x2, p.y2);
        break;
        case 'polygon':
            canvasUtil.polygon(this.ctx, p.points);
        break;
        case 'polyline':
            canvasUtil.polyline(this.ctx, p.points);
        break;
    }

    canvasUtil.draw(this.ctx, 
    {
        fillColor   : item.fillColor(), 
        fillOpacity : item.fillOpacity(),
        lineColor   : item.lineColor(), 
        lineWidth   : item.lineWidth(), 
        lineOpacity : item.lineOpacity(), 
        lineJoin    : item.lineJoin(), 
        lineCap     : item.lineCap()
    });
};

module.exports = HtmlCanvas;