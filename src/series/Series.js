/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Series} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module charts/Series 
 * @requires canvas/HtmlCanvas
 * @requires canvas/SvgCanvas
 * @requires utils/util
 */

// Required modules.
var HtmlCanvas      = require('../canvas/HtmlCanvas');
var SvgCanvas       = require('../canvas/SvgCanvas');
var util            = require('../utils/util');
var isNumber        = util.isNumber;
var extendObject    = util.extendObject;

/** 
 * @classdesc A base class for series.
 *
 * @class
 * @alias Series
 * @since 0.1.0
 * @constructor
 *
 * @param {Object} [options] The series options.
 * @param {string} [options.data = []] The data - an array of the form [{x:10, y:20}, {x:10, y:20}, {x:10, y:20}, ...].
 * @param {string} [options.idField = 'id'] The data property that contains the id value.
 * @param {string} [options.nameField = 'name'] The data property that contains the  name value.
 * @param {string} [options.xField = 'x'] The data property that contains the x value.
 * @param {string} [options.yField = 'y'] The data property that contains the y value.
 * @param {string} [options.sizeField = 'size'] The data property that contains the size value.
 * @param {string} [options.colorField = 'color'] The data property that contains the color value.
 * @param {string} [options.shapeField = 'shape'] The data property that contains the shape value.
 * @param {string} [options.shape = 'circle'] The shape to use for rendering.
 * @param {string} [options.markerSize = 10] The marker size.
 * @param {string} [options.fillColor = '#ffffff'] The fill color.
 * @param {number} [options.fillOpacity = 1] The fill opacity.
 * @param {string} [options.lineColor = '#000000'] The line color.
 * @param {number} [options.lineWidth = 0] The line width.
 * @param {string} [options.lineJoin = 'round'] The line join, one of "bevel", "round", "miter".
 * @param {string} [options.lineCap = 'butt'] The line cap, one of "butt", "round", "square".
 * @param {number} [options.lineOpacity = 1] The line opacity.
 */
function Series (options)
{
    // Private instance members.  
    this._options = null;   // The options.
    this._items = [];       // The list of items belonging to the series.

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
     * The minimum x value.
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
     * The minimum x value.
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
    this.canvas = null;

    this.options(options);
}

/** 
 * Get or set the options for the series.
 *
 * @since 0.1.0
 * @param {Object} [options] The series options.
 * @param {string} [options.data = []] The data - an array of the form [{x:10, y:20}, {x:10, y:20}, {x:10, y:20}, ...].
 * @param {string} [options.idField = 'id'] The data property that contains the id value.
 * @param {string} [options.nameField = 'name'] The data property that contains the  name value.
 * @param {string} [options.xField = 'x'] The data property that contains the x value.
 * @param {string} [options.yField = 'y'] The data property that contains the y value.
 * @param {string} [options.sizeField = 'size'] The data property that contains the size value.
 * @param {string} [options.colorField = 'color'] The data property that contains the color value.
 * @param {string} [options.shapeField = 'shape'] The data property that contains the shape value.
 * @param {string} [options.shape = 'circle'] The shape to use for rendering.
 * @param {string} [options.markerSize = 10] The marker size.
 * @param {string} [options.fillColor = '#ffffff'] The fill color.
 * @param {number} [options.fillOpacity = 1] The fill opacity.
 * @param {string} [options.lineColor = '#000000'] The line color.
 * @param {number} [options.lineWidth = 0] The line width.
 * @param {string} [options.lineJoin = 'round'] The line join, one of "bevel", "round", "miter".
 * @param {string} [options.lineCap = 'butt'] The line cap, one of "butt", "round", "square".
 * @param {number} [options.lineOpacity = 1] The line opacity.
 * @return {Object|Series} The options if no arguments are supplied, otherwise <code>this</code>.
 */
Series.prototype.options = function(options)
{
    if (arguments.length > 0)
    {
        // Default options.
        this._options = 
        {
            data        : [],
            idField     : 'id',
            nameField   : 'name',
            xField      : 'x',
            yField      : 'y',
            sizeField   : 'size',
            colorField  : 'color',
            shapeField  : 'shape',
            shape       : 'circle',
            markerSize  : 10,
            fillColor   : '#ffffff', 
            fillOpacity : 1,
            lineColor   : '#000000',  
            lineWidth   : 0, 
            lineJoin    : 'round', 
            lineCap     : 'butt', 
            lineOpacity : 1
        };
        // Extend default options with passed in options.
        extendObject(this._options, options);

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
        var item = 
        {
            id          : dataItem[this._options.idField]    !== undefined ? dataItem[this._options.idField]    : i,
            name        : dataItem[this._options.nameField]  !== undefined ? dataItem[this._options.nameField]  : i,
            markerSize  : dataItem[this._options.sizeField]  !== undefined ? dataItem[this._options.sizeField]  : this._options.markerSize,
            shape       : dataItem[this._options.shapeField] !== undefined ? dataItem[this._options.shapeField] : this._options.shape,
            x           : dataItem[this._options.xField],
            y           : dataItem[this._options.yField],
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
        if (isNumber(item.x) && isNumber(item.y))
        {
            this.xMin = Math.min(this.xMin, item.x);
            this.xMax = Math.max(this.xMax, item.x);
            this.yMin = Math.min(this.yMin, item.y);
            this.yMax = Math.max(this.yMax, item.y);
        }
    }
    return this;
};

/** 
 * Renders the graphics.
 *
 * @since 0.1.0
 * @return {Series} <code>this</code>.
 */
Series.prototype.render = function()
{
    // TODO For svg we dont want to clear - just change attributes of current dom.
    this.canvas.clear();

    var n = this._items.length;
    for (var i = 0; i < n; i++)  
    {
        var item = this._items[i];

        if (isNumber(item.x) && isNumber(item.y))
        {
            this.canvas.marker(item.shape, item.x, item.y, item.markerSize);

            this.canvas.fill(
            {
                color   : item.fillColor,
                opacity : item.fillOpacity
            });

            if (this._options.lineWidth > 0) 
            {
                this.canvas.stroke(
                {
                    color   : item.lineColor,
                    width   : item.lineWidth,
                    join    : item.lineJoin,
                    cap     : item.lineCap,
                    opacity : item.lineOpacity
                });
            }
        }
    }
    return this;

    /*
    this.canvas.rect(0, 0, 50, 50).fillColor('#00f500').lineWidth(15).fill().stroke();
    this.canvas.ellipse(10, 10, 80, 50).fillColor('#f50000').lineWidth(15).fillOpacity(0.7).fill().stroke();
    this.canvas.circle(50, 50, 50).fillColor('#0000f5').fill().stroke({width:12});
    this.canvas.polygon([50, 0, 100, 0, 100, 50]).fillColor('#0ff0f5').fill().stroke();
    this.canvas.marker('square', 0, 0, 100).fillColor('#fff500').lineWidth(2).fill().stroke();
    this.canvas.marker('circle', 0, 0, 100).fillColor('#ccf500').lineWidth(2).fill().stroke();
    */
};

module.exports = Series;