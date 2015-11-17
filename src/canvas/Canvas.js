/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Canvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/Canvas 
 * @requires util
 */

// Required modules.
var util        = require('../util');
var isColor     = util.isColor;
var isNumber    = util.isNumber;

/** 
 * @classdesc A base wrapper class for graphics libraries.
 *
 * @class
 * @alias Canvas
 * @since 0.1.0
 * @constructor
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 */
function Canvas (options)
{
    // Private instance members.
    // Default styles.
    this._defaultFillColor       = '#ffffff'; 
    this._defaultFillOpacity     = 1;
    this._defaultLineColor       = '#000000'; 
    this._defaultLineWidth       = 1; 
    this._defaultLineJoin        = 'round';
    this._defaultLineCap         = 'butt';
    this._defaultLineOpacity     = 1;

    // Current styles override default styles.
    this._fillColor             = '#ffffff'; 
    this._fillOpacity           = 1;
    this._lineColor             = '#000000';  
    this._lineWidth             = 1; 
    this._lineJoin              = 'round'; 
    this._lineCap               = 'butt'; 
    this._lineOpacity           = 1; 

    // TODO Do we need to add something here to handle no container?
    this._options = options !== undefined ? options : {};

    // Append canvas to container and set its initial size.
    if (this._options.container)
    {
        var canvasElement = this.canvasElement();
        var container = this._options.container;
        container.appendChild(canvasElement);

        // Resize the canvas to fit its container (dont use setSize here).
        canvasElement.setAttribute('width', container.offsetWidth);
        canvasElement.setAttribute('height', container.offsetHeight);

        // Resize the canvas to fit its container when the window resizes.
        var me = this;
        var resizeTimeout;
        window.addEventListener('resize', function (event)
        {
            // Add a resizeTimeout to stop multiple calls.
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function ()
            {        
                me.setSize(container.offsetWidth, container.offsetHeight);
            }, 100);
        });
    }
}

/** 
 * @callback Canvas~onResize
 * @param {number} w The width of the canvas.
 * @param {number} h The height of the canvas.
 */

/** 
 * Subclasses should override this function and the html element that provides the canvas.
 *
 * @since 0.1.0
 * @return {HTMLElement} The canvas.
 */
Canvas.prototype.canvasElement = function ()
{
    return null;
};

/** 
 * Subclasses should override this function and clear the canvas.
 *
 * @since 0.1.0
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.clear = function ()
{
    return this;
};

/** 
 * Subclasses should override this function and provide the fill drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.drawFill = function ()
{
    return this;
};

/** 
 * Subclasses should override this function and provide the stroke drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.drawStroke = function ()
{
    return this;
};

/** 
 * Get the width of the canvas.
 *
 * @since 0.1.0
 * @return {number} The width.
 */
Canvas.prototype.width = function ()
{
    return parseInt(this.canvasElement().getAttribute('width'));
};

/** 
 * Get the height of the canvas.
 *
 * @since 0.1.0
 * @return {number} The height.
 */
Canvas.prototype.height = function ()
{
    return parseInt(this.canvasElement().getAttribute('height'));
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
        var canvasElement = this.canvasElement();
        canvasElement.setAttribute('width', w);
        canvasElement.setAttribute('height', h);
        this.onResize(w, h);
    }
};

/** 
 * Called after the canvas is resized.
 *
 * @since 0.1.0
 * @param {number} w The width.
 * @param {number} h The height.
 */
Canvas.prototype.onResize = function (w, h)
{

};

