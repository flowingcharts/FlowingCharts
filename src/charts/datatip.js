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
 * @classdesc Class for creating a data tip.
 *
 * @class
 * @alias Canvas
 * @since 0.1.0
 * @constructor
 *
 * @param {HTMLElement} container The html element that will contain the tip.
 */
function Datatip (container)
{
    this._viewportMargin        = 10;           // Margin around the viewport edge that the tip isnt allowed to overlap.

    // Tip.
    this._container             = container;    // Tip container.
    this._pos                   = 'top';        // Tip position.
    this._backgroundColor       = '#fafafa';    // Tip background color.
    this._borderColor           = '#666666';    // Tip border color.
    this._borderWidth           = 1;            // Tip border width.
    this._tipOpacity            = 1;            // Tip opacity.
    this._isVisible             = false;        // Is the tip visible?

    // Notch.
    this._includeNotch          = true;
    this._minNotchSize          = 8;            // Minimum notch size.
    this._minNotchDistToEdge    = 5;            // Minimum distance the notch is allowed from the edge of the tip.
    this._wNotch                = 0;            // Notch width.
    this._hNotch                = 0;            // Notch height.

    // Fade in / out.
    this._fadeInterval          = null;         // The id of the setInterval() function that fades out the tip.
    this._fadeOutDelay          = null;         // The id of the setTimeout() function that provides a delay before the tip fades out.

    // Animation.
    this._animationId           = null;         // The id of the requestAnimation() function that moves the tip. 
    this._speed                 = 0.01;         // The speed of the animation. A value between 0 and 1 that controls the speed of the animation.
    this._speedIncr             = 0.05;         // Increases the animation speed so that it remains more constant and smooth as gaps between start and end points get smaller.
    this._xTipStart             = 0;            // The starting x position for the tip when its position is changed using animation.
    this._yTipStart             = 0;            // The starting y position for the tip when its position is changed using animation.
    this._xTipEnd               = 0;            // The end x position for the tip when its position is changed using animation.
    this._yTipEnd               = 0;            // The end y position for the tip when its position is changed using animation.
    this._xNotchStart           = 0;            // The starting x position for the notch when its position is changed using animation.
    this._yNotchStart           = 0;            // The starting y position for the notch when its position is changed using animation.
    this._xNotchEnd             = 0;            // The end x position for the notch when its position is changed using animation.
    this._yNotchEnd             = 0;            // The end y position for the notch when its position is changed using animation.

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
        borderRadius            : '2px', 
        fontFamily              : 'arial,serif', 
        fontSize                : '12px', 
        color                   : '#666666', 
        padding                 : '7px', 
        background              : this._backgroundColor,     
        boxShadow               : '1px 1px 1px 0px rgba(200,200,200,1)'
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

    // Hide the tip.
    this.hide();
}

/** 
 * Position the data tip using absolute positioning.
 *
 * @since 0.1.0
 *
 * @param {number} x            The absolute x position of the data tip relative to its container.
 * @param {number} y            The absolute y position of the data tip relative to its container.
 * @param {number} [pos = top]  The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right.
 */
