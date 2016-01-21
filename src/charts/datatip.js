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
 * @param {number} x            The absolute x position of the data tip within its container.
 * @param {number} y            The absolute y position of the data tip within its container.
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
    // TODO gap * 2 should be added to notch when testing if notch is too wide/high for the tip.
    // TODOnotch appearing in top left corner on first mouseover after refresh.

    pos = pos !== undefined ? pos : 'top';

    var initX      = x;  // Store initial position x to be used later to position notch.
    var initY      = y;  // Store initial position y to be used later to position notch.
    var edgeMargin = 10; // Margin around the viewport edge.

    // Tip dimensions.
    var bTip   = dom.bounds(this._tip);
    this._wTip = Math.round(bTip.width);
    this._hTip = Math.round(bTip.height);

    // Notch dimensions.
    this._wNotch = 0;
    this._hNotch = 0;

    // Check if tip is within the viewport.
    this._drawNotch(pos);
    var pageOffset = dom.pageOffset();
    var bContainer = dom.bounds(this._container);
    var vx = bContainer.left + x; //- pageOffset.x;
    var vy = bContainer.top + y; //- pageOffset.y;
    if (pos === 'top' || pos === 'bottom')
    {
        var th = this._hTip + edgeMargin + this._hNotch;
        if (vy > (dom.viewportHeight() - th))  pos = 'top';
        if (vy < th)                           pos = 'bottom';
    }
    else if (pos === 'left' || pos === 'right')
    {
        var tw = this._wTip + edgeMargin + this._wNotch;
        if (vx > (dom.viewportWidth() - tw))   pos = 'left';
        if (vx < tw)                           pos = 'right';
    }

    // Redraw notch in case its position has changed.
    this._drawNotch(pos);

    // Adjust positioning to take account of position and notch.
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
    vx = bContainer.left + x; //- pageOffset.x;
    vy = bContainer.top + y; //- pageOffset.y;

    // Adjust position of tip to fit inside viewport.
    var o = dom.isRectInViewport({left:vx, top:vy, right:vx + this._wTip, bottom:vy + this._hTip}, edgeMargin);
    x = x + o.left - o.right;
    y = y + o.top - o.bottom;

    // Position the tip.
    dom.style(this._tip,  {left:x+'px', top:y+'px'});
    //this._tip.style.transform = 'translate('+x+'px,'+y+'px)';

    // Position the notch.
    var xNotch = initX - x;
    var yNotch = initY - y;
    this._positionNotch(pos, xNotch, yNotch);

    var gap = 5;
    if (pos === 'top' || pos === 'bottom')   
    {
        var dx = (xNotch + (this._wNotch / 2) + gap) - this._wTip;
        if (dx > 0) 
        {
            x = x + dx;
            dom.style(this._tip, {left:x+'px'});
            xNotch = initX - x;
            yNotch = initY - y;
            this._positionNotch(pos, xNotch, yNotch);
        }
        dx = xNotch - ((this._wNotch / 2) + gap);
        if (dx < 0) 
        {
            x = x + dx;
            dom.style(this._tip, {left:x+'px'});
            xNotch = initX - x;
            yNotch = initY - y;
            this._positionNotch(pos, xNotch, yNotch);
        }
    }
    if (pos === 'left' || pos === 'right')   
    {
        var dy = (yNotch + (this._hNotch / 2) + gap) - this._hTip;
        if (dy > 0) 
        {
            y = y + dy;
            dom.style(this._tip, {top:y+'px'});
            xNotch = initX - x;
            yNotch = initY - y;
            this._positionNotch(pos, xNotch, yNotch);
        }
        dy = yNotch - ((this._hNotch / 2) + gap);
        if (dy < 0) 
        {
            y = y + dy;
            dom.style(this._tip, {left:y+'px'});
            xNotch = initX - x;
            yNotch = initY - y;
            this._positionNotch(pos, xNotch, yNotch);
        }
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
    // Notch style - uses css border trick.
    var nSize   = 7;
    var nBorder = nSize+'px solid #000000';
    var nFill   = nSize+'px solid #ffffff';
    var nTrans  = nSize+'px solid transparent';

    if (pos === 'top')
    {
        dom.style(this._notchBorder, {borderTop:nBorder,    borderRight:nTrans, borderLeft:nTrans,   borderBottom:'0px'});
        dom.style(this._notchFill,   {borderTop:nFill,      borderRight:nTrans, borderLeft:nTrans,   borderBottom:'0px'});
    }
    else if (pos === 'bottom')
    {
        dom.style(this._notchBorder, {borderBottom:nBorder, borderRight:nTrans, borderLeft:nTrans,   borderTop:'0px'});
        dom.style(this._notchFill,   {borderBottom:nFill,   borderRight:nTrans, borderLeft:nTrans,   borderTop:'0px'});
    }
    else if (pos === 'left')
    {
        dom.style(this._notchBorder, {borderLeft:nBorder,   borderTop:nTrans,   borderBottom:nTrans, borderRight:'0px'});
        dom.style(this._notchFill,   {borderLeft:nFill,     borderTop:nTrans,   borderBottom:nTrans, borderRight:'0px'});
    }
    else if (pos === 'right')
    {
        dom.style(this._notchBorder, {borderRight:nBorder,  borderTop:nTrans,   borderBottom:nTrans, borderLeft:'0px'});
        dom.style(this._notchFill,   {borderRight:nFill,    borderTop:nTrans,   borderBottom:nTrans, borderLeft:'0px'});
    }

    // Get notch dimensions after its been drawn.
    var bNotch   = dom.bounds(this._notchBorder);
    this._wNotch = Math.round(bNotch.width);
    this._hNotch = Math.round(bNotch.height);

    // Hide notch if its bigger than the tip.
    if  (((pos === 'left' || pos === 'right') && (this._hNotch > this._hTip)) || ((pos === 'top' || pos === 'bottom') && (this._wNotch > this._wTip)))
    {
        dom.style(this._notchBorder, {borderTop:'0px', borderRight:'0px', borderBottom:'0px', borderLeft:'0px'});
        dom.style(this._notchFill,   {borderTop:'0px', borderRight:'0px', borderBottom:'0px', borderLeft:'0px'});
        this._wNotch = 0;
        this._hNotch = 0;
    }
};

