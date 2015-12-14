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
 * @param {CartesianCoords|PolarCoords} [coords] The coordinate system to use when drawing. If no coordinate system is defined pixel units are used. 
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
 * @return {CanvasItem} A canvas item.
 */
Canvas.prototype.marker = function (type, cx, cy, size)
{
    var item = getItem(type, {cx:cx, cy:cy, r:size/2}, this._items);
    item.marker = true;
    return item;
};

/** 
 * Creates a shape.
 *
 * @since 0.1.0
 * @param {string} type The shape type.
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y position of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {CanvasItem} A canvas item.
 */
Canvas.prototype.shape = function (type, x, y, w, h)
{
    var item = getItem(type, {x:x, y:y, width:w, height:h}, this._items);
    item.shape = true;
    return item;
};

/** 
 * Creates a circle.
 *
 * @since 0.1.0
 * @param {number} cx The x position of the center of the circle.
 * @param {number} cy The y position of the center of the circle
 * @param {number} r The radius of the circle.
 * @return {CanvasItem} A canvas item.
 */
Canvas.prototype.circle = function (cx, cy, r)
{
    return getItem('circle', {cx:cx, cy:cy, r:r}, this._items);
};

/** 
 * Creates an ellipse.
 *
 * @since 0.1.0
 * @param {number} cx The x position of the center of the ellipse.
 * @param {number} cy The y position of the center of the ellipse
 * @param {number} rx The x radius of the ellipse.
 * @param {number} ry The y radius of the ellipse.
 * @return {CanvasItem} A canvas item.
 */
Canvas.prototype.ellipse = function (cx, cy, rx, ry)
{
    return getItem('ellipse', {cx:cx, cy:cy, rx:rx, ry:ry}, this._items);
};

/** 
 * Creates a rectangle.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y position of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {CanvasItem} A canvas item.
 */
Canvas.prototype.rect = function (x, y, w, h)
{
    return getItem('rect', {x:x, y:y, width:w, height:h}, this._items);
};

/** 
 * Creates a line.
 *
 * @since 0.1.0
 * @param {number} x1 The x position of point 1.
 * @param {number} y1 The y position of point 1.
 * @param {number} x2 The x position of point 2.
 * @param {number} y2 The y position of point 2.
 * @return {CanvasItem} A canvas item.
 */
Canvas.prototype.line = function (x1, y1, x2, y2)
{
    return getItem('line', {x1:x1, y1:y1, x2:x2, y2:y2}, this._items);
};

/** 
 * Creates a polyline.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {CanvasItem} A canvas item.
 */
Canvas.prototype.polyline = function (arrCoords)
{
    return getItem('polyline', {points:arrCoords}, this._items);
};

/** 
 * Creates a polygon.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {CanvasItem} A canvas item.
 */
Canvas.prototype.polygon = function (arrCoords)
{
    return getItem('polygon', {points:arrCoords}, this._items);
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
    if (item.context === undefined)
    {
        if (this._renderer === 'svg')
        {
            item.context = this._g.createElement(item.type);
            this._canvas.appendChild(item.context);
        }
        else item.context = this._ctx;
    }

    var p;
    if (this._coords !== undefined) p = getPixelUnits(item, this._coords);  // Canvas using data units.
    else                            p = item.coords;                        // Canvas using pixel units.

    if (item.marker) // coords{cx, cy, r}
    {
        switch(item.type)
        {
            case 'circle'   : this._g.circle(item.context, p.cx, p.cy, p.r, item); break;
            case 'ellipse'  : this._g.ellipse(item.context, p.cx, p.cy, p.r, p.r, item); break;
            case 'rect'     : this._g.rect(item.context, p.cx-p.r, p.cy-p.r, p.r*2, p.r*2, item); break;
        }
    } 
    else if (item.shape) // coords{x, y, width, height}
    {
        switch(item.type)
        {
            case 'rect'     : this._g.rect(item.context, p.x, p.y, p.width, p.height, item); break;
            case 'ellipse'  : this._g.ellipse(item.context, p.x+(p.width/2), p.y+(p.height/2), p.width/2, p.height/2, item); break;
        }
    }
    else
    {
        switch(item.type)
        {
            case 'circle'   : this._g.circle(item.context, p.cx, p.cy, p.r, item); break;
            case 'ellipse'  : this._g.ellipse(item.context, p.cx, p.cy, p.rx, p.ry, item); break;
            case 'rect'     : this._g.rect(item.context, p.x, p.y, p.width, p.height, item);  break;
            case 'line'     : this._g.line(item.context, p.x1, p.y1, p.x2, p.y2, item); break;
            case 'polygon'  : this._g.polygon(item.context, p.points, item); break;
            case 'polyline' : this._g.polyline(item.context, p.points, item); break;
        }
    }
};

/** 
 * Returns a canvas item.
 *
 * @since 0.1.0
 * @param {string} type The shape type.
 * @return {Object} coords The coord information.
 * @return {CanvasItem[]} items The item list.
 * @private
 */
function getItem (type, coords, items)
{
    var item = new CanvasItem(type, coords);
    items.push(item);
    return item;
}

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
    var pixelUnits = {};

    if (item.marker) // coords{cx, cy, r}
    {
        pixelUnits.cx = coords.getPixelX(item.coords.cx);
        pixelUnits.cy = coords.getPixelY(item.coords.cy); 
        pixelUnits.r  = item.coords.r; 
    } 
    else if (item.shape) // coords{x, y, width, height}   
    {
        pixelUnits.x      = coords.getPixelX(item.coords.x);
        pixelUnits.y      = coords.getPixelY(item.coords.y); 
        pixelUnits.width  = coords.getPixelDimensionX(item.coords.width);
        pixelUnits.height = coords.getPixelDimensionY(item.coords.height); 
    }
    else
    {
        switch(item.type)
        {
            // coords{cx, cy, r}
            case 'circle':      
                pixelUnits.cx = coords.getPixelX(item.coords.cx);
                pixelUnits.cy = coords.getPixelY(item.coords.cy); 
                pixelUnits.r  = item.coords.r; 
            break;
            // coords{cx, cy, rx, ry}
            case 'ellipse':     
                pixelUnits.cx = coords.getPixelX(item.coords.cx);
                pixelUnits.cy = coords.getPixelY(item.coords.cy); 
                pixelUnits.rx = coords.getPixelDimensionX(item.coords.rx);
                pixelUnits.ry = coords.getPixelDimensionY(item.coords.ry); 
            break;
            // coords{x, y, width, height}  
            case 'rect':        
                pixelUnits.x      = coords.getPixelX(item.coords.x);
                pixelUnits.y      = coords.getPixelY(item.coords.y); 
                pixelUnits.width  = coords.getPixelDimensionX(item.coords.width);
                pixelUnits.height = coords.getPixelDimensionY(item.coords.height); 
            break;
            // coords{x1, y1, x2, y2}
            case 'line':          
                pixelUnits.x1 = coords.getPixelX(item.coords.x1);
                pixelUnits.y1 = coords.getPixelY(item.coords.y1); 
                pixelUnits.x2 = coords.getPixelX(item.coords.x2);
                pixelUnits.y2 = coords.getPixelY(item.coords.y2); 
            break;
            // coords{points} 
            case 'polygon':      
                pixelUnits.points = coords.getPixelArray(item.coords.points);
            break;
            // coords{points}
            case 'polyline':    
                pixelUnits.points = coords.getPixelArray(item.coords.points);
            break;
        }
    }

    return pixelUnits;
}

module.exports = Canvas;