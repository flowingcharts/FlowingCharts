/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link SvgCanvas} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/SvgCanvas 
 * @requires renderers/Canvas
 * @requires util
 */

// Required modules.
var Canvas      = require('./Canvas');
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
 * @param {Canvas~onResize} [options.onResize] Function called when the canvas resizes. 
 */
function SvgCanvas (options)
{
    // Private instance members.
    this._svgNS         = 'http://www.w3.org/2000/svg';                 // Namespace for SVG elements.
    this._svg           = document.createElementNS(this._svgNS, 'svg'); // The parent svg element.
    this._svgElement    = null;                                         // The svg element that is part of the current drawing routine.
    
    SvgCanvas.baseConstructor.call(this, options);
}
extendClass(Canvas, SvgCanvas);

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.canvasElement = function ()
{
    return this._svg;
};

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
    var svgCircle = document.createElementNS(this._svgNS, 'circle');
    svgCircle.setAttribute('cx', cx);
    svgCircle.setAttribute('cy', cy);
    svgCircle.setAttribute('r', r);
    this._svg.appendChild(svgCircle);
    this._svgElement = svgCircle;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.ellipse = function (cx, cy, rx, ry)
{
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
    var n = arrCoords.length;
    var strPoints = '';
    for (var i = 0; i < n - 1; i++)
    {
        if (i !== 0) strPoints += ',';
        strPoints += '' + arrCoords[i] + ' ' + arrCoords[i+1];
    }
    var svgPolyline = document.createElementNS(this._svgNS, 'polyline');
    svgPolyline.setAttribute('points', strPoints);
    this._svg.appendChild(svgPolyline);
    this._svgElement = svgPolyline;
    return this;
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.polygon = function (arrCoords)
{
    var n = arrCoords.length;
    var strPoints = '';
    for (var i = 0; i < n - 1; i++)
    {
        if (i !== 0) strPoints += ',';
        strPoints += '' + arrCoords[i] + ' ' + arrCoords[i+1];
    }
    var svgPolygon = document.createElementNS(this._svgNS, 'polygon');
    svgPolygon.setAttribute('points', strPoints);
    this._svg.appendChild(svgPolygon);
    this._svgElement = svgPolygon;
    return this;
};

module.exports = SvgCanvas;