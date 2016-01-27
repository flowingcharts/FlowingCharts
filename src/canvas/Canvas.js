/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Canvas} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          canvas/Canvas 
 * @requires        utils/util
 * @requires        utils/canvas
 * @requires        utils/dom
 * @requires        utils/svg
 */

// Required modules.
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
 * @param {string}                      renderer    The renderer 'svg' or 'canvas'.
 * @param {CartesianCoords|PolarCoords} coords      The coordinate system. 
 */
function Canvas (renderer, coords)
{
    // Private instance members.  
    this._coords    = coords;
    this._items     = [];

    // Choose which canvas functions to use.
    if (renderer === 'svg') this._g = svgUtil;
    else                    this._g = canvasUtil;

    // Get the actual drawing canvas.
    this.canvas = this._g.getCanvas();
}

/** 
 * Appends the canvas to a html element.
 *
 * @since 0.1.0
 *
 * @return {HTMLElement} container The html element.
 */
Canvas.prototype.appendTo = function (container)
{
    container.appendChild(this.canvas);
};

// Geometry.

/** 
 * Get the width of the canvas.
 *
 * @since 0.1.0
 *
 * @return {number} The width.
 */
Canvas.prototype.width = function ()
{
    return parseInt(this.canvas.getAttribute('width'));
};

/** 
 * Get the height of the canvas.
 *
 * @since 0.1.0
 *
 * @return {number} The height.
 */
Canvas.prototype.height = function ()
{
    return parseInt(this.canvas.getAttribute('height'));
};

/** 
 * Set the size of the canvas.
 *
 * @since 0.1.0
 *
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
    if (w !== this.width() || h !== this.height()) dom.attr(this.canvas, {width:w, height:h});
};

// Create canvas items.

/** 
 * Creates a marker.
 *
 * @since 0.1.0
 *
 * @param {string} type     The marker type.
 * @param {number} [cx]     The x position of the center of the marker (data units).
 * @param {number} [cy]     The y position of the center of the marker (data units).
 * @param {number} [size]   The size of the marker (pixel units).
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.marker = function (type, cx, cy, size)
{
    var item = this.getItem(type, {cx:cx, cy:cy, size:size, units:'data'});
    item.marker = true;
    return item;
};

/** 
 * Creates a shape.
 *
 * @since 0.1.0
 *
 * @param {string} type The shape type.
 * @param {number} [x]  The x position of the top left corner (data units).
 * @param {number} [y]  The y position of the top left corner (data units).
 * @param {number} [w]  The width (data units).
 * @param {number} [h]  The height (data units).
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.shape = function (type, x, y, w, h)
{
    var item = this.getItem(type, {x:x, y:y, width:w, height:h, units:'data'});
    item.shape = true;
    return item;
};

/** 
 * Creates a circle.
 *
 * @since 0.1.0
 *
 * @param {number} [cx]             The x position of the center of the circle.
 * @param {number} [cy]             The y position of the center of the circle
 * @param {number} [r]              The radius of the circle.
 * @param {number} [units = pixel]  The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.circle = function (cx, cy, r, units)
{
    return this.getItem('circle', {cx:cx, cy:cy, r:r, units:units});
};

/** 
 * Creates an ellipse.
 *
 * @since 0.1.0
 *
 * @param {number} [cx]             The x position of the center of the ellipse.
 * @param {number} [cy]             The y position of the center of the ellipse
 * @param {number} [rx]             The x radius of the ellipse.
 * @param {number} [ry]             The y radius of the ellipse.
 * @param {number} [units = pixel]  The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.ellipse = function (cx, cy, rx, ry, units)
{
    return this.getItem('ellipse', {cx:cx, cy:cy, rx:rx, ry:ry, units:units});
};

/** 
 * Creates a rectangle.
 *
 * @since 0.1.0
 *
 * @param {number} [x]              The x position of the top left corner.
 * @param {number} [y]              The y position of the top left corner.
 * @param {number} [w]              The width.
 * @param {number} [h]              The height.
 * @param {number} [units = pixel]  The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.rect = function (x, y, w, h, units)
{
    return this.getItem('rect', {x:x, y:y, width:w, height:h, units:units});
};

/** 
 * Creates a line.
 *
 * @since 0.1.0
 *
 * @param {number} [x1]             The x position of point 1.
 * @param {number} [y1]             The y position of point 1.
 * @param {number} [x2]             The x position of point 2.
 * @param {number} [y2]             The y position of point 2.
 * @param {number} [units = pixel]  The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.line = function (x1, y1, x2, y2, units)
{
    return this.getItem('line', {x1:x1, y1:y1, x2:x2, y2:y2, units:units});
};

/** 
 * Creates a polyline.
 *
 * @since 0.1.0
 *
 * @param {number[]}    arrCoords       An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {number}      [units = pixel] The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.polyline = function (arrCoords, units)
{
    return this.getItem('polyline', {points:arrCoords, units:units});
};

/** 
 * Creates a polygon.
 *
 * @since 0.1.0
 *
 * @param {number[]}    arrCoords       An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {number}      [units = pixel] The units - 'pixel' or 'data'.
 *
 * @return {Object} A canvas item.
 */
