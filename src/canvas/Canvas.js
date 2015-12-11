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
 * @requires utils/dom
 * @requires utils/svg
 */

// Required modules.
var CanvasItem = require('./CanvasItem');
var util       = require('../utils/util');
var canvasUtil = require('../utils/canvas');
var svgUtil    = require('../utils/svg');
var dom        = require('../utils/dom');

/** 
 * @classdesc Class for graphics libraries.
 *
 * @class
 * @alias Canvas
 * @since 0.1.0
 * @constructor
 *
 * @param {string} renderer The renderer 'svg' or 'canvas'.
 * @param {CartesianCoords|PolarCoords} coords The coordinate system to use when drawing. 
 */
function Canvas (renderer, coords)
{
    // Private instance members.  
    this._renderer  = renderer;
    this._coords    = coords;
    this._items     = [];

    // Choose which canvas functions to use.
    if (this._renderer === 'svg')   this._g = svgUtil;
    else                            this._g = canvasUtil;

    // Get the actual drawing canvas.
    this._canvas = this._g.getCanvas();
    if (this._renderer === 'canvas') this._ctx = this._canvas.getContext('2d');
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

    // Canvas size.
    if (w !== this.width() || h !== this.height()) dom.attr(this._canvas, {width:w, height:h});
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
    var item = new CanvasItem('circle');
    item.dataUnits = {x:cx-r, y:cy-r, width:r*2, height:r*2};
    this._items.push(item);
    return item;
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
    var item = new CanvasItem('ellipse');
    item.dataUnits = {x:cx-rx, y:cy-ry, width:rx*2, height:ry*2};
    this._items.push(item);
    return item;
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
    var item = new CanvasItem('rect');
    item.dataUnits = {x:x, y:y, width:w, height:h};
    this._items.push(item);
    return item;
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
    var item = new CanvasItem('line');
    item.dataUnits = {points:[x1, y1, x2, y2]};
    this._items.push(item);
    return item;
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
    var item = new CanvasItem('polyline');
    item.dataUnits = {points:arrCoords};
    this._items.push(item);
    return item;
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
    var item = new CanvasItem('polygon');
    item.dataUnits = {points:arrCoords};
    this._items.push(item);
    return item;
};

// Drawing.

/** 
 * Clear the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.clear = function ()
{
    this._items = [];
    if (this._renderer === 'canvas') this._g.empty(this._canvas, this._ctx);
};

/** 
 * Renders the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.render = function ()
{
    if (this._renderer === 'canvas') this._g.empty(this._canvas, this._ctx);
    
    var n = this._items.length;
    for (var i = 0; i < n; i++)  
    {
        var item = this._items[i];
        this.drawItem(item);
    }
};

/** 
 * Draws an item.
 *
 * @since 0.1.0
 * @param {CanvasItem} item A canvas item.
 */
Canvas.prototype.drawItem = function (item)
{
    item.pixelUnits = getPixelUnits(item, this._coords);

    if (item.context === undefined)
    {
        if (this._renderer === 'svg')
        {
            item.context = this._g.createElement(item.type);
            this._canvas.appendChild(item.context);
        }
        else item.context = this._ctx;
    }

    var p = item.pixelUnits;
    switch(item.type)
    {
        case 'circle':
            this._g.circle(item.context, p.cx, p.cy, p.r, item);
        break;
        case 'ellipse':
            this._g.ellipse(item.context, p.cx, p.cy, p.rx, p.ry, item);
        break;
        case 'rect':
            this._g.rect(item.context, p.x, p.y, p.width, p.height, item);
        break;
        case 'line':
            this._g.line(item.context, p.x1, p.y1, p.x2, p.y2, item);
        break;
        case 'polygon':
            this._g.polygon(item.context, p.points, item);
        break;
        case 'polyline':
            this._g.polyline(item.context, p.points, item);
        break;
    }
};

/** 
 * Gets the pixel units for an item.
 *
 * @since 0.1.0
 * @param {CanvasItem} item The item.
 * @param {CartesianCoords|PolarCoords} coords The coordinate system to use when drawing. 
 * @private
 */
function getPixelUnits (item, coords)
{
    var dataUnits = item.dataUnits;
    var type      = item.type;
    var pixelUnits;

    if (type === 'polygon' || type === 'polyline' || type === 'line')  // Path.
    {
        var points = coords.getPixelArray(dataUnits.points);
        switch(type)
        {
            case 'line':
                pixelUnits = {x1:points[0], y1:points[1], x2:points[2], y2:points[3]};
            break;
            case 'polygon':
                pixelUnits = {points:points};
            break;
            case 'polyline':
                pixelUnits = {points:points};
            break;
        }
    }    
    else if (item.marker === true) // Marker.
    {
        var size = dataUnits.width;
        var r    = size / 2;
        var cx   = coords.getPixelX(dataUnits.x + r);
        var cy   = coords.getPixelY(dataUnits.y + r); 
        switch(type)
        {
            case 'circle':
                pixelUnits = {cx:cx, cy:cy, r:r};
            break;
            case 'ellipse':
                pixelUnits = {cx:cx, cy:cy, rx:r, ry:r};
            break;
            case 'rect':
                pixelUnits = {x:cx-r, y:cy-r, width:size, height:size};
            break;
        }
    } 
    else // Shape.
    {
        var w = coords.getPixelDimensionX(dataUnits.width);
        var h = coords.getPixelDimensionY(dataUnits.height);
        var x = coords.getPixelX(dataUnits.x);
        var y = coords.getPixelY(dataUnits.y) - h;
        switch(type)
        {
            case 'rect':
                pixelUnits = {x:x, y:y, width:w, height:h};
            break;
            case 'ellipse':
                var rx = w / 2, ry = h / 2;
                pixelUnits = {cx:x+rx, cy:y+ry, rx:rx, ry:ry};
            break;
        }
    }

    return pixelUnits;
}

module.exports = Canvas;