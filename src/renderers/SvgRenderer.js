/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link SvgRenderer} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/SvgRenderer 
 * @requires renderers/Renderer
 * @requires util
 */

// Required modules.
var Renderer = require('./Renderer');
var util = require('../util');
var extendClass = util.extendClass;
var isNumber = util.isNumber;

/** 
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @class
 * @alias SvgRenderer
 * @augments Renderer
 * @since 0.1.0
 * @author J Clare
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer. 
 * @param {Renderer~onResize} [options.onResize] Function called when the canvas resizes. 
 */
function SvgRenderer (options)
{
    // Private instance members.
    this._svgNS         = "http://www.w3.org/2000/svg";                 // Namespace for SVG elements.
    this._svg           = document.createElementNS(this._svgNS, 'svg'); // The parent svg element.
    this._svgElement    = null;                                         // The svg element that is part of the current drawing routine.

    SvgRenderer.baseConstructor.call(this, options);
}
extendClass(Renderer, SvgRenderer);

/** 
 * @inheritdoc
 */
SvgRenderer.prototype.canvas = function ()
{
    return this._svg;
};

/** 
 * @inheritdoc
 */
SvgRenderer.prototype.setSize = function (w, h)
{
    //<validation>
    if (!isNumber(w)) throw new Error('Renderer.setSize(w): w must be a number.');
    if (w < 0)        throw new Error('Renderer.setSize(w): w must be > 0.');
    if (!isNumber(h)) throw new Error('Renderer.setSize(h): h must be a number.');
    if (h < 0)        throw new Error('Renderer.setSize(h): h must be > 0.');
    //</validation>

    var c = this.canvas();
    c.setAttribute('width', w);
    c.setAttribute('height', h);
};

/** 
 * @inheritdoc
 */
SvgRenderer.prototype.clear = function ()
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
SvgRenderer.prototype.drawFill = function ()
{
    this._svgElement.setAttribute('fill', this.fillColor());
    this._svgElement.setAttribute('fill-opacity', this.fillOpacity());
    return this;
};

/** 
 * @inheritdoc
 */
SvgRenderer.prototype.drawStroke = function ()
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
SvgRenderer.prototype.rect = function (x, y, w, h)
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
SvgRenderer.prototype.circle = function (cx, cy, r)
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
SvgRenderer.prototype.ellipse = function (cx, cy, rx, ry)
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
SvgRenderer.prototype.line = function (x1, y1, x2, y2)
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
SvgRenderer.prototype.polyline = function (arrPoints)
{
    var svgPolyline = document.createElementNS(this._svgNS, 'polyline');
    var n = arrPoints.length;
    var strPoints = '';
    for (var i = 0; i < n; i++)
    {
        var arrPoint = arrPoints[i];
        var x = arrPoint[0], y = arrPoint[1];
        if (i !== 0) strPoints += ',';
        strPoints = '' + x + ' ' + y;
        strPoints += strPoints;
    }
    svgPolyline.setAttribute('points', strPoints);
    this._svg.appendChild(svgPolyline);
    this._svgElement = svgPolyline;
    return this;
};

/** 
 * @inheritdoc
 */
SvgRenderer.prototype.polygon = function (arrPoints)
{
    var svgPolygon = document.createElementNS(this._svgNS, 'polygon');
    var n = arrPoints.length;
    var strPoints = '';
    for (var i = 0; i < n; i++)
    {
        var arrPoint = arrPoints[i];
        var x = arrPoint[0], y = arrPoint[1];
        if (i !== 0) strPoints += ',';
        strPoints = '' + x + ' ' + y;
        strPoints += strPoints;
    }
    svgPolygon.setAttribute('points', strPoints);
    this._svg.appendChild(svgPolygon);
    this._svgElement = svgPolygon;
    return this;
};

module.exports = SvgRenderer;