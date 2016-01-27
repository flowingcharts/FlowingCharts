/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Series} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          charts/Series 
 * @requires        utils/util
 */

// Required modules.
var util = require('../utils/util');

/** 
 * @classdesc A base class for series.
 *
 * @class
 * @alias Series
 * @since 0.1.0
 * @constructor
 *
 * @param {Canvas} The drawing canvas.
 * @param {Object} [options]                        The series options.
 * @param {string} [options.data = []]              The data - an array of the form [{x:10, y:20}, {x:10, y:20}, {x:10, y:20}, ...].
 * @param {string} [options.idField = id]           The data property that contains the id value.
 * @param {string} [options.nameField = name]       The data property that contains the  name value.
 * @param {string} [options.xField = x]             The data property that contains the x value.
 * @param {string} [options.yField = y]             The data property that contains the y value.
 * @param {string} [options.sizeField = size]       The data property that contains the size value.
 * @param {string} [options.colorField = color]     The data property that contains the color value.
 * @param {string} [options.shapeField = shape]     The data property that contains the shape value.
 * @param {string} [options.imageField = image]     The data property that contains the image value.
 * @param {string} [options.shape = circle]         The shape to use for rendering.
 * @param {string} [options.image]                  The image to use for rendering.
 * @param {string} [options.markerSize = 8]         The marker size.
 * @param {string} [options.fillColor = #ffffff]    The fill color.
 * @param {number} [options.fillOpacity = 1]        The fill opacity.
 * @param {string} [options.lineColor = #000000]    The line color.
 * @param {number} [options.lineWidth = 0]          The line width.
 * @param {string} [options.lineJoin = round]       The line join, one of "bevel", "round", "miter".
 * @param {string} [options.lineCap = butt]         The line cap, one of "butt", "round", "square".
 * @param {number} [options.lineOpacity = 1]        The line opacity.
 */
function Series (canvas, options)
{
    // Private instance members.  
    this._items = []; // The list of items belonging to the series.

    // Public instance members.  

    /** 
     * The minimum x value.
     * 
     * @since 0.1.0
     * @type number
     * @default 0
     */
    this.xMin = 0;

    /** 
     * The maximum x value.
     * 
     * @since 0.1.0
     * @type number
     * @default 100
     */
    this.xMax = 100;
    
    /** 
     * The minimum x value.
     * 
     * @since 0.1.0
     * @type number
     * @default 0
     */
    this.yMin = 0;
    
    /** 
     * The maximum y value.
     * 
     * @since 0.1.0
     * @type number
     * @default 100
     */
    this.yMax = 100;
    
    /** 
     * The drawing canvas.
     * 
     * @since 0.1.0
     * @type Canvas
     * @default null
     */
    this.canvas = canvas;

    this.options(options);
}

/** 
 * Get or set the options for the series.
 *
 * @since 0.1.0
 *
 * @param {Object} [options]                        The series options.
 * @param {string} [options.data = []]              The data - an array of the form [{x:10, y:20}, {x:10, y:20}, {x:10, y:20}, ...].
 * @param {string} [options.idField = id]           The data property that contains the id value.
 * @param {string} [options.nameField = name]       The data property that contains the  name value.
 * @param {string} [options.xField = x]             The data property that contains the x value.
 * @param {string} [options.yField = y]             The data property that contains the y value.
 * @param {string} [options.sizeField = size]       The data property that contains the size value.
 * @param {string} [options.colorField = color]     The data property that contains the color value.
 * @param {string} [options.shapeField = shape]     The data property that contains the shape value.
 * @param {string} [options.imageField = image]     The data property that contains the image value.
 * @param {string} [options.shape = circle]         The shape to use for rendering.
 * @param {string} [options.image = ]               The image to use for rendering.
 * @param {string} [options.markerSize = 8]         The marker size.
 * @param {string} [options.fillColor]              The fill color.
 * @param {number} [options.fillOpacity = 1]        The fill opacity.
 * @param {string} [options.lineColor]              The line color.
 * @param {number} [options.lineWidth = 1]          The line width.
 * @param {string} [options.lineJoin = round]       The line join, one of "bevel", "round", "miter".
 * @param {string} [options.lineCap = butt]         The line cap, one of "butt", "round", "square".
 * @param {number} [options.lineOpacity = 1]        The line opacity.
 *
 * @return {Object|Series}                          The options if no arguments are supplied, otherwise <code>this</code>.
 */
