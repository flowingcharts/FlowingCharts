/* jshint browserify: true */
'use strict';

/**
 * @fileoverview    Exports the {@link Dom} class. 
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          utils/Dom 
 * @requires        utils/validate
 * @requires        utils/animate
 */

// Required modules.
var validate  = require('../utils/validate');
var animate   = require('../utils/animate');

/** 
 * @classdesc Provides functionality for simple HTML manipulation. Supports IE9+.
 *
 * @class
 * @alias Dom
 * @since 0.1.0
 * @constructor
 *
 * @param {HTMLElement|string}  [obj]       The element or a string that specifies the type of element to be created.
 * @param {string}              [namespace] An optional namespace - 'svg' can be used as shorthand for 'http://www.w3.org/2000/svg'.
 *
 * @returns {Dom} A reference to <code>this</code> object.
 */
function Dom (obj, namespace)
{
    this._opacity   = 1;            // Opacity.
    this._fadeDelayId = null;       // The setTimeout() time stamp used by the fade functions. 
    this._fadeAnimationId = null;   // The requestAnimation() time stamp used by the fade functions.  

    if (namespace === 'svg')    namespace = 'http://www.w3.org/2000/svg';
    if (validate.isString(obj)) this._element = this._createElement(obj, namespace);
    else                        this._element = obj;

    return this;
}

/** 
 * Creates the specified HTML element.
 * 
 * @since 0.1.0
 * @private
 * 
 * @param {string} tagName      A string that specifies the type of element to be created.
 * @param {string} [namespace]  An optional namespace.
 * 
 * @return {HTMLElement} The html element.
 */
Dom.prototype._createElement = function (tagName, namespace)
{
    if (namespace !== undefined)    return document.createElementNS(namespace, tagName);
    else                            return document.createElement(tagName);
};

/** 
 * Returns the element associated with the object.
 * 
 * @since 0.1.0
 * 
 * @returns {HTMLElement} The element.
 */
Dom.prototype.element = function ()
{
    return this._element;
};

/** 
 * Appends to a parent element.
 * 
 * @since 0.1.0
 * 
 * @param {Dom} parent The parent element.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.appendTo = function (parent)
{
    parent.element().appendChild(this._element);
    return this;
};

/** 
 * Appends a child element.
 * 
 * @since 0.1.0
 * 
 * @param {Dom} child The child element.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.append = function (child)
{
    this._element.appendChild(child.element());
    return this;
};

/** 
 * Appends text to the element.
 * 
 * @since 0.1.0
 * 
 * @param {string} text The text to add.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.text = function (text)
{
    var textNode = document.createTextNode(text);                       
    this.appendChild(textNode);
    return this;
};

/** 
 * Appends html to the element.
 * 
 * @since 0.1.0
 * 
 * @param {string} html The html to add.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.html = function (html)
{
    this._element.innerHTML = html;
    return this;
};

/** 
 * Removes the element from the dom.
 * 
 * @since 0.1.0
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.remove = function ()
{
    this._element.parentElement.removeChild(this._element);
    return this;
};

/** 
 * Removes all children from the element.
 * 
 * @since 0.1.0
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.empty = function ()
{
    while (this._element.firstChild) {this._element.removeChild(this._element.firstChild);}
    return this;
};

/** 
 * Sets the specified attributes for the element.
 * 
 * @since 0.1.0
 * 
 * @param {object} attributes The list of attributes.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.attr = function (attributes)
{
    for (var property in attributes) 
    {
        if (attributes.hasOwnProperty(property))  
        {
            this._element.setAttribute(property, attributes[property]);
        }
    }
    return this;
};

/** 
 * Removes the specified attributes from the element.
 * 
 * @since 0.1.0
 * 
 * @param {string[]} attributes The list of attributes to remove.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.removeAttr = function (attributes)
{
    for (var i = 0; i < attributes.length; i++)  
    {
        this._element.removeAttribute(attributes[i]);
    }
    return this;
};

/** 
 * Sets the specified styles for the element.
 * 
 * @since 0.1.0
 * 
 * @param {object} styles The list of style attributes.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.style = function (styles)
{
    for (var property in styles) 
    {
        if (styles.hasOwnProperty(property))  
        {
            this._element.style[property] = styles[property];
        }
    }
    return this;
};

/** 
 * Hides the element.
 * 
 * @since 0.1.0
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.hide = function ()
{
    this._element.style.visibility = 'hidden';
    return this;
};

/** 
 * Shows the element.
 * 
 * @since 0.1.0
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.show = function ()
{
    this._element.style.visibility = 'visible';
    return this;
};

/** 
 * Check if the element is visible.
 * 
 * @since 0.1.0
 * 
 * @return {Boolean} true if visible, otherwise false.
 */
Dom.prototype.isVisible = function () 
{
    if (this._element.style.visibility === 'hidden')    return false;
    else                                                return true;
};