Canvas.prototype.polygon = function (arrCoords, units)
{
    return this.getItem('polygon', {points:arrCoords, units:units});
};

// Drawing.

/** 
 * Empties the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.empty = function ()
{
    this._items = [];
    this._g.empty(this.canvas);
};

/** 
 * Renders the canvas.
 *
 * @since 0.1.0
 */
Canvas.prototype.render = function ()
{
    this._g.clear(this.canvas);
    
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
 *
 * @param {Object} item A canvas item.
 */
Canvas.prototype.drawItem = function (item)
{
    var p;
    if (this._coords !== undefined && item.coords.units === 'data') p = this.getPixelUnits(item);   // Canvas using data units.
    else                                                            p = item.coords;                // Canvas using pixel units.

    if (item.marker) 
    {
        // coords{cx, cy, size}
        var r = p.size / 2;
        switch(item.type)
        {
            case 'circle'   : this._g.circle(item.context, p.cx, p.cy, r, item.style); break;
            case 'ellipse'  : this._g.ellipse(item.context, p.cx, p.cy, r, r, item.style); break;
            case 'rect'     : this._g.rect(item.context, p.cx-r, p.cy-r, p.size, p.size, item.style); break;
        }
    } 
    else if (item.shape) 
    {
        // coords{x, y, width, height}
        switch(item.type)
        {
            case 'rect'     : this._g.rect(item.context, p.x, p.y, p.width, p.height, item.style); break;
            case 'ellipse'  : this._g.ellipse(item.context, p.x+(p.width/2), p.y+(p.height/2), p.width/2, p.height/2, item.style); break;
        }
    }
    else
    {
        switch(item.type)
        {
            case 'circle'   : this._g.circle(item.context, p.cx, p.cy, p.r, item.style); break;
            case 'ellipse'  : this._g.ellipse(item.context, p.cx, p.cy, p.rx, p.ry, item.style); break;
            case 'rect'     : this._g.rect(item.context, p.x, p.y, p.width, p.height, item.style);  break;
            case 'line'     : this._g.line(item.context, p.x1, p.y1, p.x2, p.y2, item.style); break;
            case 'polygon'  : this._g.polygon(item.context, p.points, item.style); break;
            case 'polyline' : this._g.polyline(item.context, p.points, item.style); break;
        }
    }
};

/** 
 * Adds an item.
 *
 * @since 0.1.0
 *
 * @param {Object} item A canvas item.
 *
 * @return {Object} The canvas item.
 */
Canvas.prototype.addItem = function (item)
{
    item.context = this._g.getContext(this.canvas, item.type);
    this._items.push(item);
    return item;
};

/** 
 * Returns a canvas item.
 *
 * @since 0.1.0
 * @private
 *
 * @param {string} type     The shape type.
 * @param {Object} coords   The coords.
 *
 * @return {Object} The canvas item.
 */
Canvas.prototype.getItem = function (type, coords)
{
    return this.addItem({type:type, coords:coords});
};

/** 
 * Returns a hit event for the nearest item.
 *
 * @since 0.1.0
 *
 * @param {number} x The x pixel coord.
 * @param {number} y The y pixel coord.
 *
 * @return {Object} The canvas item.
 */
Canvas.prototype.hitEvent = function (x, y)
{
    var items = [];
    var shortestDistance = Infinity;

    var n = this._items.length;
    for (var i = 0; i < n; i++)  
    {
        var item = this._items[i];
        var p    = this.getPixelUnits(item);
        var dx   = x - p.cx;
        var dy   = y - p.cy;
        var dp   = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (dp === shortestDistance) 
        {
            items.push(item);
        }
        else if (dp < shortestDistance) 
        {
            items = [];
            items.push(item);
            shortestDistance = dp;
        }
    }

    if (items.length > 0)
    {
        var d = this.getPixelUnits(items[0]);
        return {
            items    : items, 
            distance : shortestDistance, 
            pixelX   : d.cx, 
            pixelY   : d.cy
        };
    }
    else return undefined;
};

/** 
 * Gets the pixel units for an item.
 *
 * @since 0.1.0
 *
 * @param {Object}                      item    The canvas item.
 * @param {CartesianCoords|PolarCoords} coords  The coordinate system 
 */
Canvas.prototype.getPixelUnits = function (item)
{
    var pixelUnits = {};

    if (item.marker) 
    {
        // coords{cx, cy, size}
        pixelUnits.cx   = this._coords.getPixelX(item.coords.cx);
        pixelUnits.cy   = this._coords.getPixelY(item.coords.cy); 
        pixelUnits.size = item.coords.size; 
    } 
    else if (item.shape) 
    {
        // coords{x, y, width, height}
        pixelUnits.x      = this._coords.getPixelX(item.coords.x);
        pixelUnits.y      = this._coords.getPixelY(item.coords.y); 
        pixelUnits.width  = this._coords.getPixelDimensionX(item.coords.width);
        pixelUnits.height = this._coords.getPixelDimensionY(item.coords.height); 
    }
    else
    {
        switch(item.type)
        {
            // coords{cx, cy, r}
            case 'circle':      
                pixelUnits.cx = this._coords.getPixelX(item.coords.cx);
                pixelUnits.cy = this._coords.getPixelY(item.coords.cy); 
                pixelUnits.r  = item.coords.r; 
            break;
            // coords{cx, cy, rx, ry}
            case 'ellipse':     
                pixelUnits.cx = this._coords.getPixelX(item.coords.cx);
                pixelUnits.cy = this._coords.getPixelY(item.coords.cy); 
                pixelUnits.rx = this._coords.getPixelDimensionX(item.coords.rx);
                pixelUnits.ry = this._coords.getPixelDimensionY(item.coords.ry); 
            break;
            // coords{x, y, width, height}  
            case 'rect':        
                pixelUnits.x      = this._coords.getPixelX(item.coords.x);
                pixelUnits.y      = this._coords.getPixelY(item.coords.y); 
                pixelUnits.width  = this._coords.getPixelDimensionX(item.coords.width);
                pixelUnits.height = this._coords.getPixelDimensionY(item.coords.height); 
            break;
            // coords{x1, y1, x2, y2}
            case 'line':          
                pixelUnits.x1 = this._coords.getPixelX(item.coords.x1);
                pixelUnits.y1 = this._coords.getPixelY(item.coords.y1); 
                pixelUnits.x2 = this._coords.getPixelX(item.coords.x2);
                pixelUnits.y2 = this._coords.getPixelY(item.coords.y2); 
            break;
            // coords{points}
            case 'polyline':    
                pixelUnits.points = this._coords.getPixelArray(item.coords.points);
            break;
            // coords{points} 
            case 'polygon':      
                pixelUnits.points = this._coords.getPixelArray(item.coords.points);
            break;
        }
    }

    return pixelUnits;
};

module.exports = Canvas;