Datatip.prototype.position = function (x, y, pos)
{
    this._pos = pos !== undefined ? pos : 'top';

    // Get the tip dimensions relative to the viewport.
    var bContainer = dom.bounds(this._container);
    var bTip       = dom.bounds(this._tip);

    // Style the notch so we can get use its dimensions for calculations.
    this._styleNotch();

    // Change the pos if the tip and notch cant be drawn sensibly using the defined pos.
    var xDistFromNotchToEdge, yDistFromNotchToEdge, tipOverlapTopEdge, tipOverlapBottomEdge, tipOverlapLeftEdge, tipOverlapRightEdge;
    if (this._pos === 'top' || this._pos === 'bottom')
    {
        xDistFromNotchToEdge        = (this._wNotch / 2) + this._minNotchDistToEdge + this._borderWidth + this._viewportMargin;
        var totalTipHeight          = this._hNotch + bTip.height + this._viewportMargin;

        var notchOverlapLeftEdge    = xDistFromNotchToEdge - (bContainer.left + x);
        var notchOverlapRightEdge   = (bContainer.left + x) - (dom.viewportWidth() - xDistFromNotchToEdge);

        if      (notchOverlapLeftEdge > 0)  this._pos = 'right';    // x is in the left viewport margin.
        else if (notchOverlapRightEdge > 0) this._pos = 'left';     // x is in the right viewport margin. 
        else if (totalTipHeight > (dom.viewportHeight() / 2))       // Tooltip is too high for both top and bottom so pick side with most space.
        {
            if ((bContainer.top + y) < (dom.viewportHeight() / 2)) this._pos = 'bottom';
            else                                                   this._pos = 'top';
        }
        else
        {
            tipOverlapTopEdge      = totalTipHeight - (bContainer.top + y);
            tipOverlapBottomEdge   = (bContainer.top + y) - (dom.viewportHeight() - totalTipHeight);

            if (tipOverlapTopEdge > 0)    this._pos = 'bottom';     // The tip is overlapping the top viewport margin.
            if (tipOverlapBottomEdge > 0) this._pos = 'top';        // The tip is overlapping the bottom viewport margin.
        }
    }
    else if (this._pos === 'left' || this._pos === 'right')
    {
        yDistFromNotchToEdge        = (this._hNotch / 2) + this._minNotchDistToEdge + this._borderWidth + this._viewportMargin;
        var totalTipWidth           = this._wNotch + bTip.width + this._viewportMargin;

        var notchOverlapTopEdge     = yDistFromNotchToEdge - (bContainer.top + y);
        var notchOverlapBottomEdge  = (bContainer.top + y) - (dom.viewportHeight() - yDistFromNotchToEdge);

        if      (notchOverlapTopEdge > 0)    this._pos = 'bottom';  // y is in the top viewport margin.
        else if (notchOverlapBottomEdge > 0) this._pos = 'top';     // y is in the bottom viewport margin. 
        else if (totalTipWidth > (dom.viewportWidth() / 2))         // Tooltip is too wide for both left and right so pick side with most space.
        {
            if ((bContainer.left + x) < (dom.viewportWidth() / 2)) this._pos = 'right';
            else                                                   this._pos = 'left';
        }
        else
        {
            tipOverlapLeftEdge      = totalTipWidth - (bContainer.left + x);
            tipOverlapRightEdge     = (bContainer.left + x) - (dom.viewportWidth() - totalTipWidth);

            if (tipOverlapLeftEdge > 0)  this._pos = 'right';       // The tip is overlapping the left viewport margin.
            if (tipOverlapRightEdge > 0) this._pos = 'left';        // The tip is overlapping the right viewport margin.
        }
    }

    // Style the notch a second time as its position may well have changed.
    this._styleNotch();

    // Adjust the tip xy so that its centred on the notch.
    var xTip, yTip;
    if (this._pos === 'top')   
    {
        xTip = x - (bTip.width / 2);
        yTip = y - (bTip.height + this._hNotch);
    } 
    else if (this._pos === 'bottom')   
    {
        xTip = x - (bTip.width / 2);
        yTip = y + this._hNotch;
    }
    else if (this._pos === 'left')   
    {
        xTip = x - (bTip.width + this._wNotch);
        yTip = y - (bTip.height / 2);
    }
    else if (this._pos === 'right')   
    {
        xTip = x + this._wNotch;
        yTip = y - (bTip.height / 2);
    }

    // Adjust the tip xy if its overlapping the viewport margin.
    if (this._pos === 'top' || this._pos === 'bottom')
    {
        // The tip width is greater than viewport width so just anchor the tip to the side that the notch is on.
        if (bTip.width > dom.viewportWidth()) 
        {
            if ((bContainer.left + x) < (dom.viewportWidth() / 2)) xTip = this._viewportMargin - bContainer.left;
            else                                                   xTip = dom.viewportWidth() - bContainer.left - this._viewportMargin - bTip.width;
        }
        else
        {
            tipOverlapRightEdge = (bContainer.left + xTip + bTip.width) - (dom.viewportWidth() - this._viewportMargin);
            tipOverlapLeftEdge  = this._viewportMargin - (bContainer.left + xTip);

            if      (tipOverlapRightEdge > 0) xTip -= tipOverlapRightEdge;  // The tip is overlapping the right viewport margin.
            else if (tipOverlapLeftEdge > 0)  xTip += tipOverlapLeftEdge;   // The tip is overlapping the left viewport margin.
        }
    }
    else if (this._pos === 'left' || this._pos === 'right')
    {
        // The tip is height is greater than viewport height so just anchor the tip to the side that the notch is on.
        if (bTip.height > dom.viewportHeight()) 
        {
            if ((bContainer.top + y) < (dom.viewportHeight() / 2)) yTip = this._viewportMargin - bContainer.top;
            else                                                   yTip = dom.viewportHeight() - bContainer.top - this._viewportMargin - bTip.height;
        } 
        else
        {
            tipOverlapBottomEdge = (bContainer.top + yTip + bTip.height) - (dom.viewportHeight() - this._viewportMargin);
            tipOverlapTopEdge    = this._viewportMargin - (bContainer.top + yTip);

            if      (tipOverlapBottomEdge > 0) yTip -= tipOverlapBottomEdge; // The tip is overlapping the bottom viewport margin.
            else if (tipOverlapTopEdge > 0)    yTip += tipOverlapTopEdge;    // The tip is overlapping the top viewport margin.
        }
    } 

    // Position the tip and notch.
    this._xTipEnd   = xTip;
    this._yTipEnd   = yTip;
    this._xNotchEnd = x - xTip;
    this._yNotchEnd = y - yTip;

    // Hide notch if its strayed beyond the edge of the tip ie when the xy coords are in the corners of the viewport.
    if (this._pos === 'top' || this._pos === 'bottom')
    {
        xDistFromNotchToEdge = (this._wNotch / 2) + this._borderWidth;
        if ((this._xNotchEnd < xDistFromNotchToEdge) || (this._xNotchEnd > (bTip.width - xDistFromNotchToEdge))) this._hideNotch();
    }
    else if (this._pos === 'left' || this._pos === 'right')
    {
        yDistFromNotchToEdge  = (this._hNotch / 2) + this._borderWidth;
        if ((this._yNotchEnd < yDistFromNotchToEdge) || (this._yNotchEnd > (bTip.height - yDistFromNotchToEdge))) this._hideNotch();
    } 

    dom.cancelAnimation(this._animationId);
    this._moveTip(this._speed);
};

