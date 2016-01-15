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
    zIndex                  : 999999999,  
    cursor                  : 'default',
    borderStyle             : 'solid',
    borderWidth             : '1px',
    borderRadius            : '3px',
    fontFamily              : 'arial,serif', 
    fontSize                : '12px', 
    color                   : '#666666', 
    padding                 : '7px', 
    background              : 'rgba(255, 255, 255, 0.8)',     
    boxShadow               : '2px 2px 2px 0px rgba(156,156,156,1)'
});
dom.appendChild(window.document.body, tip);

var tipText = dom.createElement('div'); // Create the data tip.
dom.style(tipText, 
{
    overflow                : 'hidden', 
    whiteSpace              : 'nowrap',
    '-webkitTouchCallout'   : 'none',
    '-webkitUserSelect'     : 'none',
    '-khtmlUserSelect'      : 'none',
    '-mozUserSelect'        : 'none',
    '-msUserSelect'         : 'none',
    userSelect              : 'none'
});
dom.appendChild(tip, tipText);

var notchBorder = dom.createElement('div'); // Create the notch border.
dom.style(notchBorder, 
{
    position                : 'absolute'
});
dom.appendChild(tip, notchBorder);

var notchFill   = dom.createElement('div'); // Create the notch fill.
dom.style(notchFill, 
{
    position                : 'absolute'
});
dom.appendChild(tip, notchFill);


/** 
 * Position the data tip using absolute positioning.
 *
 * @since 0.1.0
 *
 * @param {number} x            The absolute x position of the data tip.
 * @param {number} y            The absolute y position of the data tip.
 * @param {number} [pos = top]  The position of the data tip relative to the x and y coords - one of top, bottom, left or right.
 *
 * @param {number} [margin = 0] An optional margin around the data tip.
 */
