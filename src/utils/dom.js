/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Provides functions for manipulating the dom.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          dom 
 */

/** 
 * Check for support of a feature.
 *
 * @since 0.1.0
 *
 * @param {string} The feature name.
 * @param {string} The version of the specification defining the feature.
 *
 * @return {boolean} true if the browser supports the functionality, otherwise false.
 */
var isSupported = function (feature, version)
{
    return document.implementation.hasFeature(feature, version);
};

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
 * Appends text to the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * @param {string}      text    The text to add.
 */
var appendText = function (element, text)
{
    var textNode = document.createTextNode(text);                       
    appendChild(element, textNode);
};

/** 
 * Appends html to the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * @param {string}      html    The html to add.
 */
var html = function (element, html)
{
    element.innerHTML = html;
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
 * Removes the attributes from the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The target element.
 * @param {string[]}    attributes  The list of attributes to remove.
 */
var removeAttr = function (element, attributes)
{
    for (var i = 0; i < attributes.length; i++)  
    {
        element.removeAttribute(attributes[i]);
    }
};

/** 
 * Sets the style for the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element     The target element.
 * @param {object}      styles      The list of style attributes.
 */
var style = function (element, styles)
{
    for (var property in styles) 
    {
        if (styles.hasOwnProperty(property))  
        {
            element.style[property] = styles[property];
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
    return htmlElement;
};

/** 
 * Creates an svg element with the given attributes.
 * 
 * @since 0.1.0
 * 
 * @param {string} type         The element type.
 * @param {object} attributes   The list of attributes.
 * 
 * @return {HTMLElement}        The html element.
 */
var createSVGElement = function (type, attributes)
{
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', type);
    attr(svgElement, attributes);
    return svgElement;
};

/** 
 * Hides the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 */
var hide = function (element)
{
    element.style.visibility = 'hidden';
};

/** 
 * Shows the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 */
var show = function (element)
{
    element.style.visibility = 'visible';
};

/**
 * Set the opacity of an element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement}  element The target element.
 * @param {HTMLElement}  alpha   The alpha value 0 - 1.
 * 
 */
var opacity = function(element, alpha) 
{
    style(element, {opacity:alpha, filter:'alpha(opacity=' + alpha * 100 + ')'});
};

/** 
 * Check if an element is visible.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * 
 * @return {Boolean} true if visible, otherwise false.
 */
var isVisible = function (element) 
{
    if (element.style.visibility === 'hidden')  return false;
    else                                        return true;
};

/** 
 * Add event listeners to the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element  The target element.
 * @param {string}      types    A space separated string of event types.
 * @param {Function}    listener The function that receives a notification when an event of the specified type occurs.
 */
var on = function (element, types, listener)
{
    var arrTypes = types.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        element.addEventListener(type, listener);
    }
};

/** 
 * Remove event listeners from the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element  The target element.
 * @param {string}      types    A space separated string of event types.
 * @param {Function}    listener The function to remove from the event target.
 */
var off = function (element, types, listener)
{
    var arrTypes = types.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        element.removeEventListener(type, listener);
    }
};

/** 
 * Return the bounds of the target element relative to the viewport.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * 
 * @return {DOMRect} The size of the element and its position relative to the viewport.
 */
var bounds = function (element) 
{
    return element.getBoundingClientRect();
};

/** 
 * Get the viewport width.
 * 
 * @since 0.1.0
 * 
 * @return {number} The viewport width.
 */
var viewportWidth = function () 
{
    return document.documentElement.clientWidth;
};

/** 
 * Get the viewport height.
 * 
 * @since 0.1.0
 * 
 * @return {number} The viewport height.
 */
var viewportHeight = function () 
{
    return document.documentElement.clientHeight;
};

/** 
 * Return the page offset (the amount the page is scrolled).
 * 
 * @since 0.1.0
 * 
 * @return {Object} {x:number, y:number}.
 */
var pageOffset = function () 
{
    var doc = document.documentElement;
    return {
        x : (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
        y : (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
    };
};

/**
 * Get the window object of an element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement}  element The target element.
 * 
 * @returns {DocumentView|Window} The window.
 */
var getWindowForElement = function(element) 
{
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
};

module.exports = 
{
    isSupported             : isSupported,
    appendChild             : appendChild,
    appendText              : appendText,
    html                    : html,
    remove                  : remove,
    empty                   : empty,
    attr                    : attr,
    removeAttr              : removeAttr,
    style                   : style,
    createElement           : createElement,
    createSVGElement        : createSVGElement,
    on                      : on,
    off                     : off,
    hide                    : hide,
    show                    : show,
    opacity                 : opacity,
    isVisible               : isVisible,
    bounds                  : bounds,
    viewportWidth           : viewportWidth,
    viewportHeight          : viewportHeight,
    pageOffset              : pageOffset,
    getWindowForElement     : getWindowForElement
};