/** 
 * Defines the default stroke style. This can be overridden on a shape by 
 * shape basis by calling [fillColor()]{@link Canvas#fillColor} or [fillOpacity()]{@link Canvas#fillOpacity}.  
 *
 * @since 0.1.0
 * @param {Object} [options] The fill properties.
 * @param {string} [options.color] The fill color.
 * @param {number} [options.opacity] The fill opacity.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.fillStyle = function (options)
{
    if (options !== undefined) 
    {
        if (options.color !== undefined)    this._defaultFillColor     = options.color;
        if (options.opacity !== undefined)  this._defaultFillOpacity   = options.opacity;
    }
    return this;
};

/** 
 * Draws a shape by filling its content area. 
 * Style precedence works in the following order:
 * > default styles specified by fillStyle() 
 * > styles specified by methods eg fillColor() 
 * > styles specified in the options param 
 *
 * @since 0.1.0
 * @param {Object} [options] The fill properties.
 * @param {string} [options.color] The fill color.
 * @param {number} [options.opacity] The fill opacity.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.fill = function (options)
{
    if (options !== undefined) 
    {
        if (options.color !== undefined)    this.fillColor(options.color);
        if (options.opacity !== undefined)  this.fillOpacity(options.opacity);
    }

    // Call subclass fill routine.
    this.drawFill();

    // Reset to default stroke styles after fill() has completed.
    this.fillColor(this._defaultFillColor).fillOpacity(this._defaultFillOpacity);
    return this;
};

/** 
 * Defines the default fill style. This can be overridden on a shape by 
 * shape basis by calling {@link lineColor()}, {@link lineWidth()}, 
 * {@link lineJoin()}, {@link lineCap()} or {@link lineOpacity()}.  
 *
 * @since 0.1.0
 * @param {Object} [options] The stroke properties.
 * @param {string} [options.color] The line color.
 * @param {number} [options.width] The line width.
 * @param {string} [options.join] The line join.
 * @param {string} [options.cap] The line cap.
 * @param {number} [options.opacity] The fill opacity.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.strokeStyle = function (options)
{
    if (arguments.length > 0)
    {
        if (options.color !== undefined)    this._defaultLineColor     = options.color;
        if (options.width !== undefined)    this._defaultLineWidth     = options.width;
        if (options.join !== undefined)     this._defaultLineJoin      = options.join;
        if (options.cap !== undefined)      this._defaultLineCap       = options.cap;
        if (options.opacity !== undefined)  this._defaultLineOpacity   = options.opacity;
    }
    return this;
};

/** 
 * Draws a shape by stroking its outline.
 * Style precedence works in the following order:
 * default styles specified by strokeStyle() 
 * > styles specified by methods eg strokeColor() 
 * > styles specified in the options param 
 *
 * @since 0.1.0
 * @param {Object} [options] The stroke properties.
 * @param {string} [options.color] The line color.
 * @param {number} [options.width] The line width.
 * @param {string} [options.join] The line join.
 * @param {string} [options.cap] The line cap.
 * @param {number} [options.opacity] The fill opacity.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.stroke = function (options)
{
    // Style precedence works in the following order:
    // default styles > method styles > option styles
    if (options !== undefined) 
    {
        if (options.color !== undefined)    this.lineColor(options.color);
        if (options.width !== undefined)    this.lineWidth(options.width);
        if (options.join !== undefined)     this.lineJoin(options.join);
        if (options.cap !== undefined)      this.lineCap(options.cap);
        if (options.opacity !== undefined)  this.lineOpacity(options.opacity);
    }

    // Call subclass stroke routine.
    this.drawStroke();

    // Reset to default stroke styles after stroke() has completed.
    this.lineColor(this._defaultLineColor)
        .lineWidth(this._defaultLineWidth)
        .lineJoin(this._defaultLineJoin)
        .lineCap(this._defaultLineCap)
        .lineOpacity(this._defaultLineOpacity);

    return this;
};

/** 
 * Get or set the fill color.
 *
 * @since 0.1.0

 * @param {string} color The fill color.
 * @return {string|Canvas} The fill color if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.fillColor = function (color)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isColor(color)) throw new Error('Canvas.fillColor(color): color must be a color.');
        //</validation>

        this._fillColor = color;
        return this;
    }
    else return this._fillColor;
};

/** 
 * Get or set the fill opacity.
 *
 * @since 0.1.0

 * @param {string} opacity The fill opacity.
 * @return {number|Canvas} The fill opacity if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.fillOpacity = function (opacity)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(opacity)) throw new Error('Canvas.fillOpacity(opacity): opacity must be a number.');
        //</validation>

        opacity = Math.max(0, opacity);
        opacity = Math.min(1, opacity);

        this._fillOpacity = opacity;
        return this;
    }
    else return this._fillOpacity;
};

/** 
 * Get or set the line color.
 *
 * @since 0.1.0
 * @param {string} color The line color.
 * @return {string|Canvas} The line color if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineColor = function (color)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isColor(color)) throw new Error('Canvas.lineColor(color): color must be a color.');
        //</validation>

        this._lineColor = color;
        return this;
    }
    else return this._lineColor;
};

/** 
 * Get or set the line width.
 *
 * @since 0.1.0
 * @param {number} width The line width.
 * @return {number|Canvas} The line width if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineWidth = function (width)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(width)) throw new Error('Canvas.lineWidth(width): width must be a number.');
        if (width < 0)        throw new Error('Canvas.lineWidth(width): width must be >= 0.');
        //</validation>

        this._lineWidth = width;
        return this;
    }
    else return this._lineWidth;
};

/** 
 * Get or set the line join.
 *
 * @since 0.1.0
 * @param {string} join The line join, one of "bevel", "round", "miter".
 * @return {string|Canvas} The line join if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineJoin = function (join)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (join !== "bevel" && join !== "round" && join !== "miter")
             throw new Error('Canvas.lineJoin(join): join must one of "bevel", "round", "miter"');
        //</validation>
      
        this._lineJoin = join;
        return this;
    }
    else return this._lineJoin;
};

/** 
 * Get or set the line cap.
 *
 * @since 0.1.0
 * @param {string} cap The line cap, one of "butt", "round", "square".
 * @return {string|Canvas} The line cap if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineCap = function (cap)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (cap !== "butt" && cap !== "round" && cap !== "square")
             throw new Error('Canvas.lineCap(cap): cap must one of "butt", "round", "square"');
        //</validation>

        this._lineCap = cap;
        return this;
    }
    else return this._lineCap;
};

/** 
 * Get or set the line opacity.
 *
 * @since 0.1.0
 * @param {string} opacity A value between 0 and 1.
 * @return {number|Canvas} The line opacity if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.lineOpacity = function (opacity)
{
    if (arguments.length > 0)
    {
        //<validation>
        if (!isNumber(opacity)) throw new Error('Canvas.lineOpacity(opacity): opacity must be a number.');
        //</validation>

        this._lineOpacity = opacity;
        return this;
    }
    else return this._lineOpacity;
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 * @param {number} cx The x position of the centre of the circle.
 * @param {number} cy The y position of the centre of the circle.
 * @param {number} r The circle radius.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.circle = function (cx, cy, r)
{
    return this;
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.ellipse = function (x, y, w, h)
{
    return this;
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y coord of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.rect = function (x, y, w, h)
{
    return this;
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 * @param {number} x1 The x position of point 1.
 * @param {number} y1 The y position of point 1.
 * @param {number} x2 The x position of point 2.
 * @param {number} y2 The y position of point 2.
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.line = function (x1, y1, x2, y2)
{
    return this;
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.polyline = function (arrCoords)
{
    return this;
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.polygon = function (arrCoords)
{
    return this;
};


module.exports = Canvas;