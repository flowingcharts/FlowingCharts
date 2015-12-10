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
 * @param {string} type The element type.
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

module.exports = 
{
    createElement       : createElement,
    isSupported         : isSupported
};