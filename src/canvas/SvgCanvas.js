/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link SvgCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module canvas/SvgCanvas 
 * @requires canvas/Canvas
 * @requires utils/util
 * @requires utils/dom
 */

// Required modules.
var Canvas              = require('./Canvas');
var util                = require('../utils/util');
var extendClass         = util.extendClass;
var dom                 = require('../utils/dom');
var createSvgElement    = dom.createSvgElement;
var attr                = dom.attr;

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
    this.graphics       = createSvgElement('g');    // The group element container.
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
    this.items = [];
    while (this.graphics.firstChild) 
    {
        this.graphics.removeChild(this.graphics.firstChild);
    }
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawFill = function ()
{
    attr(this.items[this.items.length-1], 
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
    attr(this.items[this.items.length-1], 
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
    var svgCircle = createSvgElement('circle', {'cx':cx, 'cy':cy, 'r':r});
    this.addElement(svgCircle);
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawEllipse = function (x, y, w, h)
{
    var rx = w / 2, ry = h / 2, cx = x + rx , cy = y + ry;
    var svgEllipse = createSvgElement('ellipse', {'cx':cx, 'cy':cy, 'rx':rx, 'ry': ry});
    this.addElement(svgEllipse);
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawRect = function (x, y, w, h)
{
    var svgRect = createSvgElement('rect', {'x':x, 'y':y, 'width':w, 'height':h});
    this.addElement(svgRect);
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawLine = function (x1, y1, x2, y2)
{
    var svgLine = createSvgElement('line', {'x1':x1, 'y1':y1, 'x2':x2, 'y2':y2});
    this.addElement(svgLine);
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawPolyline = function (arrCoords)
{
    var svgPolyline = createSvgElement('polyline', {'points' : getCoordsAsString(arrCoords)});
    this.addElement(svgPolyline);
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawPolygon = function (arrCoords)
{
    var svgPolygon = createSvgElement('polygon', {'points' : getCoordsAsString(arrCoords)});
    this.addElement(svgPolygon);
    return this;
};

/** 
 * Adds an svg element to the canvas.
 * 
 * @since 0.1.0
 * @param {SVGElement} svgElement The element to add.
 */
SvgCanvas.prototype.addElement = function (svgElement)
{
    this.graphics.appendChild(svgElement);
    this.items.push(svgElement);
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] 
 * to a comma separated string of coords 'x1 y1, x2 y2, x3 y3, x4 y4, ...'.
 * 
 * @since 0.1.0
 * @param {number[]} arrCoords The list of coords.
 * @return {string} A string containing the list of coords.
 */
function getCoordsAsString (arrCoords)
{
    var n = arrCoords.length;
    var strPoints = '';
    for (var i = 0; i < n; i+=2)
    {
        if (i !== 0) strPoints += ',';
        strPoints += '' + arrCoords[i] + ' ' + arrCoords[i+1];
    }
    return strPoints;
}

module.exports = SvgCanvas;