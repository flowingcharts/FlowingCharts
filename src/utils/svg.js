/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains functions for manipulating svg.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          svg 
 * @requires        utils/dom
 */

var dom = require('../utils/dom');

/** 
 * Creates an svg element with the given attributes.
 *
 * @since 0.1.0
 *
 * @param {string} type The svg element type.
 *
 * @return {object} attributes The list of attributes.
 */
var createElement = function (type, attributes)
{
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', type);
    dom.attr(svgElement, attributes);
    return svgElement;
};

/** 
 * Checks for svg support.
 *
 * @since 0.1.0
 *
 * @return {boolean} true if the browser supports the graphics library, otherwise false.
 */
var isSupported = function ()
{
    return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Shape', '1.0');
};

/** 
 * Returns a group element.
 *
 * @since 0.1.0
 *
 * @param {SVGElement} The group element.
 */
var getCanvas = function ()
{
    return createElement('g');
};

/** 
 * Empties the element.
 *
 * @since 0.1.0
 *
 * @param {SVGElement} element The svg element.
 */
var empty = function (element)
{
    dom.empty(element);
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number}      cx                  The x position of the center of the circle.
 * @param {number}      cy                  The y position of the center of the circle.
 * @param {number}      r                   The circle radius.
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var circle = function (element, cx, cy, r, style)
{
    dom.attr(element, {cx:cx, cy:cy, r:r});
    draw(element, style);
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number}      cx                  The x position of the center of the ellipse.
 * @param {number}      cy                  The y position of the center of the ellipse
 * @param {number}      rx                  The x radius of the ellipse.
 * @param {number}      ry                  The y radius of the ellipse.
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var ellipse = function (element, cx, cy, rx, ry, style)
{
    dom.attr(element, {cx:cx, cy:cy, rx:rx, ry:ry});
    draw(element, style);
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number}      x                   The x position of the top left corner.
 * @param {number}      y                   The y position of the top left corner.
 * @param {number}      w                   The width.
 * @param {number}      h                   The height.
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var rect = function (element, x, y, w, h, style)
{
    dom.attr(element, {x:x, y:y, width:w, height:h});
    draw(element, style);
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number}      x1                  The x position of point 1.
 * @param {number}      y1                  The y position of point 1.
 * @param {number}      x2                  The x position of point 2.
 * @param {number}      y2                  The y position of point 2.
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var line = function (element, x1, y1, x2, y2, style)
{
    dom.attr(element, {x1:x1, y1:y1, x2:x2, y2:y2});
    draw(element, style);
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number[]}    arrCoords           An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var polyline = function (element, arrCoords, style)
{
    dom.attr(element, {points:getCoordsAsString(arrCoords)});
    draw(element, style);
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 *
 * @param {SVGElement}  element             The svg element.
 * @param {number[]}    arrCoords           An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
var polygon = function (element, arrCoords, style)
{
    dom.attr(element, {points:getCoordsAsString(arrCoords)});
    draw(element, style);
};

/** 
 * Converts an array of coords [x1, y1, x2, y2, x3, y3, x4, y4, ...] 
 * to a comma separated string of coords 'x1 y1, x2 y2, x3 y3, x4 y4, ...'.
 * 
 * @since 0.1.0
 * @private
 * 
 * @param {number[]} arrCoords The list of coords.
 * 
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

/** 
 * Provides the fill drawing routine.
 *
 * @since 0.1.0
 * @private
 *
 * @param {SVGElement}  element             The svg element.
 * @param {Object}      [style]             The style properties.
 * @param {string}      [style.fillColor]   The fill color.
 * @param {number}      [style.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string}      [style.lineColor]   The line color.
 * @param {number}      [style.lineWidth]   The line width.
 * @param {string}      [style.lineJoin]    The line join, one of "bevel", "round", "miter".
 * @param {string}      [style.lineCap]     The line cap, one of "butt", "round", "square".
 * @param {number}      [style.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 */
function draw(element, style)
{
    dom.attr(element, 
    {
        'fill'            : style.fillColor,
        'fill-opacity'    : style.fillOpacity,
        'stroke'          : style.lineColor,
        'stroke-width'    : style.lineWidth,
        'stroke-linejoin' : style.lineJoin,
        'stroke-linecap'  : style.lineCap,
        'stroke-opacity'  : style.lineOpacity
    });
}

module.exports = 
{
    createElement : createElement,
    isSupported   : isSupported,
    getCanvas     : getCanvas,
    empty         : empty,
    circle        : circle,
    ellipse       : ellipse,
    rect          : rect,
    line          : line,
    polyline      : polyline,
    polygon       : polygon
};