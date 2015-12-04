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
    this._options = null; // The options.

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
        this.data(this._options.data);
        return this;
    }
    else return this._options;
};

/** 
 * Get or set the data for the series.
 *
 * @since 0.1.0
 * @param {Object[]} [arrData] The data - an array of the form [{x:10, y:20}, {x:10, y:20}, {x:10, y:20}, ...].
 * @return {Object|Series} The data if no arguments are supplied, otherwise <code>this</code>.
 */
Series.prototype.data = function(arrData)
{
    if (arguments.length > 0)
    {
        this._options.data = arrData.concat();

        // Get the min and max values in the data.
        this.xMin = Infinity;
        this.xMax = -Infinity;
        this.yMin = Infinity;
        this.yMax = -Infinity;

        var n = this._options.data.length;
        for (var i = 0; i < n; i++)  
        {
            var item    = this._options.data[i];
            var x       = item[this._options.xField];
            var y       = item[this._options.yField];

            if (isNumber(x) && isNumber(y))
            {
                this.xMin = Math.min(this.xMin, x);
                this.xMax = Math.max(this.xMax, x);
                this.yMin = Math.min(this.yMin, y);
                this.yMax = Math.max(this.yMax, y);
            }
        }

        return this;
    }
    else return this._options.data;
};

/** 
 * Renders the graphics.
 *
 * @since 0.1.0
 */
Series.prototype.render = function()
{
    // TODO For svg we dont want to clear - just change attributes of current dom.
    this.canvas.clear();

    var n = this._options.data.length;
    for (var i = 0; i < n; i++)  
    {
        var item    = this._options.data[i];
        var x       = item[this._options.xField];
        var y       = item[this._options.yField];
        var size    = item[this._options.sizeField];
        var color   = item[this._options.colorField];
        var shape   = item[this._options.shapeField];

        if (isNumber(x) && isNumber(y))
        {
            var markerSize  = size !== undefined ? size : this._options.markerSize;
            var markerShape = shape !== undefined ? shape : this._options.shape;
            var fillColor   = color !== undefined ? color : this._options.fillColor;

            this.canvas.marker(markerShape, x, y, markerSize);

            this.canvas.fill(
            {
                color   : fillColor,
                opacity : this._options.fillOpacity
            });

            if (this._options.lineWidth > 0) 
            {
                this.canvas.stroke(
                {
                    color   : this._options.lineColor,  
                    width   : this._options.lineWidth, 
                    join    : this._options.lineJoin, 
                    cap     : this._options.lineCap, 
                    opacity : this._options.lineOpacity
                });
            }
        }
    }

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