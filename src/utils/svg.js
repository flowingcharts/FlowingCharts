/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains functions for manipulating svg.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module svg 
 * @requires utils/dom
 */

var dom = require('../utils/dom');

/** 
 * Creates an svg element with the given attributes.
 * 
 * @since 0.1.0
 * @param {string} type The svg element type.
 * @return {object} attributes The list of attributes.
 */
var createElement = function (type, attributes)
{
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', type);
    dom.attr(svgElement, attributes);
    return svgElement;
};

/** 
 * Check for svg support.
 *
 * @since 0.1.0
 * @return {boolean} true if the browser supports the graphics library, otherwise false.
 */
var isSupported = function ()
{
    return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Shape', '1.0');
};

/** 
 * Returns a group element.
 *
 * @param {SVGElement} The group element.
 * @since 0.1.0
 */
var getCanvas = function ()
{
    return createElement('g');
};

/** 
 * Empties the element.
 *
 * @param {SVGElement} element The svg element.
 * @since 0.1.0
 */
var empty = function (element)
{
    dom.empty(element);
};

/** 
 * Provides the fill drawing routine.
 *
 * @since 0.1.0
 * @param {SVGElement} element The svg element.
 * @param {Object} [options] The style properties.
 * @param {string} [options.fillColor] The fill color.
 * @param {number} [options.fillOpacity] The fill opacity. This is overriden by the fillColor if it contains an alpha value.
 * @param {string} [options.lineColor] The line color.
 * @param {number} [options.lineWidth] The line width.
 * @param {string} [options.lineJoin] The line join, one of "bevel", "round", "miter".
 * @param {string} [options.lineCap] The line cap, one of "butt", "round", "square".
 * @param {number} [options.lineOpacity] The line opacity. This is overriden by the lineColor if it contains an alpha value.
 * @private
 */
var draw = function (element, options)
{
    dom.attr(element, 
    {
        'fill'            : options.fillColor,
        'fill-opacity'    : options.fillOpacity,
        'stroke'          : options.lineColor,
        'stroke-width'    : options.lineWidth,
        'stroke-linejoin' : options.lineJoin,
        'stroke-linecap'  : options.lineCap,
        'stroke-opacity'  : options.lineOpacity
    });
};

/** 
 * Draws a circle.
 *
 * @since 0.1.0
 * @param {SVGElement} element The svg element.
 * @param {number} cx The x position of the center of the circle.
 * @param {number} cy The y position of the center of the circle.
 * @param {number} r The circle radius.
 * @private
 */
var circle = function (element, cx, cy, r)
{
    dom.attr(element, {cx:cx, cy:cy, r:r});
};

/** 
 * Draws an ellipse.
 *
 * @since 0.1.0
 * @param {SVGElement} element The svg element.
 * @param {number} cx The x position of the center of the ellipse.
 * @param {number} cy The y position of the center of the ellipse
 * @param {number} rx The x radius of the ellipse.
 * @param {number} ry The y radius of the ellipse.
 * @private
 */
var ellipse = function (element, cx, cy, rx, ry)
{
    dom.attr(element, {cx:cx, cy:cy, rx:rx, ry:ry});
};

/** 
 * Draws a rectangle.
 *
 * @since 0.1.0
 * @param {SVGElement} element The svg element.
 * @param {number} x The x position of the top left corner.
 * @param {number} y The y position of the top left corner.
 * @param {number} w The width.
 * @param {number} h The height.
 * @private
 */
var rect = function (element, x, y, w, h)
{
     dom.attr(element, {x:x, y:y, width:w, height:h});
};

/** 
 * Draws a line.
 *
 * @since 0.1.0
 * @param {SVGElement} element The svg element.
 * @param {number} x1 The x position of point 1.
 * @param {number} y1 The y position of point 1.
 * @param {number} x2 The x position of point 2.
 * @param {number} y2 The y position of point 2.
 * @private
 */
var line = function (element, x1, y1, x2, y2)
{
    dom.attr(element, {x1:x1, y1:y1, x2:x2, y2:y2});
};

/** 
 * Draws a polyline.
 *
 * @since 0.1.0
 * @param {SVGElement} element The svg element.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @private
 */
var polyline = function (element, arrCoords)
{
    dom.attr(element, {points:getCoordsAsString(arrCoords)});
};

/** 
 * Draws a polygon.
 *
 * @since 0.1.0
 * @param {SVGElement} element The svg element.
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @private
 */
var polygon = function (element, arrCoords)
{
    dom.attr(element, {points:getCoordsAsString(arrCoords)});
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

module.exports = 
{
    createElement : createElement,
    isSupported   : isSupported,
    getCanvas     : getCanvas,
    empty         : empty,
    draw          : draw,
    circle        : circle,
    ellipse       : ellipse,
    rect          : rect,
    line          : line,
    polyline      : polyline,
    polygon       : polygon
};