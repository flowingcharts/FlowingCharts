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
 * Appends text to the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * @param {string}      text    The text to add
 */
var appendText = function (element, text)
{
    var textNode = document.createTextNode(text);                       
    appendChild(element, textNode);
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
 * Sows the target element.
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
        if (element.attachEvent)
            element.attachEvent('on'+type, listener); // <IE9.
        else
            element.addEventListener(type, listener);
    }
};

/** 
 * Removes event listeners from the target element.
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
        if (element.attachEvent)
            element.detachEvent('on'+type, listener); // <IE9.
        else
            element.removeEventListener(type, listener);
    }
};

/** 
 * Return the position of the target element.
 * 
 * @since 0.1.0
 * 
 * @param {HTMLElement} element The target element.
 * 
 * @return {Object}     {x:number, y:number}.
 */
var getPosition = function (element) 
{
    /*var xPosition = 0;
    var yPosition = 0;
    while (element) 
    {
        xPosition   += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition   += (element.offsetTop - element.scrollTop + element.clientTop);
        element     = element.offsetParent;
    }
    return {x:xPosition, y:yPosition};*/

    var rect = element.getBoundingClientRect();
    return {x:rect.left, y:rect.top};
};



module.exports = 
{
    appendChild     : appendChild,
    appendText      : appendText,
    remove          : remove,
    empty           : empty,
    attr            : attr,
    removeAttr      : removeAttr,
    style           : style,
    createElement   : createElement,
    on              : on,
    off             : off,
    hide            : hide,
    show            : show,
    getPosition     : getPosition
};