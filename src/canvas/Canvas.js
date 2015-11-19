/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link Canvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/Canvas 
 * @requires util
 * @requires geom/ViewBox
 * @requires geom/Rectangle
 * @requires geom/Point
 */

// Required modules.
var ViewBox     = require('../geom/ViewBox');
var Rectangle   = require('../geom/Rectangle');
var Point       = require('../geom/Point');
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
    this._viewPort      = new Rectangle();  // The rectangle defining the pixel coords.
    this._viewBox       = new ViewBox();    // The viewBox defining the data coords.
    this._isViewBoxSet  = false;            // Indicates if the viewBox has been set.

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

    // Public instance members.  

    /** 
     * The html element that represents the actual drawing canvas.
     * 
     * @since 0.1.0
     * @type HTMLElement
     * @default null
     */
    this.canvas = null;

    /** 
     * If set to <code>true</code> the viewBox is adjusted to maintain the aspect ratio.
     * If set to <code>false</code> the viewBox stretches to fill the viewPort.
     * 
     * @since 0.1.0
     * @type boolean
     * @default false
     */
    this.preserveAspectRatio = false;

    // TODO Do we need to add something here to handle no container?
    this._options = options !== undefined ? options : {};

    // Initialise.   
    this.init();

    // Append canvas to container and set its initial size.
    if (this._options.container)
    {
        // Append canvas to parent container.
        var container = this._options.container;
        container.appendChild(this.canvas);

        // Resize the canvas to fit its container and do same when the window resizes.
        this.setSize(container.offsetWidth, container.offsetHeight);
        var me = this;
        var resizeTimeout;
        window.addEventListener('resize', function (event)
        {
            // Add a resizeTimeout to stop multiple calls to setSize().
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function ()
            {        
                me.setSize(container.offsetWidth, container.offsetHeight);
            }, 250);
        });
    }

    // TODO Remove this.
    this.viewBox(0, 0, 100, 100);

    this.render();
}

/** 
 * Initialisation code.
 *
 * @since 0.1.0
 */
Canvas.prototype.init = function()
{

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
    return parseInt(this.canvas.getAttribute('width'));
};

/** 
 * Get the height of the canvas.
 *
 * @since 0.1.0
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
        this.canvas.setAttribute('width', w);
        this.canvas.setAttribute('height', h);

        // viewPort.
        var leftMargin = 40;
        var rightMargin = 40;
        var topMargin = 40;
        var bottomMargin = 40;
        var x = leftMargin;
        var y = topMargin;
        var width = w - (leftMargin + rightMargin);
        var height = h - (topMargin + bottomMargin);
        this.viewPort(x, y, width, height);

        // Match the viewBox to the viewPort if it hasnt been set using viewBox().
        if (this._isViewBoxSet === false)  this._viewBox.setCoords(0, 0, width, height);

        this.render();
    }
};

/** 
 * A rectangle that defines the drawing area (in pixels) within the canvas.
 *
 * @param {number} [x = 0] The x coord of the top left corner.
 * @param {number} [y = 0] The y coord of the top left corner.
 * @param {number} [width = 100] The width.
 * @param {number} [height = 100] The height.
 * @return {Rectangle|Canvas} A Rectangle that defineds the viewPort if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.viewPort = function (x, y, width, height)
{
    if (arguments.length > 0)
    {
        this._viewPort.setDimensions(x, y, width, height);
        if (this.preserveAspectRatio) this.fitViewBoxToViewPort(this._viewBox, this._viewPort);
        return this;
    }
    else return this._viewPort;
};

/** 
 * The value of the viewBox specifies a rectangle in user space which is mapped to the bounds of the canvas. 
 * The viewBox has its origin at the bottom left corner of the canvas with the 
 * positive x-axis pointing towards the right, the positive y-axis pointing up.
 *
 * @param {number} [xMin = 0] The x coord of the bottom left corner.
 * @param {number} [yMin = 0] The y coord of the bottom left corner.
 * @param {number} [xMax = 100] The x coord of the top right corner.
 * @param {number} [yMax = 100] The y coord of the top right corner.
 * @return {ViewBox|Canvas} The ViewBox if no arguments are supplied, otherwise <code>this</code>.
 */
Canvas.prototype.viewBox = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        this._isViewBoxSet = true;
        this._viewBox.setCoords(xMin, yMin, xMax, yMax);
        if (this.preserveAspectRatio) this.fitViewBoxToViewPort(this._viewBox, this._viewPort);
        return this;
    }
    else return this._viewBox;
};

// Styling.

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

// Drawing.

/** 
 * Renders the graphics.
 *
 * @since 0.1.0
 */
