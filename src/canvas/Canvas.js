/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Canvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/Canvas 
 * @requires canvas/CanvasItem
 * @requires utils/util
 * @requires utils/color
 */

// Required modules.
var CanvasItem      = require('./CanvasItem');
var util            = require('../utils/util');
var isNumber        = util.isNumber;
var color           = require('../utils/color');
var isColor         = color.isColor;

/** 
 * @classdesc A base wrapper class for graphics libraries.
 *
 * @class
 * @alias Canvas
 * @since 0.1.0
 * @constructor
 *
 * @param {CartesianCoords|PolarCoords} coords The coordinate system to use when drawing. 
 */
function Canvas (coords)
{
    // Private instance members.  
    this._coords = coords;

    // Public instance members.  

    /** 
     * The html element that represents the actual drawing canvas.
     * 
     * @since 0.1.0
     * @type HTMLElement
     * @default null
     */
    this.graphicsElement = null;

    // List added items 
    this.items = [];

    // Initialise.   
    this.init();
}

/** 
 * Appends the canvas to a html element.
 *
 * @since 0.1.0
 * @return {HTMLElement} container The html element.
 */
Canvas.prototype.appendTo = function (container)
{
    container.appendChild(this.graphicsElement);
};

// Geometry.

/** 
 * Get the width of the canvas.
 *
 * @since 0.1.0
 * @return {number} The width.
 */
Canvas.prototype.width = function ()
{
    return parseInt(this.graphicsElement.getAttribute('width'));
};

/** 
 * Get the height of the canvas.
 *
 * @since 0.1.0
 * @return {number} The height.
 */
Canvas.prototype.height = function ()
{
    return parseInt(this.graphicsElement.getAttribute('height'));
};

/** 
 * Set the size of the canvas.
 *
 * @since 0.1.0
 * @param {number} w The width.
 * @param {number} h The height.
 */
Canvas.prototype.setSize = function (w, h)
{
    //<validation>
    if (!isNumber(w)) throw new Error('Canvas.setSize(w): w must be a number.');
    if (w < 0)        throw new Error('Canvas.setSize(w): w must be >= 0.');
    if (!isNumber(h)) throw new Error('Canvas.setSize(h): h must be a number.');
    if (h < 0)        throw new Error('Canvas.setSize(h): h must be >= 0.');
    //</validation>

    if (w !== this.width() || h !== this.height())
    {
        // Canvas size.
        this.graphicsElement.setAttribute('width', w);
        this.graphicsElement.setAttribute('height', h);
    }
};

// Drawing.

/** 
 * Draws an item.
 *
 * @since 0.1.0
 * @param {CanvasItem} item The canvas element.
 */
Canvas.prototype.renderItem = function (item) 
{
    if (item.type === 'polygon' || item.type === 'polyline' || item.type === 'line' )  
    {
        this.drawPath(item.points);
    }    
    else
    {
        if (item.marker === true)
            this.drawMarker(item.type, item.x, item.y, item.w);
        else
            this.drawShape(item.type, item.x, item.y, item.w, item.h);
    } 

    this.drawFill(item);
    this.drawStroke(item);
};

/** 
 * Adds a marker using data coordinates.
 *
 * @since 0.1.0
 * @param {string} type The marker type.
 * @param {number} cx The x position of the centre of the marker (data units).
 * @param {number} cy The y position of the centre of the marker (data units).
 * @param {number} size The size of the marker in (pixel units).
 * @return {CanvasItem} item The canvas element.
 */
Canvas.prototype.marker = function (type, cx, cy, size)
{
    var item;
    switch(type)
    {
        case 'circle':
            item = this.circle(cx, cy, size, size);
        break;
        case 'rect':
            item = this.rect(cx, cy, size, size);
        break;
        case 'ellipse':
            item = this.ellipse(cx, cy, size, size);
        break;
        default:
            item = this.circle(cx, cy, size, size);
    }
    item.marker = true;
    return item;
};

/** 
 * Adds a shape using data coordinates.
 *
 * @since 0.1.0
 * @param {string} type The shape type.
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {CanvasItem} item The canvas element.
 */
Canvas.prototype.shape = function (type, x, y, w, h)
{
    var item;
    switch(type)
    {
        case 'rect':
            item = this.rect(x, y, w, h);
        break;
        case 'ellipse':
            item = this.ellipse(x, y, w, h);
        break;
        default:
            item = this.rect(x, y, w, h);
    }
    return item;
};

/** 
 * Adds a path using data coordinates.
 *
 * @since 0.1.0
 * @param {string} type The path type.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {CanvasItem} item The canvas element.
 */
Canvas.prototype.path = function (type, arrCoords)
{
    var item;
    switch(type)
    {
        case 'polygon':
            item = this.polygon(arrCoords);
        break;
        case 'polyline':
            item = this.polyline(arrCoords);
        break;
        case 'line':
            item = this.line(arrCoords);
        break;
        default:
            item = this.polygon(arrCoords);
    }
    return item;
};

