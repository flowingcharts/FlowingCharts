/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains functions for manipulating the dom.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module dom 
 */

/** 
 * Sets the attributes for the given html element.
 * 
 * @since 0.1.0
 * @param {HTMLElement} htmlElement The html element.
 * @return {object} attributes The list of attributes.
 */
var attr = function (element, attributes)
{
    for (var property in attributes) 
    {
        if (attributes.hasOwnProperty(property))  
        {
            element.setAttribute(property, attributes[property]);
        }
    }
};

/** 
 * Sets the style for the given html element.
 * 
 * @since 0.1.0
 * @param {HTMLElement} htmlElement The html element.
 * @return {object} attributes The list of style attributes.
 */
var style = function (element, attributes)
{
    for (var property in attributes) 
    {
        if (attributes.hasOwnProperty(property))  
        {
            element.style[property] = attributes[property];
        }
    }
};

/** 
 * Creates a html element with the given attributes.
 * 
 * @since 0.1.0
 * @param {string} type The element type.
 * @return {object} attributes The list of attributes.
 */
var createElement = function (type, attributes)
{
    var htmlElement = document.createElement(type);
    attr(htmlElement, attributes);
    style(htmlElement, attributes.style);
    return htmlElement;
};

/** 
 * Creates an svg element with the given attributes.
 * 
 * @since 0.1.0
 * @param {string} type The element type.
 * @return {object} attributes The list of attributes.
 */
var createSvgElement = function (type, attributes)
{
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', type);
    attr(svgElement, attributes);
    return svgElement;
};

module.exports = 
{
    attr                : attr,
    style               : style,
    createElement       : createElement,
    createSvgElement    : createSvgElement
};