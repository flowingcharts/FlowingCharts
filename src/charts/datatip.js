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
    this._container       = container;   // Tip container.
    this._pos             = 'top';       // Tip position.
    this._backgroundColor = '#fafafa';   // Tip background color.
    this._borderColor     = '#666666';   // Tip border color.
    this._borderWidth     = 2;           // Tip border width.
    this._viewportMargin  = 10;          // Margin around the viewport edge that the tip isnt allowed to overlap.
    this._minNotchSize    = 8;           // The minimum notch size.
    this._minNotchGap     = 5;           // The minimum distance the notch is allowed from the edge of the tip.
    this._isVisible       = false;       // Is the tip visible?

    // Animation.
    this._xStart          = 0;
    this._yStart          = 0;
    this._xEnd            = 0;
    this._yEnd            = 0;

    // Fade in / out.
    this._fadeInterval    = null;
    this._fadeOutDelay    = null;
    this._tipOpacity      = 1;

    // Create the data tip.
    this._tip = dom.createElement('div'); 
    dom.style(this._tip, 
    {
        position                : 'absolute', 
        pointerEvents           : 'none',
        cursor                  : 'default',
        borderStyle             : 'solid',
        borderWidth             : this._borderWidth+'px',
        borderColor             : this._borderColor, 
        borderRadius            : '4px', 
        fontFamily              : 'arial,serif', 
        fontSize                : '12px', 
        color                   : '#666666', 
        padding                 : '7px', 
        background              : this._backgroundColor/*,     
        boxShadow               : '2px 2px 2px 0px rgba(200,200,200,1)'*/
    });
    dom.appendChild(this._container, this._tip);

    // Create the data tip text.
    this._tipText = dom.createElement('div'); 
    dom.style(this._tipText, 
    {
        pointerEvents           : 'none',
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

    // Create the notch border.
    this._notchBorder = dom.createElement('div'); 
    dom.style(this._notchBorder, 
    {
        position                : 'absolute',
        pointerEvents           : 'none'
    });
    dom.appendChild(this._tip, this._notchBorder);

    // Create the notch fill.
    this._notchFill = dom.createElement('div'); 
    dom.style(this._notchFill, 
    {
        position                : 'absolute',
        pointerEvents           : 'none'
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
    this._pos = pos !== undefined ? pos : this._pos;

    // Store initial position.
    var initX = x;
    var initY = y;

    // Tip dimensions.
    var bTip   = dom.bounds(this._tip);
    this._wTip = bTip.width;
    this._hTip = bTip.height;

    // Change tip position if it is overlapping the viewport margin.
    this._styleNotch();
    var bContainer = dom.bounds(this._container);
    var vx = bContainer.left + x;
    var vy = bContainer.top + y;
    if (this._pos === 'top' || this._pos === 'bottom')
    {
        var totalTipHeight = this._hNotch + this._hTip + this._viewportMargin;
        if (vy < totalTipHeight)                          this._pos = 'bottom';
        if (vy > (dom.viewportHeight() - totalTipHeight)) this._pos = 'top';
    }
    else if (this._pos === 'left' || this._pos === 'right')
    {
        var totalTipWidth = this._hNotch + this._wTip + this._viewportMargin;
        if (vx < totalTipWidth)                          this._pos = 'right';
        if (vx > (dom.viewportWidth() - totalTipWidth))  this._pos = 'left';
    }
    this._styleNotch();

    // Change tip xy to take account of the tip position and notch dimensions.
    if (this._pos === 'top')   
    {
        x = x - (this._wTip / 2);
        y = y - (this._hTip + this._hNotch);
    } 
    else if (this._pos === 'bottom')   
    {
        x = x - (this._wTip / 2);
        y = y + this._hNotch;
    }
    else if (this._pos === 'left')   
    {
        x = x - (this._wTip + this._wNotch);
        y = y - (this._hTip / 2);
    }
    else if (this._pos === 'right')   
    {
        x = x + this._wNotch;
        y = y - (this._hTip / 2);
    }

    // Change tip xy if tip is overlapping the viewport margin.
    vx = bContainer.left + x;
    vy = bContainer.top + y;
    var o = dom.isRectInViewport({left:vx, top:vy, right:vx + this._wTip, bottom:vy + this._hTip}, this._viewportMargin);
    x = x + o.left - o.right;
    y = y + o.top - o.bottom;

    // Change tip xy if the notch is overlapping the viewport margin.
    var xNotch = initX - x;
    var yNotch = initY - y;

    if (this._pos === 'top' || this._pos === 'bottom')   
    {
        var dw = (this._wNotch / 2) + this._minNotchGap + this._borderWidth;

        var dx = xNotch + dw - this._wTip;
        if (dx > 0) x = x + dx;

        dx = xNotch - dw;
        if (dx < 0) x = x + dx;
    }
    if (this._pos === 'left' || this._pos === 'right')   
    {
        var dh = (this._hNotch / 2) + this._minNotchGap + this._borderWidth;

        var dy = yNotch + dh - this._hTip;
        if (dy > 0) y = y + dy;

        dy = yNotch - dh;
        if (dy < 0) y = y + dy;
    }
    xNotch = initX - x;
    yNotch = initY - y;

    // Position the tip and notch.
    this._positionNotch(xNotch, yNotch);
    this._xEnd = x;
    this._yEnd = y;
    this._positionAnimate();

};

/** 
 * Positions the tip using animation.
 * 
 * @since 0.1.0
 * @private
 */
Datatip.prototype._positionAnimate = function ()
{
    // Stop animation if within one pixel of end point.
    if ((Math.abs(this._xEnd - this._xStart) < 1) && (Math.abs(this._yEnd - this._yStart) < 1))
    {
        this._xStart = this._xEnd;
        this._yStart = this._yEnd;
    }
    else
    {
        var me = this;
        this._xStart += (this._xEnd - this._xStart) / 3; // This number controls speed of animation.
        this._yStart += (this._yEnd - this._yStart) / 3;
        dom.style(this._tip, {left:this._xStart+'px', top:this._yStart+'px'});
        dom.requestAnimation(function () {me._positionAnimate();});
    }
};

/** 
 * Styles the notch.
 * 
 * @since 0.1.0
 * @private
 */
Datatip.prototype._styleNotch = function ()
{
    dom.style(this._tip, {borderColor:this._borderColor});

    // Notch style - uses css border trick.
    var nSize   = Math.max(this._minNotchSize, this._borderWidth);
    var nBorder = nSize+'px solid '+this._borderColor;
    var nFill   = nSize+'px solid '+this._backgroundColor;
    var nTrans  = nSize+'px solid transparent';

    if (this._pos === 'top')
    {
        dom.style(this._notchBorder, {borderTop:nBorder,    borderRight:nTrans, borderLeft:nTrans,   borderBottom:'0px'});
        dom.style(this._notchFill,   {borderTop:nFill,      borderRight:nTrans, borderLeft:nTrans,   borderBottom:'0px'});
    }
    else if (this._pos === 'bottom')
    {
        dom.style(this._notchBorder, {borderBottom:nBorder, borderRight:nTrans, borderLeft:nTrans,   borderTop:'0px'});
        dom.style(this._notchFill,   {borderBottom:nFill,   borderRight:nTrans, borderLeft:nTrans,   borderTop:'0px'});
    }
    else if (this._pos === 'left')
    {
        dom.style(this._notchBorder, {borderLeft:nBorder,   borderTop:nTrans,   borderBottom:nTrans, borderRight:'0px'});
        dom.style(this._notchFill,   {borderLeft:nFill,     borderTop:nTrans,   borderBottom:nTrans, borderRight:'0px'});
    }
    else if (this._pos === 'right')
    {
        dom.style(this._notchBorder, {borderRight:nBorder,  borderTop:nTrans,   borderBottom:nTrans, borderLeft:'0px'});
        dom.style(this._notchFill,   {borderRight:nFill,    borderTop:nTrans,   borderBottom:nTrans, borderLeft:'0px'});
    }

    // Get notch dimensions after its been drawn.
    var bNotch   = dom.bounds(this._notchBorder);
    this._wNotch = bNotch.width;
    this._hNotch = bNotch.height;

    // Hide notch if its bigger than the tip.
    if  (((this._pos === 'left' || this._pos === 'right') && ((this._hNotch + (this._minNotchGap * 2) + (this._borderWidth * 2)) > this._hTip)) || 
         ((this._pos === 'top' || this._pos === 'bottom') && ((this._wNotch + (this._minNotchGap * 2) + (this._borderWidth * 2))  > this._wTip)))
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
 * @param {number} x The x position.
 * @param {number} y The y position.
 */
Datatip.prototype._positionNotch = function (x, y)
{
    var nx, ny;
    if (this._pos === 'top')
    {
        nx = x - (this._wNotch / 2) - this._borderWidth;
        ny = this._hNotch * -1;
        dom.style(this._notchBorder, {left:nx+'px', bottom:(ny-this._borderWidth)+'px', top:'',    right:''});
        dom.style(this._notchFill,   {left:nx+'px', bottom:(ny+1)+'px',                 top:'',    right:''});
    } 
    else if (this._pos === 'bottom')
    {
        nx = x - (this._wNotch / 2) - this._borderWidth;
        ny = this._hNotch * -1;
        dom.style(this._notchBorder, {left:nx+'px', top:(ny-this._borderWidth)+'px',    bottom:'', right:''});
        dom.style(this._notchFill,   {left:nx+'px', top:(ny+1)+'px',                    bottom:'', right:''});
    }
    else if (this._pos === 'left')
    {
        ny = y - (this._hNotch / 2) - this._borderWidth;
        nx = this._wNotch * -1;
        dom.style(this._notchBorder, {top:ny+'px',  right:(nx-this._borderWidth)+'px',  bottom:'', left:''});
        dom.style(this._notchFill,   {top:ny+'px',  right:(nx+1)+'px',                  bottom:'', left:''});
    }
    else if (this._pos === 'right')
    {
        ny = y - (this._hNotch / 2) - this._borderWidth;
        nx = this._wNotch * -1;
        dom.style(this._notchBorder, {top:ny+'px',  left:(nx-this._borderWidth)+'px',   bottom:'', right:''});
        dom.style(this._notchFill,   {top:ny+'px',  left:(nx+1)+'px',                   bottom:'', right:''});
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
 * Shows the data tip.
 * 
 * @since 0.1.0
 */
Datatip.prototype.show = function ()
{ 
    clearTimeout(this._fadeOutDelay);
    clearInterval(this._fadeInterval);
    dom.show(this._tip);
    
    dom.style(this._tip, {opacity:1, filter:'alpha(opacity=100)'});
    this._tipOpacity = 1;
    this._isVisible = true;
};

/** 
 * Hides the data tip.
 * 
 * @since 0.1.0
 */
Datatip.prototype.hide = function ()
{
    clearTimeout(this._fadeOutDelay);
    clearInterval(this._fadeInterval);
    dom.hide(this._tip);

    dom.style(this._tip, {opacity:0, filter:'alpha(opacity=0)'});
    this._tipOpacity = 0;
    this._isVisible = false;
};

/** 
 * Fade out the  data tip.
 * 
 * @since 0.1.0
 */
Datatip.prototype.fadeOut = function ()
{
    var me = this;
    this._isVisible = false;

    clearTimeout(this._fadeOutDelay);
    this._fadeOutDelay = setTimeout(function ()
    {
        clearInterval(me._fadeInterval);
        me._fadeInterval = setInterval(function () 
        {
            if (me._tipOpacity <= 0.1) me.hide();
            dom.style(me._tip, {opacity:me._tipOpacity, filter:'alpha(opacity=' + me._tipOpacity * 100 + ')'});
            me._tipOpacity -= me._tipOpacity * 0.1;
        }, 20);
    }, 700);
};

/** 
 * Is the data tip visible?.
 * 
 * @since 0.1.0
 * 
 * @return {boolean} The visibility as true or false.
 */
Datatip.prototype.isVisible = function ()
{
    return this._isVisible;
};

/** 
 * Sets the color of the border.
 * 
 * @since 0.1.0
 * 
 * @param {string} color The color.
 */
Datatip.prototype.borderColor = function (color)
{
    this._borderColor = color;
    this._styleNotch();
};

module.exports = Datatip;