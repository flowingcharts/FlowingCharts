/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains data tip functions.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          datatip 
 * @requires        utils/dom
 * @requires        utils/color
 */

// Required modules.
var dom       = require('../utils/dom');
var colorUtil = require('../utils/color');

var tip = dom.createElement('div'); // Create the data tip.
dom.style(tip, 
{
    position                : 'absolute',
    overflow                : 'hidden',  
    cursor                  : 'default', 
    zIndex                  : 999999999, 
    fontFamily              : 'arial,serif', 
    fontSize                : '12px', 
    color                   : '#666666', 
    padding                 : '7px', 
    background              : 'rgba(255, 255, 255, 0.8)', 
    borderStyle             : 'solid',
    borderWidth             : '1px',
    borderRadius            : '3px',
    whiteSpace              : 'nowrap',
    boxShadow               : '2px 2px 2px 0px rgba(156,156,156,1)',
    '-webkitTouchCallout'   : 'none',
    '-webkitUserSelect'     : 'none',
    '-khtmlUserSelect'      : 'none',
    '-mozUserSelect'        : 'none',
    '-msUserSelect'         : 'none',
    userSelect              : 'none'
});
dom.appendChild(window.document.body, tip);

/** 
 * Hides the  data tip.
 * 
 * @since 0.1.0
 */
var hide = function ()
{
    dom.fadeOut(tip);
};
hide();

/** 
 * Shows the data tip.
 * 
 * @since 0.1.0
 */
var show = function ()
{
    dom.fadeIn(tip);
};

/** 
 * Sets the html for the data tip.
 * 
 * @since 0.1.0
 * 
 * @param {string} html The html.
 */
var html = function (text)
{
    dom.html(tip, text);
};

/** 
 * Position the data tip using absolute positioning.
 *
 * @since 0.1.0
 *
 * @param {number} x            The absolute x position of the data tip.
 * @param {number} y            The absolute y position of the data tip.
 * @param {number} [pos = top]  The position of the data tip relative to the x and y coords.
 *                              'top-left', 'top', 'top-right' 
 *                              'left', 'center', 'right' 
 *                              'bottom-left', 'bottom', 'bottom-right'
 * @param {number} [margin = 0] An optional margin around the data tip.
 */
var position = function (x, y, pos, margin)
{
    pos = pos !== undefined ? pos : 'top';
    margin = margin !== undefined ? margin : 0;
    var viewportMargin = 20;

    // Tip dimensions.
    var w = tip.offsetWidth;
    var h = tip.offsetHeight;

    // Apply positioning.
    if (pos === 'top' || pos === 'center' || pos === 'bottom' ) x = x - (w / 2);
    if (pos.indexOf('top') != -1)  y = y - h;

    if (pos === 'left' || pos === 'center' || pos === 'right') y = y - (h / 2);
    if (pos.indexOf('left') != -1) x = x - w;

    // Apply margin.
    if (pos.indexOf('top') != -1)    y = y - margin;
    if (pos.indexOf('bottom') != -1) y = y + margin;
    if (pos.indexOf('left') != -1)   x = x - margin;
    if (pos.indexOf('right') != -1)  x = x + margin;

    // Get viewport x and y.
    var pageOffset  = dom.pageOffset();
    var viewportX   = x - pageOffset.x;
    var viewportY   = y - pageOffset.y;

    // Adjust position of tip to fit inside viewport.
    var o = dom.isRectInViewport(
    {
        left    : viewportX, 
        top     : viewportY, 
        right   : viewportX + w, 
        bottom  : viewportY + h
    }, viewportMargin);

    // If the tip is bigger than the viewport width resize to fit.
    var vw = dom.viewportWidth() - (viewportMargin * 2);
    if (w > vw) 
    {
        dom.style(tip, {width : vw + 'px', whiteSpace : ''});
    }
    else 
    {
        dom.style(tip, {width : '', whiteSpace : 'nowrap'});
    }
    x = x + o.left - o.right;
    y = y + o.top - o.bottom;

    dom.style(tip, {left: x + 'px', top: y + 'px'});
};

/** 
 * Get the width.
 *
 * @since 0.1.0
 *
 * @return {number} The width.
 */
var width = function ()
{
    return tip.offsetWidth;
};

/** 
 * Get the height.
 *
 * @since 0.1.0
 *
 * @return {number} The height.
 */
var height = function ()
{
    return tip.offsetHeight;
};

/** 
 * Set an edge buffer.
 *
 * @since 0.1.0
 *
 * @param {number} b The buffer.
 */
var padding = function (b)
{
    return tip.offsetHeight;
};

/** 
 * Sets the style for the data tip
 * 
 * @since 0.1.0
 * 
 * @param {object} styles The list of style attributes.
 */
var style = function (styles)
{
    dom.style(tip, styles);
};

module.exports = 
{
    hide        : hide,
    show        : show,
    html        : html,
    position    : position,
    width       : width,
    height      : height,
    style       : style
};