Series.prototype.options = function(options)
{
    if (arguments.length > 0)
    {
        this._options = // Default options.
        {
            data        : [],
            idField     : 'id',
            nameField   : 'name',
            xField      : 'x',
            yField      : 'y',
            sizeField   : 'size',
            colorField  : 'color',
            shapeField  : 'shape',
            imageField  : 'image',
            shape       : 'circle',
            image       : undefined,
            markerSize  : 8,
            fillColor   : undefined, 
            fillOpacity : undefined,
            lineColor   : undefined,  
            lineWidth   : undefined, 
            lineJoin    : undefined, 
            lineCap     : undefined, 
            lineOpacity : undefined
        };   

        // Extend default options with passed in options.
        util.extendObject(this._options, options);

        // Process the data.
        this.update();

        return this;
    }
    else return this._options;
};

/** 
 * Updates the series.
 *
 * @since 0.1.0
 *
 * @return {Series} <code>this</code>.
 */
Series.prototype.update = function()
{
    this._items = [];

    this.xMin = Infinity;
    this.xMax = -Infinity;
    this.yMin = Infinity;
    this.yMax = -Infinity;

    var n = this._options.data.length;
    for (var i = 0; i < n; i++)  
    {
        var dataItem = this._options.data[i];

        // Add a new series item for each data item.
        var x           = dataItem[this._options.xField];
        var y           = dataItem[this._options.yField];
        var id          = dataItem[this._options.idField]    !== undefined ? dataItem[this._options.idField]    : i;
        var name        = dataItem[this._options.nameField]  !== undefined ? dataItem[this._options.nameField]  : i;
        var markerSize  = dataItem[this._options.sizeField]  !== undefined ? dataItem[this._options.sizeField]  : this._options.markerSize;
        var shape       = dataItem[this._options.shapeField] !== undefined ? dataItem[this._options.shapeField] : this._options.shape;

        if (util.isNumber(x) && util.isNumber(y))
        {
            var item = this.canvas.marker(shape, x, y, markerSize);
            //var item = this.canvas.shape(shape, x, y, markerSize, markerSize);
            item.style = 
            {
                fillColor   : dataItem[this._options.colorField] !== undefined ? dataItem[this._options.colorField] : this._options.fillColor,
                fillOpacity : this._options.fillOpacity,
                lineColor   : this._options.lineColor,
                lineWidth   : this._options.lineWidth,
                lineJoin    : this._options.lineJoin,
                lineCap     : this._options.lineCap,
                lineOpacity : this._options.lineOpacity
            };

            this._items.push(item);

            // Get the min and max values in the data.
            this.xMin = Math.min(this.xMin, x);
            this.xMax = Math.max(this.xMax, x);
            this.yMin = Math.min(this.yMin, y);
            this.yMax = Math.max(this.yMax, y);
        }
    }
    return this;
};

/** 
 * Renders the graphics.
 *
 * @since 0.1.0
 *
 * @return {Series} <code>this</code>.
 */
Series.prototype.render = function()
{
    this.canvas.render();
};

/** 
 * Returns a hit event for the nearest item.
 *
 * @since 0.1.0
 *
 * @param {number} x The x pixel coord.
 * @param {number} y The y pixel coord.
 *
 * @return {CanvasItem} The canvas item.
 */
Series.prototype.hitEvent = function(x, y)
{
    return this.canvas.hitEvent(x, y);
};

module.exports = Series;