var position = function (x, y, pos, margin)
{
    // TODO Mouse out bottom over svg element.
    // TODO Width of tip on small screen.
    // TODO Callout.
    // TODO Position tip above point not mouse.

    pos    = pos !== undefined ? pos : 'top';
    margin = margin !== undefined ? margin : 0;

    var viewportMargin  = 20; // Margin applied to edge of viewport.
    var mx              = x;  // Store initial position x.
    var my              = y;  // Store initial position y.

    // Notch style.
    var nSize           = 7;  
    var nBorder         = nSize+'px solid #000000';
    var nFill           = nSize+'px solid #ffffff';
    var nTransparent    = nSize+'px solid transparent';
    var nNone           = '0px';
    if (pos === 'top')   
    {
        dom.style(notchBorder, {borderTop:nBorder, borderRight:nTransparent, borderBottom:nNone,  borderLeft:nTransparent});
        dom.style(notchFill, {borderTop:nFill, borderRight:nTransparent, borderBottom:nNone, borderLeft:nTransparent});
    }
    else if (pos === 'bottom')   
    {
        dom.style(notchBorder, {borderTop:nNone, borderRight:nTransparent, borderBottom:nBorder,  borderLeft:nTransparent});
        dom.style(notchFill, {borderTop:nNone, borderRight:nTransparent, borderBottom:nFill, borderLeft:nTransparent});
    }
    else if (pos === 'left')   
    {
        dom.style(notchBorder, {borderTop:nTransparent, borderRight:nNone, borderBottom:nTransparent,  borderLeft:nBorder});
        dom.style(notchFill, {borderTop:nTransparent, borderRight:nNone, borderBottom:nTransparent, borderLeft:nFill});
    }
    else if (pos === 'right')   
    {
        dom.style(notchBorder, {borderTop:nTransparent, borderRight:nBorder, borderBottom:nTransparent,  borderLeft:nNone});
        dom.style(notchFill, {borderTop:nTransparent, borderRight:nFill, borderBottom:nTransparent, borderLeft:nNone});
    }

    // Tip dimensions.
    var w = tip.offsetWidth;
    var h = tip.offsetHeight;

    // Notch dimensions.
    var nw = notchBorder.offsetWidth;
    var nh = notchBorder.offsetHeight;

    // Adjust positioning to take account of position, margin and notch.
    if (pos === 'top')   
    {
        x = x - (w / 2);
        y = y - (h + margin + nh);
    } 
    else if (pos === 'bottom')   
    {
        x = x - (w / 2);
        y = y + margin + nh;
    }
    else if (pos === 'left')   
    {
        x = x - (w + margin + nw);
        y = y - (h / 2);
    }
    else if (pos === 'right')   
    {
        x = x + margin + nw;
        y = y - (h / 2);
    }

    // Resize the tip width if its bigger than the viewport width.
    var vw = dom.viewportWidth() - (viewportMargin * 2);
    if (w > vw) 
    {
        // Apply width resize.
        dom.style(tip, {width : vw + 'px'});
        dom.style(tipText, {whiteSpace : ''});
    }
    else 
    {
        // Clear width resize.
        dom.style(tip, {width : ''});
        dom.style(tipText, {whiteSpace : 'nowrap'});
    }

    // Get viewport x and y of tip.
    var pageOffset  = dom.pageOffset();
    var viewportX   = x - pageOffset.x;
    var viewportY   = y - pageOffset.y;

    // Adjust position of tip to fit inside viewport.
    var o = dom.isRectInViewport({left:viewportX, top:viewportY, right:viewportX + w, bottom:viewportY + h}, viewportMargin);
    x = x + o.left - o.right;
    y = y + o.top - o.bottom;

    // Position the tip.
    dom.style(tip, {left: x + 'px', top: y + 'px'});

    // Position the notch.
    var nx, ny;
    if (pos === 'top')   
    {
        nx = mx - (nw / 2) - x;
        ny = nh * -1;
        dom.style(notchBorder,  {left:nx+'px', bottom:(ny-1)+'px',  top:'', right:''});
        dom.style(notchFill,    {left:nx+'px', bottom:ny+'px',      top:'',  right:''});
    } 
    else if (pos === 'bottom')   
    {
        nx = mx - (nw / 2) - x;
        ny = nh * -1;
        dom.style(notchBorder,  {left:nx+'px', top:(ny-1)+'px',  bottom:'', right:''});
        dom.style(notchFill,    {left:nx+'px', top:ny+'px',      bottom:'',  right:''});
    }
    else if (pos === 'left')   
    {
        nx = nw * -1;
        ny = my - (nh / 2) - y;
        dom.style(notchBorder,  {top:ny+'px', right:(nx-1)+'px', bottom:'', left:''});
        dom.style(notchFill,    {top:ny+'px', right:nx+'px',     bottom:'', left:''});
    }
    else if (pos === 'right')   
    {
        nx = nw * -1;
        ny = my - (nh / 2) - y;
        dom.style(notchBorder,  {top:ny+'px', left:(nx-1)+'px', bottom:'', right:''});
        dom.style(notchFill,    {top:ny+'px', left:nx+'px',     bottom:'', right:''});
    }
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
    dom.html(tipText, text);
};

/** 
 * Hides the  data tip.
 * 
 * @since 0.1.0
 */
var hide = function ()
{
    dom.hide(tip);
};
hide();

/** 
 * Shows the data tip.
 * 
 * @since 0.1.0
 */
var show = function ()
{
    dom.show(tip);
};

/** 
 * Fade out the  data tip.
 * 
 * @since 0.1.0
 *
 * @param {number} [delay = 0] A delay before the fade starts.
 */
var fadeOut = function (delay)
{
    dom.fadeOut(tip, 7, delay);
};

/** 
 * Fade in the data tip.
 * 
 * @since 0.1.0
 *
 * @param {number} [delay = 0] A delay before the fade starts.
 */
var fadeIn = function (delay)
{
    dom.fadeIn(tip, 10, delay);
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
    position    : position,
    html        : html,
    hide        : hide,
    show        : show,
    fadeOut     : fadeOut,
    fadeIn      : fadeIn,
    width       : width,
    height      : height,
    style       : style
};