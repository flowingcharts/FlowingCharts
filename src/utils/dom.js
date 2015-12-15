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
 * Appends the child element to the parent.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} parentElement   The parent element.
 * @param {HTMLElement} childElement    The child element.
 */
var appendChild = function (parentElement, childElement)
{
    parentElement.appendChild(childElement);
};

/** 
 * Removes an element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The element to remove.
 */
var remove = function (element)
{
    element.parentElement.removeChild(element);
};

/** 
 * Empties the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 */
var empty = function (element)
{
    while (element.firstChild) 
    {
        element.removeChild(element.firstChild);
    }
};

/** 
 * Sets the attributes for the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The target element.
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
 * Sets the style for the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The target element.
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

/** 
 * Add event listeners to the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The target element.
 * @param {string[]}    arrTypes    An array containing a list of event types to listen for.
 * @param {Function}    listener    The function that receives a notification when an event of the specified type occurs.
 */
var eventListeners = [];
var on = function (element, arrTypes, listener)
{
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i];
        if (element.attachEvent)
            element.attachEvent('on'+type, listener);
        else
            element.addEventListener(type, listener);
    }
};

/** 
 * Removes event listeners from the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The target element.
 * @param {string[]}    arrTypes    An array containing a list of event types to remove.
 * @param {Function}    listener    The function to remove from the event target.
 */
var off = function (element, arrTypes, listener)
{
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i];
        if (element.attachEvent)
            element.detachEvent('on'+type, listener);
        else
            element.removeEventListener(type, listener);
    }
};

module.exports = 
{
    appendChild     : appendChild,
    remove          : remove,
    empty           : empty,
    attr            : attr,
    style           : style,
    createElement   : createElement,
    on              : on,
    off             : off
};