/** 
 * Draws a marker using data coordinates.
 *
 * @since 0.1.0
 * @param {string} type The marker type.
 * @param {number} cx The x position of the centre of the circle.
 * @param {number} cy The y position of the centre of the circle.
 * @param {number} size The marker size.
 */
Canvas.prototype.drawMarker = function (type, cx, cy, size)
{
    var px = this._coords.getPixelX(cx) - size/2;
    var py = this._coords.getPixelY(cy) - size/2;
    
    switch(type)
    {
        case 'circle':
            this.drawCircle(px, py, size, size);
        break;
        case 'rect':
            this.drawRect(px, py, size, size);
        break;
        case 'ellipse':
            this.drawEllipse(px, py, size, size);
        break;
        default:
            this.drawRect(px, py, size, size);
    }
};

/** 
 * Draws a shape using data coordinates.
 *
 * @since 0.1.0
 * @param {string} type The shape type.
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 */
Canvas.prototype.drawShape = function (type, x, y, w, h)
{
    var pw = this._coords.getPixelWidth(w);
    var ph = this._coords.getPixelHeight(h);
    var py = this._coords.getPixelX(x);
    var px = this._coords.getPixelY(y) - ph;

    switch(type)
    {
        case 'rect':
            this.drawRect(px, py, pw, ph);
        break;
        case 'ellipse':
            this.drawEllipse(px, py, pw, ph);
        break;
        default:
            this.drawRect(px, py, pw, ph);
    }
};

/** 
 * Draws a path using data coordinates.
 *
 * @since 0.1.0
 * @param {string} type The shape type.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 */
Canvas.prototype.drawPath = function (type, arrCoords)
{
    var points = this._coords.getPixelArray(arrCoords);

    switch(type)
    {
        case 'polygon':
            this.drawPolygon(points);
        break;
        case 'polyline':
            this.drawPolyline(points);
        break;
        default:
            this.drawPolygon(points);
    }
};

/** 
 * Draws a circle using data coordinates.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {CanvasItem} item The canvas element.
 */
Canvas.prototype.circle = function (x, y, w, h)
{
    var item = new ShapeItem('circle', x, y, w, h);
    this.items.push(item);
    return item;
};

/** 
 * Draws an ellipse using data coordinates.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {CanvasItem} item The canvas element.
 */
Canvas.prototype.ellipse = function (x, y, w, h)
{
    var item = new ShapeItem('ellipse', x, y, w, h);
    this.items.push(item);
    return item;
};

/** 
 * Draws a rectangle using data coordinates.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {CanvasItem} item The canvas element.
 */
Canvas.prototype.rect = function (x, y, w, h)
{
    var item = new ShapeItem('rect', x, y, w, h);
    this.items.push(item);
    return item;
};

/** 
 * Draws a line using data coordinates.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2].
 * @return {CanvasItem} item The canvas element.
 */
Canvas.prototype.line = function (arrCoords)
{
    var item = new PathItem('line', arrCoords);
    this.items.push(item);
    return item;
};

/** 
 * Draws a polyline using data coordinates.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {CanvasItem} item The canvas element.
 */
Canvas.prototype.polyline = function (arrCoords)
{
    var item = new PathItem('polyline', arrCoords);
    this.items.push(item);
    return item;
};

/** 
 * Draws a polygon using data coordinates.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {CanvasItem} item The canvas element.
 */
Canvas.prototype.polygon = function (arrCoords)
{
    var item = new PathItem('polygon', arrCoords);
    this.items.push(item);
    return item;
};

// Implemented by subclasses.

/** 
 * Initialisation code.
 *
 * @since 0.1.0
 */
Canvas.prototype.init = function () {};

/** 
 * Check for support of the graphics library.
 *
 * @since 0.1.0
 * @return {boolean} true if the browser supports the graphics library, otherwise false.
 */
Canvas.prototype.isSupported = function () {return false;};

/** 
 * Renders the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.render = function () {};

/** 
 * Clear the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.clear = function () {};

/** 
 * Provides the fill drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @param {CanvasItem} item The canvas element.
 */
Canvas.prototype.drawFill = function (item) {};

/** 
 * Provides the stroke drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @param {CanvasItem} item The canvas element.
 */
Canvas.prototype.drawStroke = function (item) {};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 */
Canvas.prototype.drawCircle = function (x, y, w, h) {};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 */
Canvas.prototype.drawEllipse = function (x, y, w, h) {};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 */
Canvas.prototype.drawRect = function (x, y, w, h) {};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2].
 */
Canvas.prototype.drawLine = function (arrCoords) {};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 */
Canvas.prototype.drawPolyline = function (arrCoords) {};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 */
Canvas.prototype.drawPolygon = function (arrCoords) {};

module.exports = Canvas;