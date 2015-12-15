/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains functions for manipulating the dom.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          dom 
 */

/** 
 * Appends the child element to the parent element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} parentElement   The parent element
 * @param {HTMLElement} childElement    The child element.
 */
var appendChild = function (parentElement, childElement)
{
    parentElement.appendChild(childElement);
};

/** 
 * Empties a html element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The html element.
 */
var empty = function (element)
{
    while (element.firstChild) 
    {
        element.removeChild(element.firstChild);
    }
};

/** 
 * Sets the attributes for the given html element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The html element.
 * @param {object}      attributes  The list of attributes.
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
 * 
 * @param {HTMLElement} element     The html element.
 * @param {object}      attributes  The list of style attributes.
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
 * 
 * @param {string} type         The element type.
 * @param {object} attributes   The list of attributes.
 * 
 * @return {HTMLElement}        The html element.
 */
var createElement = function (type, attributes)
{
    var htmlElement = document.createElement(type);
    attr(htmlElement, attributes);
    style(htmlElement, attributes.style);
    return htmlElement;
};

module.exports = 
{
    empty               : empty,
    attr                : attr,
    style               : style,
    createElement       : createElement,
    appendChild         : appendChild
};