Canvas.prototype.render = function()
{
    // TODO For svg we dont want to clear - just change attributes of current dom.
    this.clear();
    this.rect(0, 0, 50, 50).fillColor('#00f500').lineWidth(15).fill().stroke();
    this.ellipse(10, 10, 80, 50).fillColor('#f50000').lineWidth(15).fillOpacity(0.7).fill().stroke();
    this.circle(50, 50, 50).fillColor('#0000f5').fill().stroke({width:12});
    this.polygon([50, 0, 100, 0, 100, 50]).fillColor('#0ff0f5').fill().stroke();
};

/** 
 * Clear the canvas.
 *
 * @since 0.1.0
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.clear = function ()
{
    return this;
};

/** 
 * Provides the fill drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.drawFill = function ()
{
    return this;
};

/** 
 * Provides the stroke drawing routine for the graphics library being used.
 *
 * @since 0.1.0
 * @return {Canvas} <code>this</code>.
 */
Canvas.prototype.drawStroke = function ()
{
    return this;
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

// TODO Event handlers.
Canvas.prototype.on = function (strEvents, fncHandler)
{
    return this;
};

// Mapping data coords to pixel coords in order to mimic SVG viewBox functionality.

/** 
 * Converts a point from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {Point} dataPoint A point (data units).
 * @return {Point} A point (pixel units).
 */
Canvas.prototype.getPixelPoint = function (dataPoint)
{
    var x = this.getPixelX(dataPoint.x());
    var y = this.getPixelY(dataPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a bounding box (data units) to a rectangle (pixel units).
 * 
 * @since 0.1.0
 * @param {ViewBox} viewBox A bounding box (data units).
 * @return {Rectangle} A rectangle (pixel units).
 */
Canvas.prototype.getPixelRect = function (viewBox)
{
    var x = this.getPixelX(viewBox.xMin());
    var y = this.getPixelY(viewBox.yMax());
    var w = this.getPixelWidth(viewBox.width());
    var h = this.getPixelHeight(viewBox.height());
    return new Rectangle(x, y, w, h);
};

/** 
 * Converts an x coord from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {number} dataX An x coord (data units).
 * @return {number} The x coord (pixel units).
 */
Canvas.prototype.getPixelX = function (dataX)
{
    //<validation>
    if (!isNumber(dataX)) throw new Error('HtmlCanvas.getPixelX(dataX): dataX must be a number.');
    //</validation>
    var px = this._viewPort.x() + this.getPixelWidth(dataX - this._viewBox.xMin());
    return px;
};

/** 
 * Converts a y coord from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {number} dataY A y coord (data units).
 * @return {number} The y coord (pixel units).
 */
Canvas.prototype.getPixelY = function (dataY)
{
    //<validation>
    if (!isNumber(dataY)) throw new Error('HtmlCanvas.getPixelY(dataY): dataY must be a number.');
    //</validation>
    var py =  this._viewPort.y() + this._viewPort.height() - this.getPixelHeight(dataY - this._viewBox.yMin());
    return py;
};

/** 
 * Converts a width from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {number} dataWidth A width (data units).
 * @return {number} The width (pixel units).
 */
Canvas.prototype.getPixelWidth = function (dataWidth)
{
    //<validation>
    if (!isNumber(dataWidth)) throw new Error('HtmlCanvas.getPixelWidth(dataHeight): dataWidth must be a number.');
    if (dataWidth < 0)        throw new Error('HtmlCanvas.getPixelWidth(dataHeight): dataWidth must be >= 0.');
    //</validation>
    if (dataWidth === 0) return 0;
    var pixelDistance  = (dataWidth / this._viewBox.width()) * this._viewPort.width();
    return pixelDistance;
};

/** 
 * Converts a height from data units to pixel units.
 * 
 * @since 0.1.0
 * @param {number} dataHeight A height (data units).
 * @return {number} The height (pixel units).
 */
Canvas.prototype.getPixelHeight = function (dataHeight)
{
    //<validation>
    if (!isNumber(dataHeight)) throw new Error('HtmlCanvas.getPixelHeight(dataHeight): dataHeight must be a number.');
    if (dataHeight < 0)        throw new Error('HtmlCanvas.getPixelHeight(dataHeight): dataHeight must be >= 0.');
    //</validation>
    if (dataHeight === 0) return 0;
    var pixelDistance = (dataHeight / this._viewBox.height()) * this._viewPort.height();
    return pixelDistance;
};

/** 
 * Converts a point from pixel units to data units.
 * 
 * @param {Point} pixelPoint A point (pixel units).
 * @return {Point} A point (data units).
 */
Canvas.prototype.getDataPoint = function (pixelPoint)
{
    var x = this.getDataX(pixelPoint.x());
    var y = this.getDataY(pixelPoint.y());
    return new Point(x, y);
};

/** 
 * Converts a rectangle (pixel units) to a viewBox (data units).
 * 
 * @param {Rectangle} pixelCoords A rectangle (pixel units).
 * @return {ViewBox} A viewBox (data units).
 */
Canvas.prototype.getDataCoords = function (pixelCoords)
{
    var xMin = this.getDataX(pixelCoords.x());
    var yMax = this.getDataY(pixelCoords.y());
    var xMax = xMin + this.getDataWidth(pixelCoords.width());
    var yMin = yMax - this.getPDataHeight(pixelCoords.height());
    return new ViewBox(xMin, yMin, xMax, yMax);
};

/** 
 * Converts an x coord from pixel units to data units.
 * 
 * @param {number} pixelX An x coord (pixel units).
 * @return {number} An x coord (data units).
 */
Canvas.prototype.getDataX = function (pixelX)
{
    //<validation>
    if (!isNumber(pixelX)) throw new Error('Canvas.getDataX(pixelX): pixelX must be a number.');
    //</validation>
    var dataX = this._viewBox.xMin() + this.getDataWidth(pixelX);
    return dataX;
};

/** 
 * Converts a y coord from pixel units to data units.
 * 
 * @param {number} pixelY A y coord (pixel units).
 * @return {number} A y coord (data units).
 */
Canvas.prototype.getDataY = function (pixelY)
{
    //<validation>
    if (!isNumber(pixelY)) throw new Error('Canvas.getDataY(pixelY): pixelY must be a number.');
    //</validation>
    var dataY = this._viewBox.yMin() + this.getDataHeight(this._viewPort.height() - pixelY);
    return dataY;
};

/** 
 * Converts a width from pixel units to data units.
 * 
 * @param {number} pixelWidth A width (pixel units).
 * @return {number} A width (data units).
 */
Canvas.prototype.getDataWidth = function (pixelWidth)
{
    //<validation>
    if (!isNumber(pixelWidth)) throw new Error('Canvas.getDataWidth(pixelWidth): pixelWidth must be a number.');
    if (pixelWidth < 0)        throw new Error('Canvas.getDataWidth(pixelWidth): pixelWidth must be >= 0.');
    //</validation>
    if (pixelWidth === 0) return 0;
    var dataDistance = (pixelWidth / this._viewPort.width()) * this._viewBox.width();
    return dataDistance;
};

/** 
 * Converts a height from pixel units to data units.
 * 
 * @param {number} pixelHeight A height (pixel units).
 * @return {number} A height (data units).
 */
Canvas.prototype.getDataHeight = function (pixelHeight)
{
    //<validation>
    if (!isNumber(pixelHeight)) throw new Error('Canvas.getDataHeight(pixelHeight): pixelHeight must be a number.');
    if (pixelHeight < 0)        throw new Error('Canvas.getDataHeight(pixelHeight): pixelHeight must be >= 0.');
    //</validation>
    if (pixelHeight === 0) return 0;
    var dataDistance = (pixelHeight / this._viewPort.height()) * this._viewBox.height();
    return dataDistance;
};

/** 
 * Adjusts a bounding box to fit a rectangle in order to maintain the aspect ratio.
 *
 * @private
 * @param {ViewBox} viewBox The bounding box.
 * @param {Rectangle} rect The rectangle.
 */
Canvas.prototype.fitViewBoxToViewPort = function (viewBox, rect)
{
    var sy = viewBox.height() / rect.height();
    var sx = viewBox.height() / rect.width();

    var sBBoxX, sBBoxY, sBBoxW, sBBoxH; 

    if (sy > sx)
    {
        sBBoxY = viewBox.yMin();
        sBBoxH = viewBox.height();
        sBBoxW = (rect.width() / rect.height()) * sBBoxH;
        sBBoxX = viewBox.xMin() - ((sBBoxW - viewBox.width()) / 2);
    }
    else if (sx > sy)
    {
        sBBoxX = viewBox.xMin();
        sBBoxW = viewBox.width();
        sBBoxH = (rect.height() / rect.width()) * sBBoxW;
        sBBoxY = viewBox.yMin() - ((sBBoxH - viewBox.height()) / 2);
    }
    else
    {
        sBBoxX = viewBox.xMin();
        sBBoxY = viewBox.yMin();
        sBBoxW = viewBox.width();
        sBBoxH = viewBox.height();
    }

    viewBox.xMin(sBBoxX).yMin(sBBoxY).width(sBBoxW).height(sBBoxH);
};

module.exports = Canvas;