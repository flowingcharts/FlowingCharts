/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Canvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/Canvas 
 * @requires canvas/ShapeItem
 * @requires canvas/PathItem
 * @requires utils/util
 * @requires utils/color
 */

// Required modules.
var ShapeItem = require('./ShapeItem');
var PathItem  = require('./PathItem');
var util      = require('../utils/util');

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
    if (!util.isNumber(w))  throw new Error('Canvas.setSize(w): w must be a number.');
    if (w < 0)              throw new Error('Canvas.setSize(w): w must be >= 0.');
    if (!util.isNumber(h))  throw new Error('Canvas.setSize(h): h must be a number.');
    if (h < 0)              throw new Error('Canvas.setSize(h): h must be >= 0.');
    //</validation>

    if (w !== this.width() || h !== this.height())
    {
        // Canvas size.
        this.graphicsElement.setAttribute('width', w);
        this.graphicsElement.setAttribute('height', h);
    }
};

// Create canvas items.

/** 
 * Creates a marker.
 *
 * @since 0.1.0
 * @param {string} type The marker type.
 * @param {number} cx The x position of the center of the marker.
 * @param {number} cy The y position of the center of the marker.
 * @param {number} size The size of the marker.
 * @return {ShapeItem} A shape item.
 */
Canvas.prototype.marker = function (type, cx, cy, size)
{
    var item, r = size / 2;
    switch(type)
    {
        case 'circle':
            item = this.circle(cx + r, cy + r, r);
        break;
        case 'ellipse':
            item = this.ellipse(cx + r, cy + r, r, r);
        break;
        case 'rect':
            item = this.rect(cx, cy, size, size);
        break;
    }
    item.marker = true;
    return item;
};

/** 
 * Creates a shape.
 *
 * @since 0.1.0
 * @param {string} type The shape type.
 * @param {number} x The x position of the bottom left corner.
 * @param {number} y The y position of the bottom left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {ShapeItem} A shape item.
 */
Canvas.prototype.shape = function (type, x, y, w, h)
{
    var item;
    switch(type)
    {
        case 'ellipse':
            var rx = w / 2, ry = h / 2, cx = x + rx, cy = y + ry;
            item = this.ellipse(cx, cy, rx, ry);
        break;
        case 'rect':
            item = this.rect(x, y, w, h);
        break;
    }
    return item;
};

/** 
 * Creates a path.
 *
 * @since 0.1.0
 * @param {string} type The path type.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {ShapeItem} A path item.
 */
Canvas.prototype.path = function (type, arrCoords)
{
    var item;
    switch(type)
    {
        case 'line':
            item = this.line(arrCoords[0], arrCoords[1], arrCoords[2], arrCoords[3]);
        break;
        case 'polyline':
            item = this.polyline(arrCoords);
        break;
        case 'polygon':
            item = this.polygon(arrCoords);
        break;
    }
    return item;
};

/** 
 * Creates a circle.
 *
 * @since 0.1.0
 * @param {number} cx The x position of the center of the circle.
 * @param {number} cy The y position of the center of the circle
 * @param {number} r The radius of the circle.
 * @return {ShapeItem} A shape item.
 */
Canvas.prototype.circle = function (cx, cy, r)
{
    var size = r * 2, x = cx - r, y = cy - r;
    return this.getShapeItem('circle', x, y, size, size);
};

/** 
 * Creates an ellipse.
 *
 * @since 0.1.0
 * @param {number} cx The x position of the center of the ellipse.
 * @param {number} cy The y position of the center of the ellipse
 * @param {number} rx The x radius of the ellipse.
 * @param {number} ry The y radius of the ellipse.
 * @return {ShapeItem} A shape item.
 */
Canvas.prototype.ellipse = function (cx, cy, rx, ry)
{
    var x = cx - rx, y = cy - ry, w = rx * 2, h = ry * 2;
    return this.getShapeItem('ellipse', x, y, w, h);
};

/** 
 * Creates a rectangle.
 *
 * @since 0.1.0
 * @param {number} x The x position of the bottom left corner.
 * @param {number} y The y position of the bottom left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {ShapeItem} A shape item.
 */
Canvas.prototype.rect = function (x, y, w, h)
{
    return this.getShapeItem('rect', x, y, w, h);
};

/** 
 * Creates a line.
 *
 * @since 0.1.0
 * @param {number} x1 The x position of point 1.
 * @param {number} y1 The y position of point 1.
 * @param {number} x2 The x position of point 2.
 * @param {number} y2 The y position of point 2.
 * @return {PathItem} A path item.
 */