/** 
 * Position the notch.
 * 
 * @since 0.1.0
 * @private
 * 
 * @param {number} pos The position.
 */
Datatip.prototype._positionNotch = function (pos, x, y)
{
    var nx, ny;
    if (pos === 'top')
    {
        nx = x - (this._wNotch / 2);
        ny = this._hNotch * -1;
        dom.style(this._notchBorder, {left:nx+'px', bottom:(ny-1)+'px', top:'',    right:''});
        dom.style(this._notchFill,   {left:nx+'px', bottom:ny+'px',     top:'',    right:''});
    } 
    else if (pos === 'bottom')
    {
        nx = x - (this._wNotch / 2);
        ny = this._hNotch * -1;
        dom.style(this._notchBorder, {left:nx+'px', top:(ny-1)+'px',    bottom:'', right:''});
        dom.style(this._notchFill,   {left:nx+'px', top:ny+'px',        bottom:'', right:''});
    }
    else if (pos === 'left')
    {
        ny = y - (this._hNotch / 2);
        nx = this._wNotch * -1;
        dom.style(this._notchBorder, {top:ny+'px',  right:(nx-1)+'px',  bottom:'', left:''});
        dom.style(this._notchFill,   {top:ny+'px',  right:nx+'px',      bottom:'', left:''});
    }
    else if (pos === 'right')
    {
        ny = y - (this._hNotch / 2);
        nx = this._wNotch * -1;
        dom.style(this._notchBorder, {top:ny+'px',  left:(nx-1)+'px',   bottom:'', right:''});
        dom.style(this._notchFill,   {top:ny+'px',  left:nx+'px',       bottom:'', right:''});
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