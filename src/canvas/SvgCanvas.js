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
 */

// Required modules.
var Canvas              = require('./Canvas');
var util                = require('../utils/util');
var extendClass         = util.extendClass;
var dom                 = require('../utils/dom');
var createSvgElement    = dom.createSvgElement;
var attr                = dom.attr;

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
extendClass(Canvas, SvgCanvas);

/** 
 * Initialisation code.
 *
 * @since 0.1.0
 * @private
 */
SvgCanvas.prototype.init = function()
{
    // Public instance members.  
    this.graphicsElement = createSvgElement('g');    // The group element container.
};

/** 
 * Check for support of the graphics library.
 *
 * @since 0.1.0
 * @return {boolean} true if the browser supports the graphics library, otherwise false.
 */
SvgCanvas.prototype.isSupported = function ()
{
    return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Shape', '1.0');
};

/** 
 * Clear the canvas.
 *
 * @since 0.1.0
 */
SvgCanvas.prototype.clear = function ()
{
    this.items = [];
    while (this.graphicsElement.firstChild) 
    {
        this.graphicsElement.removeChild(this.graphicsElement.firstChild);
    }
};

/** 
 * Provides the fill drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @param {CanvasItem} item A canvas item.
 * @private
 */
SvgCanvas.prototype.drawFill = function (item)
{
    attr(item.element, 
    {
        'fill'         : item.fillColor(),
        'fill-opacity' : item.fillOpacity()
    });
};

/** 
 * Provides the stroke drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @param {CanvasItem} item A canvas item.
 * @private
 */
SvgCanvas.prototype.drawStroke = function (item)
{
    attr(item.element, 
    {
        'stroke'          : item.lineColor(),
        'stroke-width'    : item.lineWidth(),
        'stroke-linejoin' : item.lineJoin(),
        'stroke-linecap'  : item.lineCap(),
        'stroke-opacity'  : item.lineOpacity()
    });
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 * @param {ShapeItem} item A shape item.
 * @param {number} cx The x position of the center of the circle.
 * @param {number} cy The y position of the center of the circle.
 * @param {number} r The circle radius.
 * @private
 */
SvgCanvas.prototype.drawCircle = function (item, cx, cy, r)
{
    if (item.element === undefined) this.appendElement(item);
    attr(item.element, {cx:cx, cy:cy, r:r});
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 * @param {ShapeItem} item A shape item.
 * @param {number} cx The x position of the center of the ellipse.
 * @param {number} cy The y position of the center of the ellipse
 * @param {number} rx The x radius of the ellipse.
 * @param {number} ry The y radius of the ellipse.
 * @private
 */
SvgCanvas.prototype.drawEllipse = function (item, cx, cy, rx, ry)
{
    if (item.element === undefined) this.appendElement(item);
    attr(item.element, {cx:cx, cy:cy, rx:rx, ry:ry});
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 * @param {ShapeItem} item A shape item.
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y position of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @private
 */
SvgCanvas.prototype.drawRect = function (item, x, y, w, h)
{
    if (item.element === undefined) this.appendElement(item);
    attr(item.element, {x:x, y:y, width:w, height:h});
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 * @param {PathItem} item A path item.
 * @param {number} x1 The x position of point 1.
 * @param {number} y1 The y position of point 1.
 * @param {number} x2 The x position of point 2.
 * @param {number} y2 The y position of point 2.
 * @private
 */
SvgCanvas.prototype.drawLine = function (item, x1, y1, x2, y2)
{
    if (item.element === undefined) this.appendElement(item);
    attr(item.element, {x1:x1, y1:y1, x2:x2, y2:y2});
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 * @param {PathItem} item A path item.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @private
 */
SvgCanvas.prototype.drawPolyline = function (item, arrCoords)
{
    if (item.element === undefined) this.appendElement(item);
    attr(item.element, {points:getCoordsAsString(arrCoords)});
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 * @param {PathItem} item A path item.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @private
 */
SvgCanvas.prototype.drawPolygon = function (item, arrCoords)
{    
    if (item.element === undefined) this.appendElement(item);
    attr(item.element, {points:getCoordsAsString(arrCoords)});
};

/** 
 * Creates and appends a graphic element for the passed item.
 *
 * @since 0.1.0
 * @param {CanvasItem} item A canvas item.
 * @private
 */
SvgCanvas.prototype.appendElement = function (item)
{
    item.element = createSvgElement(item.type());
    this.graphicsElement.appendChild(item.element);
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