Canvas.prototype.line = function (x1, y1, x2, y2)
{
    return this.getPathItem('line', [x1, y1, x2, y2]);
};

/** 
 * Creates a polyline.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {PathItem} A path item.
 */
Canvas.prototype.polyline = function (arrCoords)
{
    return this.getPathItem('polyline', arrCoords);
};

/** 
 * Creates a polygon.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {PathItem} A path item.
 */
Canvas.prototype.polygon = function (arrCoords)
{
    return this.getPathItem('polygon', arrCoords);
};

/** 
 * Creates a shape item.
 *
 * @since 0.1.0
 * @param {string} type The shape type.
 * @param {number} x The x position of the bottom left corner.
 * @param {number} y The y position of the bottom left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {ShapeItem} A shape item.
 * @private
 */
Canvas.prototype.getShapeItem = function (type, x, y, w, h)
{
    var item = new ShapeItem(type, x, y, w, h);
    this.items.push(item);
    return item;
};

/** 
 * Creates a path item.
 *
 * @since 0.1.0
 * @param {string} type The path type.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {PathItem} A path item.
 * @private
 */
Canvas.prototype.getPathItem = function (type, arrCoords)
{
    var item = new PathItem(type, arrCoords);
    this.items.push(item);
    return item;
};

// Draw canvas items.

/** 
 * Renders the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.render = function ()
{
    var n = this.items.length;
    for (var i = 0; i < n; i++)  
    {
        var item = this.items[i];

        if (item.type() === 'polygon' || item.type() === 'polyline' || item.type() === 'line')  
        {
            this.drawPath(item);
        }    
        else
        {
            if (item.marker === true)   this.drawMarker(item);
            else                        this.drawShape(item);
        } 

        this.draw(item);
    }
};

/** 
 * Draws a marker.
 *
 * @since 0.1.0
 * @param {ShapeItem} item A shape item.
 * @private
 */
Canvas.prototype.drawMarker = function (item)
{
    var size = item.width();
    var r    = size / 2;
    var px   = this._coords.getPixelX(item.x()) - r;
    var py   = this._coords.getPixelY(item.y()) - r;

    switch(item.type())
    {
        case 'circle':
            item.pixelUnits = 
            {
                cx : px + r,
                cy : py + r,
                r  : r,
            };
        break;
        case 'ellipse':
            item.pixelUnits = 
            {
                cx : px + r,
                cy : py + r,
                rx  : r,
                ry  : r
            };
        break;
        case 'rect':
            item.pixelUnits = 
            {
                x       : px,
                y       : py,
                width   : size,
                height  : size
            };
        break;
    }
    this.draw(item);
};

/** 
 * Draws a shape.
 *
 * @since 0.1.0
 * @param {ShapeItem} item A shape item.
 * @private
 */
Canvas.prototype.drawShape = function (item)
{
    var pw = this._coords.getPixelWidth(item.width());
    var ph = this._coords.getPixelHeight(item.height());
    var px = this._coords.getPixelX(item.x());
    var py = this._coords.getPixelY(item.y()) - ph;

    switch(item.type())
    {
        case 'rect':
            item.pixelUnits = 
            {
                x       : px,
                y       : py,
                width   : pw,
                height  : ph
            };
        break;
        case 'ellipse':
            var rx = pw / 2, ry = ph / 2;
            item.pixelUnits = 
            {
                cx      : px + rx,
                cy      : py + ry,
                rx      : rx,
                ry      : ry
            };
        break;
    }
    this.draw(item);
};

/** 
 * Draws a path.
 *
 * @since 0.1.0
 * @param {PathItem} item A path item.
 * @private
 */
Canvas.prototype.drawPath = function (item)
{
    var arrPixelCoords = this._coords.getPixelArray(item.points());

    switch(item.type())
    {
        case 'line':
            item.pixelUnits = 
            {
                x1 : arrPixelCoords[0],
                y1 : arrPixelCoords[1],
                x2 : arrPixelCoords[2],
                y2 : arrPixelCoords[3]
            };
        break;
        case 'polygon':
            item.pixelUnits = 
            {
                points : arrPixelCoords
            };
        break;
        case 'polyline':
            item.pixelUnits = 
            {
                points : arrPixelCoords
            };
        break;
    }
    this.draw(item);
};

module.exports = Canvas;