/**
 * Sets the opacity of the element.
 * 
 * @since 0.1.0
 * 
 * @param {number} alpha The alpha value 0 - 1.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.opacity = function (alpha) 
{
    this.stopFade();
    this._opacity = alpha;
    this.style({opacity:alpha, filter:'alpha(opacity=' + alpha * 100 + ')'});
    return this;
};

/** 
 * Stop the current animation.
 * 
 * @since 0.1.0
 */
Dom.prototype.stopFade = function () 
{
    clearTimeout(this._fadeDelayId);
    animate.cancelAnimation(this._fadeAnimationId);
};

/** 
 * Fades out the element.
 * 
 * @since 0.1.0
 *
 * @param {Object}      [options]               The options.
 * @param {number}      [options.delay = 1000]  The delay (in milliseconds) before the animation is run.
 */
Dom.prototype.fadeOut = function (options)
{
    if (this._opacity <= 0.1) this.opacity(0);
    else
    {
        var me = this;
        if (arguments.length > 0)
        {
            if (options.delay !== undefined) this._fadeDelayId = setTimeout(function () {me.fadeOut();}, options.delay);
        }
        else            
        {               
            this._opacity -= this._opacity * 0.1;
            this.style({opacity:this._opacity, filter:'alpha(opacity=' + this._opacity * 100 + ')'});
            this._fadeAnimationId = animate.requestAnimation(function () {me.fadeOut();});
        }
    }
};

/** 
 * Fades in the element.
 * 
 * @since 0.1.0
 *
 * @param {Object}      [options]               The options.
 * @param {number}      [options.delay = 1000]  The delay (in milliseconds) before the animation is run.
 */
Dom.prototype.fadeIn = function (options)
{
    if (this._opacity >= 0.9) this.opacity(1);
    else
    {
        var me = this;
        if (arguments.length > 0)
        {
            if (options.delay !== undefined) this._fadeDelayId = setTimeout(function () {me.fadeOut();}, options.delay);
        }
        else            
        {               
            this._opacity += this._opacity * 0.1;
            this.style({opacity:this._opacity, filter:'alpha(opacity=' + this._opacity * 100 + ')'});
            this._fadeAnimationId = animate.requestAnimation(function () {me.fadeIn();});
        }
    }
};

/** 
 * Adds the specified event listeners to the element.
 * 
 * @since 0.1.0
 * 
 * @param {string}      eventNames  A space separated string of event names.
 * @param {Function}    listener    The function that receives a notification when an event of the specified type occurs.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.on = function (eventNames, listener)
{
    var arrTypes = eventNames.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        this._element.addEventListener(type, listener);
    }
    return this;
};

/** 
 * Removes the specified event listeners from the element.
 * 
 * @since 0.1.0
 * 
 * @param {string}      eventNames  A space separated string of event names.
 * @param {Function}    listener    The function to remove from the event target.
 * 
 * @returns {Dom} A reference to <code>this</code> object.
 */
Dom.prototype.off = function (eventNames, listener)
{
    var arrTypes = eventNames.split(' ');
    for (var i = 0; i < arrTypes.length; i++)  
    {
        var type = arrTypes[i].trim();
        this._element.removeEventListener(type, listener);
    }
    return this;
};

/** 
 * Returns the bounds of the element relative to the viewport.
 * 
 * @since 0.1.0
 * 
 * @return {DOMRect} The size of the element and its position relative to the viewport.
 */
Dom.prototype.bounds = function () 
{
    return this._element.getBoundingClientRect();
};

/**
 * Gets the window object that owns the element.
 * 
 * @since 0.1.0
 * 
 * @returns {DocumentView|Window} The window.
 */
Dom.prototype.win = function () 
{
    var doc = this._element.ownerDocument || this._element;
    return (doc.defaultView || doc.parentWindow || window);
};

// Static Methods.

/** 
 * Checks for support of a feature.
 *
 * @static
 * @since 0.1.0
 *
 * @param {string} The feature name.
 * @param {string} The version of the specification defining the feature.
 *
 * @return {boolean} true if the browser supports the functionality, otherwise false.
 */
Dom.isSupported = function (feature, version)
{
    return document.implementation.hasFeature(feature, version);
};

/** 
 * Gets the viewport width.
 * 
 * @static
 * @since 0.1.0
 * 
 * @return {number} The viewport width.
 */
Dom.viewportWidth = function () 
{
    return document.documentElement.clientWidth;
};

/** 
 * Gets the viewport height.
 * 
 * @static
 * @since 0.1.0
 * 
 * @return {number} The viewport height.
 */
Dom.viewportHeight = function () 
{
    return document.documentElement.clientHeight;
};

/** 
 * Returns the page offset (the amount the page is scrolled).
 * 
 * @static
 * @since 0.1.0
 * 
 * @return {Object} {x:number, y:number}.
 */
Dom.pageOffset = function () 
{
    var doc = document.documentElement;
    return {
        x : (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
        y : (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
    };
};

module.exports = Dom;