/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link SvgCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/SvgCanvas 
 * @requires geom/ViewBox
 * @requires geom/Rectangle
 * @requires renderers/Canvas
 * @requires util
 */

// Required modules.
var Canvas      = require('./Canvas');
var ViewBox     = require('../geom/ViewBox');
var Rectangle   = require('../geom/Rectangle');
var util        = require('../util');
var extendClass = util.extendClass;
var isNumber    = util.isNumber;

/** 
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @class
 * @alias SvgCanvas
 * @augments Canvas
 * @since 0.1.0
 * @author J Clare
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 */
function SvgCanvas (options)
{
    SvgCanvas.baseConstructor.call(this, options);

    // Private instance members.
    this._viewPort      = new Rectangle();              // The rectangle defining the pixel coords.
    this._viewBox       = new ViewBox();                // The viewBox defining the data coords.

    this._svgNS         = 'http://www.w3.org/2000/svg'; // Namespace for SVG elements.
    this._svgElement    = null;                         // The svg element that is part of the current drawing routine.
   
    this._svg = this.createElement('svg');              // The main svg element.

    this._svgShapes = this.createElement('svg',         // Svg element for holding shapes.
    {
        'preserveAspectRatio'   : 'none'
    });
    this._svg.appendChild(this._svgShapes);
        
    this._svgMarkers = this.createElement('svg',        // Svg element for holding markers.
    {
        'preserveAspectRatio'   : 'xMidYMid meet'
    });
    this._svg.appendChild(this._svgMarkers);

    // Append canvas to container and set its initial size.
    if (this._options.container)
    {
        var container = this._options.container;
        container.appendChild(this._svg);

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
            }, 0);
        });
    }

    this.viewBox(0, 0, 100, 100);

    this.render();
}
extendClass(Canvas, SvgCanvas);

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.render = function()
{
    this.rect(0, 0, 50, 50).fillColor('#00f500').lineWidth(15).fill().stroke();
    this.ellipse(10, 10, 50, 50).fillColor('#f50000').lineWidth(15).fillOpacity(0.7).fill().stroke();
    this.circle(50, 50, 25).fillColor('#0000f5').fill().stroke({width:12});
    this.polygon([50, 0, 100, 0, 100, 50]).fillColor('#0ff0f5').fill().stroke();
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.canvasElement = function ()
{
    return this._svg;
};

// Geometry.

/** 
 * Get the width of the canvas.
 *
 * @since 0.1.0
 * @return {number} The width.
 */
SvgCanvas.prototype.width = function ()
{
    return parseInt(this._svg.getAttribute('width'));
};

/** 
 * Get the height of the canvas.
 *
 * @since 0.1.0
 * @return {number} The height.
 */
SvgCanvas.prototype.height = function ()
{
    return parseInt(this._svg.getAttribute('height'));
};

/** 
 * Set the size of the canvas.
 *
 * @since 0.1.0
 * @param {number} w The width.
 * @param {number} h The height.
 */
SvgCanvas.prototype.setSize = function (w, h)
{
    //<validation>
    if (!isNumber(w)) throw new Error('Canvas.setSize(w): w must be a number.');
    if (w < 0)        throw new Error('Canvas.setSize(w): w must be >= 0.');
    if (!isNumber(h)) throw new Error('Canvas.setSize(h): h must be a number.');
    if (h < 0)        throw new Error('Canvas.setSize(h): h must be >= 0.');
    //</validation>

    if (w !== this.width() || h !== this.height())
    {
        // Size canvas.
        this._svg.setAttribute('width', w);
        this._svg.setAttribute('height', h);

        // viewPort.
        var leftMargin = 20;
        var rightMargin = 20;
        var topMargin = 20;
        var bottomMargin = 20;
        var x = leftMargin;
        var y = topMargin;
        var width = w - (leftMargin + rightMargin);
        var height = h - (topMargin + bottomMargin);
        this.viewPort(x, y, width, height);

        // viewBox.
        // Match the viewBox to the viewPort if it hasnt been specfically set using viewBox().
        if (this._isViewBoxSet === false) this._viewBox.setCoords(0, 0, w, h);
    }
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.viewPort = function (x, y, w, h)
{
    if (arguments.length > 0)
    {
        this._viewPort.setDimensions(x, y, w, h);

        this._svgShapes.setAttribute('x',       x);
        this._svgShapes.setAttribute('y',       y);
        this._svgShapes.setAttribute('width',   w);
        this._svgShapes.setAttribute('height',  h);

        this._svgMarkers.setAttribute('x',       x);
        this._svgMarkers.setAttribute('y',       y);
        this._svgMarkers.setAttribute('width',   w);
        this._svgMarkers.setAttribute('height',  h);

        //this._svgMarkers.setAttribute('viewBox', '0 0 ' + w + ' ' + h);


        return this;
    }
    else return this._viewPort;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.viewBox = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        this._viewBox.setCoords(xMin, yMin, xMax, yMax);

        this._svgShapes.setAttribute('viewBox', this._viewBox.xMin() + ' ' + this._viewBox.yMin()  + ' ' + this._viewBox.width() + ' ' + this._viewBox.height());
    
            this._svgMarkers.setAttribute('viewBox', this._viewBox.xMin() + ' ' + this._viewBox.yMin()  + ' ' + this._viewBox.width() + ' ' + this._viewBox.height());

        //this._svgMarkers.setAttribute('width',   this._viewBox.width());
       // this._svgMarkers.setAttribute('height',  this._viewBox.height());

        return this;
    }
    else return this._viewBox;
};

// Drawing.

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.clear = function ()
{
    while (this._svg.firstChild) 
    {
        this._svg.removeChild(this._svg.firstChild);
    }
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawFill = function ()
{
    this._svgElement.setAttribute('fill', this.fillColor());
    this._svgElement.setAttribute('fill-opacity', this.fillOpacity());
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawStroke = function ()
{
    this._svgElement.setAttribute('vector-effect','non-scaling-stroke'); // Preserve line width.
    this._svgElement.setAttribute('stroke', this.lineColor());
    this._svgElement.setAttribute('stroke-width', this.lineWidth());
    this._svgElement.setAttribute('stroke-linejoin', this.lineJoin());
    this._svgElement.setAttribute('stroke-linecap', this.lineCap());
    this._svgElement.setAttribute('stroke-opacity', this.lineOpacity());
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.circle = function (cx, cy, r)
{
    cy = this._invertY(cy);

    var svgCircle = this.createElement('circle',       
    {
        'cx'    : cx,
        'cy'    : cy,
        'r'     : r
    });

    this._svgMarkers.appendChild(svgCircle);
    this._svgElement = svgCircle;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.ellipse = function (x, y, w, h)
{
    y = this._invertY(y) - h;

    var rx = w / 2;
    var ry = h / 2;
    var cx = x + rx;
    var cy = y + ry;

    var svgEllipse = this.createElement('ellipse',       
    {
        'cx'    : cx,
        'cy'    : cy,
        'rx'    : rx,
        'ry'    : ry
    });

    this._svgShapes.appendChild(svgEllipse);
    this._svgElement = svgEllipse;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.rect = function (x, y, w, h)
{
    y = this._invertY(y) - h;

    var svgRect = this.createElement('rect',       
    {
        'x'         : x,
        'y'         : y,
        'width'     : w,
        'height'    : h
    });

    this._svgShapes.appendChild(svgRect);
    this._svgElement = svgRect;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.line = function (x1, y1, x2, y2)
{
    y1 = this._invertY(y1);
    y2 = this._invertY(y2);

    var svgLine = this.createElement('line',       
    {
        'x1' : x1,
        'y1' : y1,
        'x2' : x2,
        'y2' : y2
    });

    this._svgShapes.appendChild(svgLine);
    this._svgElement = svgLine;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.polyline = function (arrCoords)
{
    var svgPolyline = this.createElement('polyline',       
    {
        'points' : this._getPointsAsString(arrCoords)
    });

    this._svgShapes.appendChild(svgPolyline);
    this._svgElement = svgPolyline;

    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.polygon = function (arrCoords)
{
    var svgPolygon = this.createElement('polygon',       
    {
        'points' : this._getPointsAsString(arrCoords)
    });

    this._svgShapes.appendChild(svgPolygon);
    this._svgElement = svgPolygon;

    return this;
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] 
 * to a comma separated string of coords 'x1 y1, x2 y2, x3 y3, x4 y4, ...'.
 * 
 * @since 0.1.0
 * @private
 * @param {number[]} arrCoords The list of coords.
 * @return {string} A string containing the list of coords.
 */
SvgCanvas.prototype._getPointsAsString = function (arrCoords)
{
    var n = arrCoords.length;
    var strPoints = '';
    for (var i = 0; i < n; i+=2)
    {
        if (i !== 0) strPoints += ',';
        strPoints += '' + arrCoords[i] + ' ' + this._invertY(arrCoords[i+1]);
    }
    return strPoints;
};

/** 
 * Inverts a y coord.
 * 
 * @since 0.1.0
 * @private
 * @param {number} y A y coord (data units).
 * @return {number} The flipped y coord.
 */
SvgCanvas.prototype._invertY = function (y)
{
    //<validation>
    if (!isNumber(y)) throw new Error('SvgCanvas._invertY(y): y must be a number.');
    //</validation>
    var yInverted =  this._viewBox.yMax() - (y - this._viewBox.yMin());
    return yInverted;
};

/** 
 * Creates an element with the given attributes.
 * 
 * @since 0.1.0
 * @param {string} type The element type.
 * @return {attr} attr The list of attributes.
 */
SvgCanvas.prototype.createElement = function (type, attr)
{
    var svgElement = document.createElementNS(this._svgNS, type);

    for (var property in attr) 
    {
        if (attr.hasOwnProperty(property))  
        {
            svgElement.setAttribute(property, attr[property]);
        }
    }
    return svgElement;
};

module.exports = SvgCanvas;