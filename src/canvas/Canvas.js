/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Canvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/Canvas 
 * @requires utils/util
 * @requires utils/canvas
 * @requires utils/svg
 */

// Required modules.
var CanvasItem = require('./CanvasItem');
var util       = require('../utils/util');
var canvasUtil = require('../utils/canvas');
var svgUtil    = require('../utils/svg');

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
function Canvas (type, coords)
{
    // Private instance members.  
    this._type   = type;
    this._coords = coords;
    this._items  = [];

    if (this._type === 'svg')
    {
        this._g = svgUtil;
        this._canvas = this._g.getCanvas();
    }
    else
    {
        this._g = canvasUtil;
        this._canvas = this._g.getCanvas();
        this._ctx = this._canvas.getContext('2d');
    }
}

/** 
 * Appends the canvas to a html element.
 *
 * @since 0.1.0
 * @return {HTMLElement} container The html element.
 */
Canvas.prototype.appendTo = function (container)
{
    container.appendChild(this._canvas);
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
    return parseInt(this._canvas.getAttribute('width'));
};

/** 
 * Get the height of the canvas.
 *
 * @since 0.1.0
 * @return {number} The height.
 */
Canvas.prototype.height = function ()
{
    return parseInt(this._canvas.getAttribute('height'));
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
        this._canvas.setAttribute('width', w);
        this._canvas.setAttribute('height', h);
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
            item = this.circle(cx, cy, r);
        break;
        case 'ellipse':
            item = this.ellipse(cx, cy, r, r);
        break;
        case 'rect':
            item = this.rect(cx-r, cy-r, size, size);
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
    return this.getShapeItem('circle', cx-r, cy-r, r*2, r*2);
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
    return this.getShapeItem('ellipse', cx-rx, cy-ry, rx*2, ry*2);
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
    var item = new CanvasItem(type);
    item.dataUnits = {x:x, y:y, width:w, height:h};
    this._items.push(item);
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
    var item = new CanvasItem(type);
    item.dataUnits = {points:arrCoords};
    this._items.push(item);
    return item;
};

// Draw canvas items.

/** 
 * Clear the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.clear = function ()
{
    this._items = [];
    if (this._type === 'canvas') this._g.empty(this._canvas, this._ctx);
};

/** 
 * Renders the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.render = function ()
{
    if (this._type === 'canvas') this._g.empty(this._canvas, this._ctx);
    
    var n = this._items.length;
    for (var i = 0; i < n; i++)  
    {
        var item = this._items[i];

        if (item.type === 'polygon' || item.type === 'polyline' || item.type === 'line')  
        {
            this.drawPath(item);
        }    
        else
        {
            if (item.marker === true)   this.drawMarker(item);
            else                        this.drawShape(item);
        } 
    }
};

/** 
 * Draws an item.
 *
 * @since 0.1.0
 * @param {CanvasItem} item A canvas item.
 * @private
 */
Canvas.prototype.drawItem = function (item)
{
    if (item.context === undefined)
    {
        if (this._type === 'svg')
        {
            item.context = this._g.createElement(item.type);
            this._canvas.appendChild(item.context);
        }
        else
        {
            item.context = this._ctx;
        }
    }

    var p = item.pixelUnits;
    switch(item.type)
    {
        case 'circle':
            this._g.circle(item.context, p.cx, p.cy, p.r);
        break;
        case 'ellipse':
            this._g.ellipse(item.context, p.cx, p.cy, p.rx, p.ry);
        break;
        case 'rect':
            this._g.rect(item.context, p.x, p.y, p.width, p.height);
        break;
        case 'line':
            this._g.line(item.context, p.x1, p.y1, p.x2, p.y2);
        break;
        case 'polygon':
            this._g.polygon(item.context, p.points);
        break;
        case 'polyline':
            this._g.polyline(item.context, p.points);
        break;
    }

    this._g.draw(item.context, 
    {
        fillColor   : item.fillColor, 
        fillOpacity : item.fillOpacity,
        lineColor   : item.lineColor, 
        lineWidth   : item.lineWidth, 
        lineOpacity : item.lineOpacity, 
        lineJoin    : item.lineJoin, 
        lineCap     : item.lineCap
    });
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
    var d    = item.dataUnits;
    var size = d.width;
    var r    = size / 2;
    var cx   = this._coords.getPixelX(d.x + r);
    var cy   = this._coords.getPixelY(d.y + r);

    switch(item.type)
    {
        case 'circle':
            item.pixelUnits = {cx:cx, cy:cy, r:r};
        break;
        case 'ellipse':
            item.pixelUnits = {cx:cx, cy:cy, rx:r, ry:r};
        break;
        case 'rect':
            item.pixelUnits = {x:cx-r, y:cy-r, width:size, height:size};
        break;
    }
    this.drawItem(item);
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
    var d = item.dataUnits;
    var w = this._coords.getPixelDimensionX(d.width);
    var h = this._coords.getPixelDimensionY(d.height);
    var x = this._coords.getPixelX(d.x);
    var y = this._coords.getPixelY(d.y) - h;

    switch(item.type)
    {
        case 'rect':
            item.pixelUnits = {x:x, y:y, width:w, height:h};
        break;
        case 'ellipse':
            var rx = w / 2, ry = h / 2;
            item.pixelUnits = {cx:x+rx, cy:y+ry, rx:rx, ry:ry};
        break;
    }
    this.drawItem(item);
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
    var points = this._coords.getPixelArray(item.dataUnits.points);

    switch(item.type)
    {
        case 'line':
            item.pixelUnits = {x1:points[0], y1:points[1], x2:points[2], y2:points[3]};
        break;
        case 'polygon':
            item.pixelUnits = {points:points};
        break;
        case 'polyline':
            item.pixelUnits = {points:points};
        break;
    }
    this.drawItem(item);
};

module.exports = Canvas;