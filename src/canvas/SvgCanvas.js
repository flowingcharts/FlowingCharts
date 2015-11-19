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
    this._viewPort      = new Rectangle();                              // The rectangle defining the pixel coords.
    this._viewBox       = new ViewBox();                                // The viewBox defining the data coords.

    this._svgNS         = 'http://www.w3.org/2000/svg';                 // Namespace for SVG elements.
    this._svgElement    = null;                                         // The svg element that is part of the current drawing routine.
    this._svg           = document.createElementNS(this._svgNS, 'svg'); // The parent svg element.
    this._svg.setAttribute('preserveAspectRatio', 'none');



        
    this._svgMarkers    = document.createElementNS(this._svgNS, 'svg'); // Svg element for drawing markers.
    this._svgMarkers.setAttribute('preserveAspectRatio', 'none');
    this._svgMarkers.setAttribute('width', this._viewBox.width());
    this._svgMarkers.setAttribute('height', this._viewBox.height());
    this._svg.appendChild(this._svgMarkers);

    this._g = document.createElementNS(this._svgNS, 'g');
    this._svg.appendChild(this._g);                                     // Svg element used for grouping.





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
            }, 100);
        });
    }

    // Flip the y axis.
    //this._svg.setAttribute('transform', 'scale(1,-1)');
    this._viewPort.setDimensions(0, 0, this.width(), this.height());
    //this._viewBox.setCoords(0, 0, this.width(), this.height());
    this.viewBox(0, 0, 100, 100);



    this.render();
}
extendClass(Canvas, SvgCanvas);

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.canvasElement = function ()
{
    return this._svg;
};

// Geometry.

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.viewBox = function (xMin, yMin, xMax, yMax)
{
    if (arguments.length > 0)
    {
        this._viewBox.setCoords(xMin, yMin, xMax, yMax);
        this._svg.setAttribute('viewBox', xMin + ' ' + xMin + ' ' + this._viewBox.width() + ' ' + this._viewBox.height());
        this._svgMarkers.setAttribute('width', this._viewBox.width());
        this._svgMarkers.setAttribute('height', this._viewBox.height());
        return this;
    }
    else return this._viewBox;
};

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
        this._svg.setAttribute('width', w);
        this._svg.setAttribute('height', h);
        this._viewPort.setDimensions(0, 0, w, h);
        this._svgMarkers.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        if (this._viewBoxIsSet === false) this._viewBox.setCoords(0, 0, w, h);
    }
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

    var svgCircle = document.createElementNS(this._svgNS, 'circle');
    svgCircle.setAttribute('cx', cx);
    svgCircle.setAttribute('cy', cy);
    svgCircle.setAttribute('r', r);
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
    var svgEllipse = document.createElementNS(this._svgNS, 'ellipse');
    svgEllipse.setAttribute('cx', cx);
    svgEllipse.setAttribute('cy', cy);
    svgEllipse.setAttribute('rx', rx);
    svgEllipse.setAttribute('ry', ry);
    this._svg.appendChild(svgEllipse);
    this._svgElement = svgEllipse;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.rect = function (x, y, w, h)
{
    y = this._invertY(y) - h;

    var svgRect = document.createElementNS(this._svgNS, 'rect');
    svgRect.setAttribute('x', x);
    svgRect.setAttribute('y', y);
    svgRect.setAttribute('width', w);
    svgRect.setAttribute('height', h);
    this._svg.appendChild(svgRect);
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

    var svgLine = document.createElementNS(this._svgNS, 'line');
    svgLine.setAttribute('x1', x1);
    svgLine.setAttribute('y1', y1);
    svgLine.setAttribute('x2', x2);
    svgLine.setAttribute('y2', y2);
    this._svg.appendChild(svgLine);
    this._svgElement = svgLine;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.polyline = function (arrCoords)
{
    var svgPolyline = document.createElementNS(this._svgNS, 'polyline');
    svgPolyline.setAttribute('points', this._getPointsAsString(arrCoords));
    this._svg.appendChild(svgPolyline);
    this._svgElement = svgPolyline;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.polygon = function (arrCoords)
{
    var svgPolygon = document.createElementNS(this._svgNS, 'polygon');
    svgPolygon.setAttribute('points', this._getPointsAsString(arrCoords));
    this._svg.appendChild(svgPolygon);
    this._svgElement = svgPolygon;
    return this;
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] 
 * to a comma separated string of coords 'x1 y1, x2 y2, x3 y3, x4 y4, ...'.
 * 
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
 * @private
 * @param {number} y A y coord (data units).
 * @return {number} The flipped y coord.
 */
SvgCanvas.prototype._invertY = function (y)
{
    //<validation>
    if (!isNumber(y)) throw new Error('SvgCanvas._getPixelY(y): y must be a number.');
    //</validation>
    var yInverted =  this._viewBox.yMax() - (y - this._viewBox.yMin());
    return yInverted;
};

module.exports = SvgCanvas;