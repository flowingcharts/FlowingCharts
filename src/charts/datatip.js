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
        cursor                  : 'default',
        borderStyle             : 'solid',
        borderWidth             : '1px',
        borderRadius            : '3px',
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
 */
Datatip.prototype.position = function (x, y, pos)
{
    // TODO Mouse out bottom over svg element - chrome doesnt fire an event.
    // TODO Width of tip on small screen.
    // TODO Callout.
    // TODO Position tip above point not mouse.
    // TODO on  mouseover tip should so for couple of seconds before disappearing if user immediately mouseouts.
    // TODO on mouseover if tip is invisible it shouldnt be moved by animation.

    pos = pos !== undefined ? pos : 'top';

    var tipMargin = 5; // Tip padding.
    var mx        = x; // Store initial position x to be used later to position notch.
    var my        = y; // Store initial position y to be used later to position notch.

    // Tip dimensions.
    var bTip = dom.bounds(this._tip);
    this._wTip = Math.round(bTip.width);
    this._hTip = Math.round(bTip.height);

    // Position notch.
    this._drawNotch(pos);

    // Get viewport x and y of tip.
    var pageOffset  = dom.pageOffset();
    var bContainer  = dom.bounds(this._container);
    var viewportX   = (bContainer.left + x) - pageOffset.x;
    var viewportY   = (bContainer.top + y) - pageOffset.y;

    if (pos === 'top' || pos === 'bottom')
    {
        if (viewportY > (dom.viewportHeight() - (this._hTip + tipMargin + this._hNotch)))  pos = 'top';
        if (viewportY < (this._hTip + tipMargin + this._hNotch))                           pos = 'bottom';
    }
    else if (pos === 'left' || pos === 'right')
    {
        if (viewportX > (dom.viewportWidth() - (this._wTip + tipMargin + this._wNotch)))   pos = 'left';
        if (viewportX < (this._wTip + tipMargin + this._wNotch))                           pos = 'right';
    }

    // Position notch.
    this._drawNotch(pos);

    // Adjust positioning to take account of position, margin and notch.
    if (pos === 'top')   
    {
        x = x - (this._wTip / 2);
        y = y - (this._hTip + this._hNotch);
    } 
    else if (pos === 'bottom')   
    {
        x = x - (this._wTip / 2);
        y = y + this._hNotch;
    }
    else if (pos === 'left')   
    {
        x = x - (this._wTip + this._wNotch);
        y = y - (this._hTip / 2);
    }
    else if (pos === 'right')   
    {
        x = x + this._wNotch;
        y = y - (this._hTip / 2);
    }

    // Get viewport x and y of tip.

    viewportX = (bContainer.left + x) - pageOffset.x;
    viewportY = (bContainer.top + y) - pageOffset.y;


    // Adjust position of tip to fit inside viewport.
    var o = dom.isRectInViewport({left:viewportX, top:viewportY, right:viewportX + this._wTip, bottom:viewportY + this._hTip}, tipMargin);

    x = x + o.left - o.right;
    y = y + o.top - o.bottom;

    // Position the tip.
    //dom.style(this._tip, {left: x + 'px', top: y + 'px'});
    this._tip.style.transform = 'translateY('+y+'px)';
    this._tip.style.transform += 'translateX('+x+'px)';

    // Position the notch.
    this._positionNotch(pos, x, y, mx, my);
};

/** 
 * Position the notch.
 * 
 * @since 0.1.0
 * @private
 * 
 * @param {number} pos The position.
 */
Datatip.prototype._positionNotch = function (pos, x, y, mx, my)
{
    var nx, ny;
    if (pos === 'top')
    {
        nx = mx - (this._wNotch / 2) - x;
        ny = this._hNotch * -1;
        dom.style(this._notchBorder,  {left:nx+'px', bottom:(ny-1)+'px',  top:'', right:''});
        dom.style(this._notchFill,    {left:nx+'px', bottom:ny+'px',      top:'', right:''});
    } 
    else if (pos === 'bottom')
    {
        nx = mx - (this._wNotch / 2) - x;
        ny = this._hNotch * -1;
        dom.style(this._notchBorder,  {left:nx+'px', top:(ny-1)+'px',  bottom:'', right:''});
        dom.style(this._notchFill,    {left:nx+'px', top:ny+'px',      bottom:'', right:''});
    }
    else if (pos === 'left')
    {
        nx = this._wNotch * -1;
        ny = my - (this._hNotch / 2) - y;
        dom.style(this._notchBorder,  {top:ny+'px', right:(nx-1)+'px', bottom:'', left:''});
        dom.style(this._notchFill,    {top:ny+'px', right:nx+'px',     bottom:'', left:''});
    }
    else if (pos === 'right')
    {
        nx = this._wNotch * -1;
        ny = my - (this._hNotch / 2) - y;
        dom.style(this._notchBorder,  {top:ny+'px', left:(nx-1)+'px', bottom:'', right:''});
        dom.style(this._notchFill,    {top:ny+'px', left:nx+'px',     bottom:'', right:''});
    }
};

/** 
 * Draws the notch.
 * 
 * @since 0.1.0
 * @private
 * 
 * @param {number} pos The position.
 */
Datatip.prototype._drawNotch = function (pos)
{
    // Notch style.
    var nSize        = 7;
    var nBorder      = nSize+'px solid #000000';
    var nFill        = nSize+'px solid #ffffff';
    var nTransparent = nSize+'px solid transparent';
    var nNone        = '0px';

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

    // Notch  dimensions
    var bNotch = dom.bounds(this._notchBorder);
    this._wNotch = Math.round(bNotch.width);
    this._hNotch = Math.round(bNotch.height);

    // Hide notch if its bigger than the tip.
    if  (((pos === 'left' || pos === 'right') && (this._hNotch > this._hTip)) || ((pos === 'top' || pos === 'bottom') && (this._wNotch > this._wTip)))
    {
        dom.style(this._notchBorder,  {borderTop:nNone, borderRight:nNone, borderBottom:nNone, borderLeft:nNone});
        dom.style(this._notchFill,    {borderTop:nNone, borderRight:nNone, borderBottom:nNone, borderLeft:nNone});
        this._wNotch = 0;
        this._hNotch = 0;
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