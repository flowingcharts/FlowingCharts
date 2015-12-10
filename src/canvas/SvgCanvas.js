/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link SvgCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/SvgCanvas 
 * @requires canvas/Canvas
 * @requires utils/util
 * @requires utils/dom
 * @requires utils/svg
 */

// Required modules.
var Canvas = require('./Canvas');
var util   = require('../utils/util');
var dom    = require('../utils/dom');
var svg    = require('../utils/svg');

/** 
 * @classdesc A wrapper class for rendering to an SVG canvas.
 *
 * @class
 * @alias SvgCanvas
 * @augments Canvas
 * @since 0.1.0
 * @author J Clare
 *
 * @param {CartesianCoords|PolarCoords} coords The coordinate system to use when drawing. 
 */
function SvgCanvas (coords)
{
    SvgCanvas.baseConstructor.call(this, coords);
}
util.extendClass(Canvas, SvgCanvas);

/** 
 * Initialisation code.
 *
 * @since 0.1.0
 * @private
 */
SvgCanvas.prototype.init = function()
{
    // Public instance members.  
    this.graphicsElement = svg.createElement('g');    // The group element container.
};

/** 
 * Clear the canvas.
 *
 * @since 0.1.0
 */
SvgCanvas.prototype.clear = function ()
{
    this.items = [];
    dom.empty(this.graphicsElement);
};

/** 
 * Provides the drawing routine.
 *
 * @since 0.1.0
 * @param {CanvasItem} item A canvas item.
 * @private
 */
SvgCanvas.prototype.draw = function (item)
{
    if (item.element === undefined) 
    {
        item.element = svg.createElement(item.type());
        this.graphicsElement.appendChild(item.element);
    }

    var p = item.pixelUnits;
    switch(item.type())
    {
        case 'circle':
            dom.attr(item.element, {cx:p.cx, cy:p.cy, r:p.r});
        break;
        case 'ellipse':
            dom.attr(item.element, {cx:p.cx, cy:p.cy, rx:p.rx, ry:p.ry});
        break;
        case 'rect':
            dom.attr(item.element, {x:p.x, y:p.y, width:p.width, height:p.height});
        break;
        case 'line':
            dom.attr(item.element, {x1:p.x1, y1:p.y1, x2:p.x2, y2:p.y2});
        break;
        case 'polyline':
            dom.attr(item.element, {points:getCoordsAsString(p.points)});
        break;
        case 'polygon':
            dom.attr(item.element, {points:getCoordsAsString(p.points)});
        break;
    }

    dom.attr(item.element, 
    {
        'fill'            : item.fillColor(),
        'fill-opacity'    : item.fillOpacity(),
        'stroke'          : item.lineColor(),
        'stroke-width'    : item.lineWidth(),
        'stroke-linejoin' : item.lineJoin(),
        'stroke-linecap'  : item.lineCap(),
        'stroke-opacity'  : item.lineOpacity()
    });
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] 
 * to a comma separated string of coords 'x1 y1, x2 y2, x3 y3, x4 y4, ...'.
 * 
 * @since 0.1.0
 * @param {number[]} arrCoords The list of coords.
 * @return {string} A string containing the list of coords.
 */
function getCoordsAsString (arrCoords)
{
    var n = arrCoords.length;
    var strPoints = '';
    for (var i = 0; i < n; i+=2)
    {
        if (i !== 0) strPoints += ',';
        strPoints += '' + arrCoords[i] + ' ' + arrCoords[i+1];
    }
    return strPoints;
}

module.exports = SvgCanvas;