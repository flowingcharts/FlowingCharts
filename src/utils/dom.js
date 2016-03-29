/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains functions for manipulating the dom.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          dom 
 */

// Animation polyfill.
var lastTime = 0;
var vendors  = ['ms', 'moz', 'webkit', 'o'];
var raf      = window.requestAnimationFrame;
var caf      = window.cancelAnimationFrame;
for (var x = 0; x < vendors.length && !raf; ++x) 
{
    raf = window[vendors[x]+'RequestAnimationFrame'];
    caf = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}
if (!raf)
{
    raf = function (callback, element) 
    {
        var currTime   = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id         = window.setTimeout(function () {callback(currTime + timeToCall);}, timeToCall);
        lastTime       = currTime + timeToCall;
        return id;
    };
}
if (!caf)
{
    caf = function (id) {clearTimeout(id);};
}

/** 
 * Request animation.
 *
 * @since 0.1.0
 *
 * @param {Function} callback Function to call when it's time to update your animation for the next repaint
 *
 * @return {number} The request id, that uniquely identifies the entry in the callback list.
 */
var requestAnimation = function (callback)
{
    return raf(callback);
};

/** 
 * Cancel animation.
 *
 * @since 0.1.0
 *
 * @param {number} id The id value returned by the call to requestAnimation() that requested the callback.
 */
var cancelAnimation = function (id)
{
    caf(id);
};

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
 * Check if a rect is fully contained within the viewport.
 * 
 * @since 0.1.0
 * 
 * @param {Object} rect         The rectangle to test - coords should be relative to the viewport.
 * @param {number} rect.top     The top value.
 * @param {number} rect.right   The right value.
 * @param {number} rect.bottom  The bottom value.
 * @param {number} rect.left    The left value.
 * @param {number} [margin = 0] An optional margin that is applied to the rect.
 * 
 * @return {object} A rectangle that contains the amount of overlap for each edge rect{top:0, right:0, bottom:0, left:0}.
 */
var isRectInViewport = function (rect, margin) 
{
    var w = viewportWidth();
    var h = viewportHeight();
    margin = margin !== undefined ? margin : 0;
    return {
        top     : rect.top  - margin < 0   ? (rect.top - margin) * -1  : 0,
        right   : rect.right + margin > w  ? rect.right + margin - w   : 0,
        bottom  : rect.bottom + margin > h ? rect.bottom + margin - h  : 0,
        left    : rect.left - margin < 0   ? (rect.left - margin) * -1 : 0
    };
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
    isRectInViewport        : isRectInViewport,
    viewportWidth           : viewportWidth,
    viewportHeight          : viewportHeight,
    pageOffset              : pageOffset,
    requestAnimation        : requestAnimation,
    cancelAnimation         : cancelAnimation,
    getWindowForElement     : getWindowForElement
};