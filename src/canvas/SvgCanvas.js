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
    // Private instance members.  
    this._activeElement = null; // The active svg element.

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
SvgCanvas.prototype.render = function ()
{
    var n = this.items.length;
    for (var i = 0; i < n; i++)  
    {
        var item = this.items[i];

        this._activeElement = item.element;
        if (this._activeElement === undefined)
        {
            this._activeElement = createSvgElement(item.type);
            this.graphicsElement.appendChild(this._activeElement);
            item.element = this._activeElement;
        }

        this.renderItem(item);
    }
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawFill = function (item)
{
    attr(this._activeElement, 
    {
        'fill'            : item.fillColor(),
        'fill-opacity'    : item.fillOpacity()
    });
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawStroke = function (item)
{
    attr(this._activeElement, 
    {
        'stroke'            : item.lineColor(),
        'stroke-width'      : item.lineWidth(),
        'stroke-linejoin'   : item.lineJoin(),
        'stroke-linecap'    : item.lineCap(),
        'stroke-opacity'    : item.lineOpacity()
    });
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawCircle = function (x, y, w, h)
{
    var r = w / 2;
    var cx = x + r;
    var cy = y + r;

    attr(this._activeElement, 
    {
        cx : cx,
        cy : cy,
        r  : r
    });
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawEllipse = function (x, y, w, h)
{
    var rx = w / 2, ry = h / 2, cx = x + rx , cy = y + ry;
    attr(this._activeElement, 
    {
        cx : cx,
        cy : cy,
        rx  : rx,
        ry  : ry,
    });
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawRect = function (x, y, w, h)
{
    attr(this._activeElement, 
    {
        x       : x,
        y       : y,
        width   : w,
        height  : h,
    });
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawLine = function (arrCoords)
{
    attr(this._activeElement, 
    {
        x1 : arrCoords[0],
        y1 : arrCoords[1],
        x2 : arrCoords[2],
        y2 : arrCoords[3],
    });
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawPolyline = function (arrCoords)
{
    attr(this._activeElement, 
    {
        points : getCoordsAsString(arrCoords)
    });
};

/** 
 * @inheritdoc
 */
SvgCanvas.prototype.drawPolygon = function (arrCoords)
{
    attr(this._activeElement, 
    {
        points : getCoordsAsString(arrCoords)
    });
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