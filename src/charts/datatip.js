/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Datatip} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          datatip 
 * @requires        utils/dom
 * @requires        utils/color
 */

// Required modules.
var dom       = require('../utils/dom');
var colorUtil = require('../utils/color');

/** 
 * @classdesc Class for graphics libraries.
 *
 * @class
 * @alias Canvas
 * @since 0.1.0
 * @constructor
 *
 * @param {HTMLElement} container The html container.
 */
function Datatip (container)
{
    this._container = container;

    this._tip = dom.createElement('div'); // Create the data tip.
    dom.style(this._tip, 
    {
        position                : 'absolute', 
        zIndex                  : 999999999,  
        cursor                  : 'default',
        borderStyle             : 'solid',
        borderWidth             : '1px',
        fontFamily              : 'arial,serif', 
        fontSize                : '12px', 
        color                   : '#666666', 
        padding                 : '7px', 
        background              : 'rgba(255, 255, 255, 0.8)',     
        boxShadow               : '2px 2px 2px 0px rgba(156,156,156,1)',
        '-mozTransition'        : 'transform 0.2s', 
        '-webkitTransition'     : 'transform 0.2s',  
        '-msTransition'         : 'transform 0.2s',  
        '-oTransition'          : 'transform 0.2s',  
        transition              : 'transform 0.2s'  
    });
    dom.appendChild(this._container, this._tip);

    this._tipText = dom.createElement('div'); // Create the data tip.
    dom.style(this._tipText, 
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
    dom.appendChild(this._tip, this._tipText);

    this._notchBorder = dom.createElement('div'); // Create the notch border.
    dom.style(this._notchBorder, 
    {
        position                : 'absolute'
    });
    dom.appendChild(this._tip, this._notchBorder);

    this._notchFill = dom.createElement('div'); // Create the notch fill.
    dom.style(this._notchFill, 
    {
        position                : 'absolute'
    });
    dom.appendChild(this._tip, this._notchFill);

    this.hide();
}

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
Datatip.prototype.position = function (x, y, pos, margin)
{
    // TODO Mouse out bottom over svg element - chrome doesnt fire an event.
    // TODO Width of tip on small screen.
    // TODO Callout.
    // TODO Position tip above point not mouse.
    // TODO on  mouseover tip should so for couple of seconds before disappearing if user immediately mouseouts.
    // TODO oon mouseover if tip is invisible it shouldnt be moved by animation.

    pos    = pos !== undefined ? pos : 'top';
    margin = margin !== undefined ? margin : 0;

    var tipPadding  = 5; // Tip padding.
    var nSize       = 7; // Notch size.
    var mx          = x; // Store initial position x to be used later to position notch.
    var my          = y; // Store initial position y to be used later to position notch.

    // Tip dimensions.
    var bounds = dom.bounds(this._tip);
    var w = Math.round(bounds.width);
    var h = Math.round(bounds.height);

    // Get viewport x and y of tip.
    var pageOffset  = dom.pageOffset();
    var viewportX   = x - pageOffset.x;
    var viewportY   = y - pageOffset.y;

    // Resize the tip width if its bigger than the viewport width.
    var vw = dom.viewportWidth() - (tipPadding * 2);
    window.console.log(vw);
    if (w > vw) 
    {
        // Apply width resize.
        dom.style(this._tip, {width : vw + 'px'});
        dom.style(this._tipText, {whiteSpace : ''});

        pos = 'top';
        w = vw;
    }
    else 
    {
        // Clear width resize.
        dom.style(this._tip, {width : ''});
        dom.style(this._tipText, {whiteSpace : 'nowrap'});
    }

    if (pos === 'left' || pos === 'right')
    {
        //if ((w * 2) > (dom.viewportWidth() - (tipPadding * 2))) pos = 'top';
    }

    if (pos === 'top' || pos === 'bottom')
    {
        if (viewportY > (dom.viewportHeight() - (h + tipPadding + nSize)))  pos = 'top';
        if (viewportY < (h + tipPadding + nSize))                           pos = 'bottom';
        if (viewportX + 5 > (dom.viewportWidth() - (tipPadding + nSize)))   pos = 'left';
        if (viewportX - 5 < (tipPadding + nSize))                           pos = 'right';
    }
    else if (pos === 'left' || pos === 'right')
    {
        if (viewportX > (dom.viewportWidth() - (w + tipPadding + nSize)))   pos = 'left';
        if (viewportX < (w + tipPadding + nSize))                           pos = 'right';
        if (viewportY + 5 > (dom.viewportHeight() - (tipPadding + nSize)))  pos = 'top';
        if (viewportY - 5 < (tipPadding + nSize))                           pos = 'bottom';
    }

    // Notch style.
    var nBorder         = nSize+'px solid #000000';
    var nFill           = nSize+'px solid #ffffff';
    var nTransparent    = nSize+'px solid transparent';
    var nNone           = '0px';
    if (pos === 'top')
    {
        dom.style(this._notchBorder,  {borderTop:nBorder, borderRight:nTransparent, borderBottom:nNone, borderLeft:nTransparent});
        dom.style(this._notchFill,    {borderTop:nFill, borderRight:nTransparent, borderBottom:nNone, borderLeft:nTransparent});
    }
    else if (pos === 'bottom')
    {
        dom.style(this._notchBorder,  {borderTop:nNone, borderRight:nTransparent, borderBottom:nBorder, borderLeft:nTransparent});
        dom.style(this._notchFill,    {borderTop:nNone, borderRight:nTransparent, borderBottom:nFill, borderLeft:nTransparent});
    }
    else if (pos === 'left')
    {
        dom.style(this._notchBorder,  {borderTop:nTransparent, borderRight:nNone, borderBottom:nTransparent, borderLeft:nBorder});
        dom.style(this._notchFill,    {borderTop:nTransparent, borderRight:nNone, borderBottom:nTransparent, borderLeft:nFill});
    }
    else if (pos === 'right')
    {
        dom.style(this._notchBorder,  {borderTop:nTransparent, borderRight:nBorder, borderBottom:nTransparent, borderLeft:nNone});
        dom.style(this._notchFill,    {borderTop:nTransparent, borderRight:nFill, borderBottom:nTransparent, borderLeft:nNone});
    }

    // Notch dimensions.
    var nBounds = dom.bounds(this._notchBorder);
    var nw = Math.round(nBounds.width);
    var nh = Math.round(nBounds.height);

    // Hide notch if its bigger than the tip.
    if  (((pos === 'left' || pos === 'right') && (nh > h)) || ((pos === 'top' || pos === 'bottom') && (nw > w)))
    {
        dom.style(this._notchBorder,  {borderTop:nNone, borderRight:nNone, borderBottom:nNone, borderLeft:nNone});
        dom.style(this._notchFill,    {borderTop:nNone, borderRight:nNone, borderBottom:nNone, borderLeft:nNone});
    }

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

    // Get viewport x and y of tip.
    viewportX = x - pageOffset.x;
    viewportY = y - pageOffset.y;

    // Adjust position of tip to fit inside viewport.
    var o = dom.isRectInViewport({left:viewportX, top:viewportY, right:viewportX + w, bottom:viewportY + h}, tipPadding);
    x = x + o.left - o.right;
    y = y + o.top - o.bottom;

    // Position the tip.
    //dom.style(this._tip, {left: x + 'px', top: y + 'px'});

    this._tip.style.transform = 'translateY('+y+'px)';
    this._tip.style.transform += 'translateX('+x+'px)';

    // Position the notch.
    var nx, ny;
    if (pos === 'top')
    {
        nx = mx - (nw / 2) - x;
        ny = nh * -1;
        dom.style(this._notchBorder,  {left:nx+'px', bottom:(ny-1)+'px',  top:'', right:''});
        dom.style(this._notchFill,    {left:nx+'px', bottom:ny+'px',      top:'', right:''});
    } 
    else if (pos === 'bottom')
    {
        nx = mx - (nw / 2) - x;
        ny = nh * -1;
        dom.style(this._notchBorder,  {left:nx+'px', top:(ny-1)+'px',  bottom:'', right:''});
        dom.style(this._notchFill,    {left:nx+'px', top:ny+'px',      bottom:'', right:''});
    }
    else if (pos === 'left')

    {
        nx = nw * -1;
        ny = my - (nh / 2) - y;
        dom.style(this._notchBorder,  {top:ny+'px', right:(nx-1)+'px', bottom:'', left:''});
        dom.style(this._notchFill,    {top:ny+'px', right:nx+'px',     bottom:'', left:''});
    }
    else if (pos === 'right')
    {
        nx = nw * -1;
        ny = my - (nh / 2) - y;
        dom.style(this._notchBorder,  {top:ny+'px', left:(nx-1)+'px', bottom:'', right:''});
        dom.style(this._notchFill,    {top:ny+'px', left:nx+'px',     bottom:'', right:''});
    }
};

/** 
 * Sets the html for the data tip.
 * 
 * @since 0.1.0
 * 
 * @param {string} html The html.
 */
Datatip.prototype.html = function (text)
{
    dom.html(this._tipText, text);
};

/** 
 * Hides the  data tip.
 * 
 * @since 0.1.0
 */
Datatip.prototype.hide = function ()
{
    dom.hide(this._tip);
};

/** 
 * Shows the data tip.
 * 
 * @since 0.1.0
 */
Datatip.prototype.show = function ()
{
    dom.show(this._tip);
};

/** 
 * Fade out the  data tip.
 * 
 * @since 0.1.0
 *
 * @param {number} [delay = 0] A delay before the fade starts.
 */
Datatip.prototype.fadeOut = function (delay)
{
    dom.fadeOut(this._tip, 7, delay);
};

/** 
 * Fade in the data tip.
 * 
 * @since 0.1.0
 *
 * @param {number} [delay = 0] A delay before the fade starts.
 */
Datatip.prototype.fadeIn = function (delay)
{
    dom.fadeIn(this._tip, 10, delay);
};

/** 
 * Get the width.
 *
 * @since 0.1.0
 *
 * @return {number} The width.
 */
Datatip.prototype.width = function ()
{
    return Math.round(dom.bounds(this._tip).width);
};

/** 
 * Get the height.
 *
 * @since 0.1.0
 *
 * @return {number} The height.
 */
Datatip.prototype.height = function ()
{
    return Math.round(dom.bounds(this._tip).height);
};

/** 
 * Sets the style for the data tip.
 * 
 * @since 0.1.0
 * 
 * @param {object} styles The list of style attributes.
 */
Datatip.prototype.style = function (styles)
{
    dom.style(this._tip, styles);
};

module.exports = Datatip;