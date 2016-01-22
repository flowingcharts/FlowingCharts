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
    this._backgroundColor = '#ffffff';   // Tip background color.
    this._borderColor     = '#000000';   // Tip border color.
    this._borderWidth     = 1;           // Tip border width.
    this._viewportMargin  = 10;          // Margin around the viewport edge that the tip isnt allowed to overlap.
    this._minNotchSize    = 8;           // The minimum notch size.
    this._minNotchGap     = 10;          // The minimum distance the notch is allowed from the edge of the tip.

    // For animation.
    this._mouseTracking = null;
    this._xPos = 0;
    this._yPos = 0;
    this._x = 0;
    this._y = 0;

    // Create the data tip.
    this._tip = dom.createElement('div'); 
    dom.style(this._tip, 
    {
        position                : 'absolute', 
        cursor                  : 'default',
        borderStyle             : 'solid',
        borderWidth             : this._borderWidth+'px',
        borderColor             : this._borderColor, 
        borderRadius            : '3px', 
        fontFamily              : 'arial,serif', 
        fontSize                : '12px', 
        color                   : '#666666', 
        padding                 : '7px', 
        background              : this._backgroundColor,     
        boxShadow               : '2px 2px 2px 0px rgba(200,200,200,1)'
    });
    dom.appendChild(this._container, this._tip);

    // Create the data tip text.
    this._tipText = dom.createElement('div'); 
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

    // Create the notch border.
    this._notchBorder = dom.createElement('div'); 
    dom.style(this._notchBorder, {position : 'absolute'});
    dom.appendChild(this._tip, this._notchBorder);

    // Create the notch fill.
    this._notchFill = dom.createElement('div'); 
    dom.style(this._notchFill, {position : 'absolute'});
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
    // TODO on mouseover if tip is invisible it shouldnt be moved by animation.
    // TODO this._minNotchGap * 2 should be added to notch when testing if notch is too wide/high for the tip.
    // TODO mousein then mouseout immediately - get semi transparent tip - needs time to fully appear and stay before disappearing.

    this._pos = pos !== undefined ? pos : this._pos;

    // Store initial position.
    var initX = x;
    var initY = y;

    // Tip dimensions.
    var bTip   = dom.bounds(this._tip);
    this._wTip = Math.round(bTip.width);
    this._hTip = Math.round(bTip.height);

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
    //this._tip.style.transform = 'translate('+x+'px,'+y+'px)';
    //dom.style(this._tip, {left:x+'px', top:y+'px'});

    this._x = x;
    this._y = y;


};

/** 
 * Styles the notch.
 * 
 * @since 0.1.0
 * @private
 */
Datatip.prototype._styleNotch = function ()
{
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
    this._wNotch = Math.round(bNotch.width);
    this._hNotch = Math.round(bNotch.height);

    // Hide notch if its bigger than the tip.
    if  (((this._pos === 'left' || this._pos === 'right') && (this._hNotch > this._hTip)) || ((this._pos === 'top' || this._pos === 'bottom') && (this._wNotch > this._wTip)))
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

        /*dom.style(this._notchBorder, {bottom:(ny-this._borderWidth)+'px', top:'',    right:''});
        dom.style(this._notchFill,   {bottom:(ny+1)+'px',                 top:'',    right:''});
        this._notchBorder.style.transform = 'translateX('+nx+'px)';
        this._notchFill.style.transform = 'translateX('+nx+'px)';*/
    } 
    else if (this._pos === 'bottom')
    {
        nx = x - (this._wNotch / 2) - this._borderWidth;
        ny = this._hNotch * -1;
        dom.style(this._notchBorder, {left:nx+'px', top:(ny-this._borderWidth)+'px',    bottom:'', right:''});
        dom.style(this._notchFill,   {left:nx+'px', top:(ny+1)+'px',                    bottom:'', right:''});

        /*dom.style(this._notchBorder, {top:(ny-this._borderWidth)+'px',    bottom:'', right:''});
        dom.style(this._notchFill,   {top:(ny+1)+'px',                    bottom:'', right:''});
        this._notchBorder.style.transform = 'translateX('+nx+'px)';
        this._notchFill.style.transform = 'translateX('+nx+'px)';*/
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


Datatip.prototype._startMouseTracking = function ()
{
    this._xPos += (this._x - this._xPos) / 5;
    this._yPos += (this._y - this._yPos) / 5;
    dom.style(this._tip, {left:this._xPos+'px', top:this._yPos+'px'});

    var me = this;
    this._mouseTracking = window.requestAnimationFrame(function ()
    {
        me._startMouseTracking();
    });
};

Datatip.prototype._endMouseTracking = function ()
{
    window.cancelAnimationFrame(this._mouseTracking);
    this._mouseTracking = null;
};

/** 
 * Hides the  data tip.
 * 
 * @since 0.1.0
 */
Datatip.prototype.hide = function ()
{
    this._endMouseTracking();
    dom.hide(this._tip);
};

/** 
 * Shows the data tip.
 * 
 * @since 0.1.0
 */
Datatip.prototype.show = function ()
{
    if (this._mouseTracking === null) this._startMouseTracking();
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
    var me = this;
    dom.fadeOut(this._tip, 7, delay, function()
    {  
        me._endMouseTracking();
    });
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
    if (this._mouseTracking === null) this._startMouseTracking();
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
 * Sets the color of the border.
 * 
 * @since 0.1.0
 * 
 * @param {string} color The color.
 */
Datatip.prototype.borderColor = function (color)
{
    // Border color cant be transparent because the tip shadow cuts across the notch.
    this._borderColor = colorUtil.toRGBA(color, 1);
    dom.style(this._tip, {borderColor:this._borderColor});
    this._styleNotch();
};

module.exports = Datatip;