/** 
 * Moves the tip using animation.
 * 
 * @since 0.1.0
 * @private
 *
 * @param {number} speed A value between 0 and 1 that controls the speed of the animation.
 */
Datatip.prototype._moveTip = function (speed)
{
    window.console.log(speed);
    // Flag to indicate whether animation is complete.
    // Tests for completion of both tip and notch animations.
    var continueAnimation = false;

    var snapToPoint = 5;

    // Position the tip. Test for within snapToPoint of end point.
    if ((Math.abs(this._xTipEnd - this._xTipStart) < snapToPoint) && (Math.abs(this._yTipEnd - this._yTipStart) < snapToPoint))
    {
        this._xTipStart = this._xTipEnd;
        this._yTipStart = this._yTipEnd;
    }
    else
    {
        this._xTipStart += (this._xTipEnd - this._xTipStart) * speed;
        this._yTipStart += (this._yTipEnd - this._yTipStart) * speed;
        continueAnimation = true;
    }
    this._positionTip(this._xTipStart, this._yTipStart);

    // Position the notch. Test for within snapToPoint of end point.
    if ((Math.abs(this._xNotchEnd - this._xNotchStart) < snapToPoint) && (Math.abs(this._yNotchEnd - this._yNotchStart) < snapToPoint))
    {
        this._xNotchStart = this._xNotchEnd;
        this._yNotchStart = this._yNotchEnd;
    }
    else
    {
        this._xNotchStart += (this._xNotchEnd - this._xNotchStart) * speed;
        this._yNotchStart += (this._yNotchEnd - this._yNotchStart) * speed;
        continueAnimation = true;
    }
    this._positionNotch(this._xNotchStart, this._yNotchStart);
        
    // Continue animation until both tip and notch are within one pixel of end point.
    if (continueAnimation) 
    {
        var me = this;
        this._animationId = dom.requestAnimation(function () {me._moveTip(speed += me._speedIncr);});
    }
};

/** 
 * Positions the tip.
 * 
 * @since 0.1.0
 * @private
 * 
 * @param {number} x The x position.
 * @param {number} y The y position.
 */
Datatip.prototype._positionTip = function (x, y)
{
    dom.style(this._tip, {left:x+'px', top:y+'px'});
};

/** 
 * Positions the notch.
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
    var bTip     = dom.bounds(this._tip);
    var bNotch   = dom.bounds(this._notchBorder);
    this._wNotch = bNotch.width;
    this._hNotch = bNotch.height;

    // Hide notch if its bigger than the tip.
    if  (((this._pos === 'left' || this._pos === 'right') && ((this._hNotch + (this._minNotchDistToEdge * 2) + (this._borderWidth * 2)) > bTip.height)) || 
         ((this._pos === 'top' || this._pos === 'bottom') && ((this._wNotch + (this._minNotchDistToEdge * 2) + (this._borderWidth * 2))  > bTip.width)))
    {
        this._hideNotch();
    }
};

/** 
 * Hide the notch.
 * 
 * @since 0.1.0
 * @private
 */
Datatip.prototype._hideNotch = function ()
{
    dom.style(this._notchBorder, {borderTop:'0px', borderRight:'0px', borderBottom:'0px', borderLeft:'0px'});
    dom.style(this._notchFill,   {borderTop:'0px', borderRight:'0px', borderBottom:'0px', borderLeft:'0px'});
    this._wNotch = 0;
    this._hNotch = 0;
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
    dom.opacity(this._tip, 1);
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
    dom.opacity(this._tip, 0);
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
            dom.opacity(me._tip, me._tipOpacity);
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