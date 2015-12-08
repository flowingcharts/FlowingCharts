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
    // Public instance members.  
    this.graphicsElement = createSvgElement('g');    // The group element container.
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.isSupported = function ()
{
    return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Shape', '1.0');
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.clear = function ()
{
    this.items = [];
    while (this.graphicsElement.firstChild) 
    {
        this.graphicsElement.removeChild(this.graphicsElement.firstChild);
    }
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.appendElement = function (item)
{
    item.element = createSvgElement(item.type());
    this.graphicsElement.appendChild(item.element);
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawFill = function (item)
{
    attr(item.element, 
    {
        'fill'         : item.fillColor(),
        'fill-opacity' : item.fillOpacity()
    });
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawStroke = function (item)
{
    attr(item.element, 
    {
        'stroke'          : item.lineColor(),
        'stroke-width'    : item.lineWidth(),
        'stroke-linejoin' : item.lineJoin(),
        'stroke-linecap'  : item.lineCap(),
        'stroke-opacity'  : item.lineOpacity()
    });
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawCircle = function (item, cx, cy, r)
{
    attr(item.element, {cx:cx, cy:cy, r:r});
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawEllipse = function (item, cx, cy, rx, ry)
{
    attr(item.element, {cx:cx, cy:cy, rx:rx, ry:ry});
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawRect = function (item, x, y, w, h)
{
    attr(item.element, {x:x, y:y, width:w, height:h});
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawLine = function (item, x1, y1, x2, y2)
{
    attr(item.element, {x1:x1, y1:y1, x2:x2, y2:y2});
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawPolyline = function (item, arrCoords)
{
    attr(item.element, {points:getCoordsAsString(arrCoords)});
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawPolygon = function (item, arrCoords)
{    
    attr(item.element, {points:getCoordsAsString(arrCoords)});
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