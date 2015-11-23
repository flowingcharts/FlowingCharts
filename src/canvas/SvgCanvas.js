/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link SvgCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/SvgCanvas 
 * @requires canvas/Canvas
 * @requires util
 */

// Required modules.
var Canvas      = require('./Canvas');
var util        = require('../util');
var extendClass = util.extendClass;

/** 
 * @classdesc A wrapper class for rendering to an SVG canvas.
 *
 * @class
 * @alias SvgCanvas
 * @augments Canvas
 * @since 0.1.0
 * @author J Clare
 *
 * @param {CartesianCoords|PolarCoords} coords The coordinate system to use when drawing. 
 */
function SvgCanvas (coords)
{
    SvgCanvas.baseConstructor.call(this, coords);
}
extendClass(Canvas, SvgCanvas);

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.init = function()
{
    this._svgNS         = 'http://www.w3.org/2000/svg'; // Namespace for SVG elements.
    this._svgElement    = null;                         // The svg element that is part of the current drawing routine.
    this.canvas         = this.createElement('svg');    // The main svg element.
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.isSupported = function ()
{
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.clear = function ()
{
    while (this.canvas.firstChild) 
    {
        this.canvas.removeChild(this.canvas.firstChild);
    }
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawFill = function ()
{
    this.attr(this._svgElement, 
    {
        'fill'            : this.fillColor(),
        'fill-opacity'    : this.fillOpacity()
    });
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawStroke = function ()
{
    this.attr(this._svgElement, 
    {
        'stroke'            : this.lineColor(),
        'stroke-width'      : this.lineWidth(),
        'stroke-linejoin'   : this.lineJoin(),
        'stroke-linecap'    : this.lineCap(),
        'stroke-opacity'    : this.lineOpacity()
    });
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawCircle = function (cx, cy, r)
{
    var svgCircle = this.createElement('circle', {'cx':cx, 'cy':cy, 'r':r});
    this.canvas.appendChild(svgCircle);
    this._svgElement = svgCircle;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawEllipse = function (x, y, w, h)
{
    var rx = w / 2, ry = h / 2, cx = x + rx , cy = y + ry;
    var svgEllipse = this.createElement('ellipse', {'cx':cx, 'cy':cy, 'rx':rx, 'ry': ry});
    this.canvas.appendChild(svgEllipse);
    this._svgElement = svgEllipse;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawRect = function (x, y, w, h)
{
    var svgRect = this.createElement('rect', {'x':x, 'y':y, 'width':w, 'height':h});
    this.canvas.appendChild(svgRect);
    this._svgElement = svgRect;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawLine = function (x1, y1, x2, y2)
{
    var svgLine = this.createElement('line', {'x1':x1, 'y1':y1, 'x2':x2, 'y2':y2});
    this.canvas.appendChild(svgLine);
    this._svgElement = svgLine;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawPolyline = function (arrCoords)
{
    var svgPolyline = this.createElement('polyline', {'points' : this.getCoordsAsString(arrCoords)});
    this.canvas.appendChild(svgPolyline);
    this._svgElement = svgPolyline;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawPolygon = function (arrCoords)
{
    var svgPolygon = this.createElement('polygon', {'points' : this.getCoordsAsString(arrCoords)});
    this.canvas.appendChild(svgPolygon);
    this._svgElement = svgPolygon;
    return this;
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] 
 * to a comma separated string of coords 'x1 y1, x2 y2, x3 y3, x4 y4, ...'.
 * 
 * @since 0.1.0
 * @param {number[]} arrCoords The list of coords.
 * @return {string} A string containing the list of coords.
 */
SvgCanvas.prototype.getCoordsAsString = function (arrCoords)
{
    var n = arrCoords.length;
    var strPoints = '';
    for (var i = 0; i < n; i+=2)
    {
        if (i !== 0) strPoints += ',';
        strPoints += '' + arrCoords[i] + ' ' + arrCoords[i+1];
    }
    return strPoints;
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
    this.attr(svgElement, attr);
    return svgElement;
};

/** 
 * Sets the attributes for the given svg element.
 * 
 * @since 0.1.0
 * @param {SVGElement} svgElement The svg element.
 * @return {attr} attr The list of attributes.
 */
SvgCanvas.prototype.attr = function (svgElement, attr)
{
    for (var property in attr) 
    {
        if (attr.hasOwnProperty(property))  
        {
            svgElement.setAttribute(property, attr[property]);
        }
    }
};

module.exports = SvgCanvas;