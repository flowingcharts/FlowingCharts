/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link Datatip} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          datatip 
 * @requires        utils/dom
 * @requires        utils/util
 * @requires        utils/animate
 */

// Required modules.
var dom       = require('../utils/dom');
var util      = require('../utils/util');
var animate   = require('../utils/animate');

/** 
 * @classdesc Class for creating a tip.
 *
 * @class
 * @alias Datatip
 * @since 0.1.0
 * @constructor
 *
 * @param {HTMLElement} container The html element that will contain the tip.
 * @param {Object}      [options] The tip options. See [options]{@link Datatip#options} for properties.
 */
function Datatip (container, options)
{
    // Default options.
    this._options = 
    {
        viewportMargin          : 10,
        placement               : 'top',
        padding                 : 10,
        fontFamily              : 'arial',
        fontSize                : 14,
        fontColor               : '#666666',
        backgroundColor         : '#fafafa',
        borderStyle             : 'solid',
        borderColor             : '#666666',
        borderWidth             : 1,
        borderRadius            : 5,
        hideShadow              : false,
        notchSize               : 8,
        notchPadding            : 5,
        hideNotch               : false,
        followMouse             : false,
        useAnimation            : true,
        speed                   : 0.01,
        speedIncr               : 0.05,
        snapDistance            : 5,
        fadeOutDelay            : 1000,
    };   

    // Tip.
    this._container             = container;    // Tip container.
    this._tipOpacity            = 1;            // Tip opacity.

    // Animation.
    this._fadeOutDelay          = null;         // The id of the setTimeout() function that provides a delay before the tip fades out.
    this._fadeOutId             = null;         // The id of the requestAnimation() function that fades the tip. 
    this._moveId                = null;         // The id of the requestAnimation() function that moves the tip. 
    this._xTipStart             = 0;            // The starting x position for the tip when its position is changed using animation.
    this._yTipStart             = 0;            // The starting y position for the tip when its position is changed using animation.
    this._xTipEnd               = 0;            // The end x position for the tip when its position is changed using animation.
    this._yTipEnd               = 0;            // The end y position for the tip when its position is changed using animation.
    this._xNotchStart           = 0;            // The starting x position for the notch when its position is changed using animation.
    this._yNotchStart           = 0;            // The starting y position for the notch when its position is changed using animation.
    this._xNotchEnd             = 0;            // The end x position for the notch when its position is changed using animation.
    this._yNotchEnd             = 0;            // The end y position for the notch when its position is changed using animation.

    // Create the tip.
    this._tip = dom.createElement('div');
    dom.style(this._tip, 
    {
        position                : 'absolute', 
        pointerEvents           : 'none',
        cursor                  : 'default'
    });
    dom.appendChild(this._container, this._tip);

    // Create the tip text.
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

    // Apply the options.
    this.options(options);
}

/** 
 * Get or set the options for the tip.
 *
 * @since 0.1.0
 *
 * @param {Object}      [options]                           The tip options.
 * @param {number}      [options.viewportMargin  = 10]      Margin around the viewport edge that the tip isnt allowed to overlap.
 * @param {string}      [options.placement       = top]     How to position the tip - top | bottom | left | right.
 * @param {number}      [options.padding         = 10]      Padding.
 * @param {string}      [options.fontFamily      = arial]   Font family. 
 * @param {number}      [options.fontSize        = 14]      Font size. 
 * @param {string}      [options.fontColor       = #666666] Font color. 
 * @param {string}      [options.backgroundColor = #fafafa] Background color.
 * @param {string}      [options.borderStyle     = solid]   Border style.
 * @param {string}      [options.borderColor     = #666666] Border color.
 * @param {number}      [options.borderWidth     = 1]       Border width.
 * @param {number}      [options.borderRadius    = 5]       Border radius.
 * @param {boolean}     [options.hideShadow      = false]   Hide shadow.
 * @param {number}      [options.notchSize       = 8]       Notch size.
 * @param {number}      [options.notchPadding    = 5]       Padding between notch and edge of tip.
 * @param {boolean}     [options.hideNotch       = false]   Hide notch.
 * @param {boolean}     [options.followMouse     = false]   Should the tip follow the mouse.
 * @param {boolean}     [options.useAnimation    = true]    Should the tip movement be animated.
 * @param {number}      [options.speed           = 0.01]    The speed of the animation. A value between 0 and 1 that controls the speed of the animation.
 * @param {number}      [options.speedIncr       = 0.05]    Increments the animation speed so that it remains more constant and smooth as gaps between start and end points get smaller.
 * @param {number}      [options.snapDistance    = 5]       The distance (in pixels) away from a given xy position at which the tip will snap to a point.
 * @param {number}      [options.fadeOutDelay    = 1000]    The delay (in milliseconds) before the fade out animation is run.
 *
 * @return {Object|Datatip} The options if no arguments are supplied, otherwise <code>this</code>.
 */
Datatip.prototype.options = function(options)
{
    if (arguments.length > 0)
    {
        // Extend default options with passed in options.
        util.extendObject(this._options, options);

        // Style the tip.
        dom.style(this._tip, 
        {
            position        : 'absolute', 
            pointerEvents   : 'none',
            cursor          : 'default',
            borderStyle     : this._options.borderStyle,
            borderWidth     : this._options.borderWidth+'px',
            borderColor     : this._options.borderColor, 
            borderRadius    : this._options.borderRadius+'px', 
            fontFamily      : this._options.fontFamily, 
            fontSize        : this._options.fontSize+'px', 
            color           : this._options.fontColor, 
            padding         : this._options.padding+'px',
            background      : this._options.backgroundColor,     
            boxShadow       : '0 5px 10px rgba(0, 0, 0, .2)'
        });

        return this;
    }
    else return this._options;
};

/** 
 * Position the tip using absolute positioning.
 *
 * @since 0.1.0
 *
 * @param {number} x The absolute x position of the tip relative to its container.
 * @param {number} y The absolute y position of the tip relative to its container.
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.position = function (x, y)
{
    var placement = this._options.placement;

    // Get the tip dimensions relative to the viewport.
    var bContainer = dom.bounds(this._container);
    var bTip       = dom.bounds(this._tip);

    var bNotch = {};
    bNotch.width = 0;
    bNotch.height = 0;
    if (this._options.hideNotch === false) 
    {
        // Style the notch so we can get use its dimensions for calculations.
        this._styleNotch(placement);

        // Hide notch if its bigger than the tip.
        bNotch = dom.bounds(this._notchBorder);
        if  (((placement === 'left' || placement === 'right') && ((bNotch.height + (this._options.notchPadding * 2) + (this._options.borderWidth * 2)) > bTip.height)) || 
             ((placement === 'top' || placement === 'bottom') && ((bNotch.width + (this._options.notchPadding * 2) + (this._options.borderWidth * 2))  > bTip.width)))
        {
            this._hideNotch();
        }
    }

    // Change the placement if the tip cant be drawn sensibly using the defined placement.
    var xDistFromNotchToEdge, yDistFromNotchToEdge, tipOverlapTopEdge, tipOverlapBottomEdge, tipOverlapLeftEdge, tipOverlapRightEdge;
    if (placement === 'top' || placement === 'bottom')
    {
        xDistFromNotchToEdge        = (bNotch.width / 2) + this._options.notchPadding + this._options.borderWidth + this._options.viewportMargin;
        var totalTipHeight          = bNotch.height + bTip.height + this._options.viewportMargin;

        var notchOverlapLeftEdge    = xDistFromNotchToEdge - (bContainer.left + x);
        var notchOverlapRightEdge   = (bContainer.left + x) - (dom.viewportWidth() - xDistFromNotchToEdge);

        if      (notchOverlapLeftEdge > 0)  placement = 'right';    // x is in the left viewport margin.
        else if (notchOverlapRightEdge > 0) placement = 'left';     // x is in the right viewport margin. 
        else if (totalTipHeight > (dom.viewportHeight() / 2))       // Tooltip is too high for both top and bottom so pick side of y with most space.
        {
            if ((bContainer.top + y) < (dom.viewportHeight() / 2)) placement = 'bottom';
            else                                                   placement = 'top';
        }
        else
        {
            tipOverlapTopEdge      = totalTipHeight - (bContainer.top + y);
            tipOverlapBottomEdge   = (bContainer.top + y) - (dom.viewportHeight() - totalTipHeight);

            if (tipOverlapTopEdge > 0)    placement = 'bottom';     // The tip is overlapping the top viewport margin.
            if (tipOverlapBottomEdge > 0) placement = 'top';        // The tip is overlapping the bottom viewport margin.
        }
    }
    else if (placement === 'left' || placement === 'right')
    {
        yDistFromNotchToEdge        = (bNotch.height / 2) + this._options.notchPadding + this._options.borderWidth + this._options.viewportMargin;
        var totalTipWidth           = bNotch.width + bTip.width + this._options.viewportMargin;

        var notchOverlapTopEdge     = yDistFromNotchToEdge - (bContainer.top + y);
        var notchOverlapBottomEdge  = (bContainer.top + y) - (dom.viewportHeight() - yDistFromNotchToEdge);

        if      (notchOverlapTopEdge > 0)    placement = 'bottom';  // y is in the top viewport margin.
        else if (notchOverlapBottomEdge > 0) placement = 'top';     // y is in the bottom viewport margin. 
        else if (totalTipWidth > (dom.viewportWidth() / 2))         // Tooltip is too wide for both left and right so pick side of x with most space.
        {
            if ((bContainer.left + x) < (dom.viewportWidth() / 2)) placement = 'right';
            else                                                   placement = 'left';
        }
        else
        {
            tipOverlapLeftEdge      = totalTipWidth - (bContainer.left + x);
            tipOverlapRightEdge     = (bContainer.left + x) - (dom.viewportWidth() - totalTipWidth);

            if (tipOverlapLeftEdge > 0)  placement = 'right';       // The tip is overlapping the left viewport margin.
            if (tipOverlapRightEdge > 0) placement = 'left';        // The tip is overlapping the right viewport margin.
        }
    }

    // Style the notch a second time as its placement may well have changed due to above code.
    if (this._options.hideNotch === false) 
    {
        // Style the notch so we can get use its dimensions for calculations.
        this._styleNotch(placement);

        // Hide notch if its bigger than the tip.
        bNotch = dom.bounds(this._notchBorder);
        if  (((placement === 'left' || placement === 'right') && ((bNotch.height + (this._options.notchPadding * 2) + (this._options.borderWidth * 2)) > bTip.height)) || 
             ((placement === 'top' || placement === 'bottom') && ((bNotch.width + (this._options.notchPadding * 2) + (this._options.borderWidth * 2))  > bTip.width)))
        {
            this._hideNotch();
        }
    }

    // Adjust the tip bubble so that its centered on the notch.
    var xTip, yTip;
    if (placement === 'top')   
    {
        xTip = x - (bTip.width / 2);
        yTip = y - (bTip.height + bNotch.height);
    } 
    else if (placement === 'bottom')   
    {
        xTip = x - (bTip.width / 2);
        yTip = y + bNotch.height;
    }
    else if (placement === 'left')   
    {
        xTip = x - (bTip.width + bNotch.width);
        yTip = y - (bTip.height / 2);
    }
    else if (placement === 'right')   
    {
        xTip = x + bNotch.width;
        yTip = y - (bTip.height / 2);
    }

    // Adjust the tip bubble if its overlapping the viewport margin.
    if (placement === 'top' || placement === 'bottom')
    {
        // The tip width is greater than viewport width so just anchor the tip to the side that the notch is on.
        if (bTip.width > dom.viewportWidth()) 
        {
            if ((bContainer.left + x) < (dom.viewportWidth() / 2)) xTip = this._options.viewportMargin - bContainer.left;
            else                                                   xTip = dom.viewportWidth() - bContainer.left - this._options.viewportMargin - bTip.width;
        }
        else
        {
            tipOverlapRightEdge = (bContainer.left + xTip + bTip.width) - (dom.viewportWidth() - this._options.viewportMargin);
            tipOverlapLeftEdge  = this._options.viewportMargin - (bContainer.left + xTip);

            if      (tipOverlapRightEdge > 0) xTip -= tipOverlapRightEdge;  // The tip is overlapping the right viewport margin.
            else if (tipOverlapLeftEdge > 0)  xTip += tipOverlapLeftEdge;   // The tip is overlapping the left viewport margin.
        }
    }
    else if (placement === 'left' || placement === 'right')
    {
        // The tip height is greater than viewport height so just anchor the tip to the side that the notch is on.
        if (bTip.height > dom.viewportHeight()) 
        {
            if ((bContainer.top + y) < (dom.viewportHeight() / 2)) yTip = this._options.viewportMargin - bContainer.top;
            else                                                   yTip = dom.viewportHeight() - bContainer.top - this._options.viewportMargin - bTip.height;
        } 
        else
        {
            tipOverlapBottomEdge = (bContainer.top + yTip + bTip.height) - (dom.viewportHeight() - this._options.viewportMargin);
            tipOverlapTopEdge    = this._options.viewportMargin - (bContainer.top + yTip);

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
    if (placement === 'top' || placement === 'bottom')
    {
        xDistFromNotchToEdge = (bNotch.width / 2) + this._options.borderWidth;
        if ((this._xNotchEnd < xDistFromNotchToEdge) || (this._xNotchEnd > (bTip.width - xDistFromNotchToEdge))) this._hideNotch();
    }
    else if (placement === 'left' || placement === 'right')
    {
        yDistFromNotchToEdge  = (bNotch.height / 2) + this._options.borderWidth;
        if ((this._yNotchEnd < yDistFromNotchToEdge) || (this._yNotchEnd > (bTip.height - yDistFromNotchToEdge))) this._hideNotch();
    } 

    animate.cancelAnimation(this._moveId);

    if (this._options.useAnimation) this._animatePosition(this._options.speed, placement);
    else
    {
        this._positionTip(this._xTipEnd, this._yTipEnd);
        this._positionNotch(this._xNotchEnd, this._yNotchEnd, placement);
    }

    return this;
};

/** 
 * Moves the tip using animation.
 * 
 * @since 0.1.0
 * @private
 *
 * @param {number} speed    A value between 0 and 1 that controls the speed of the animation.
 * @param {string} placement The preferred placement of the tip relative to the x and y coords - one of top, bottom, left or right.
 */
Datatip.prototype._animatePosition = function (speed, placement)
{
    // Flag to indicate whether animation is complete.
    // Tests for completion of both tip and notch animations.
    var continueAnimation = false;

    // Position the tip. Test for within snapDistance of end point.
    if ((Math.abs(this._xTipEnd - this._xTipStart) <= this._options.snapDistance) && (Math.abs(this._yTipEnd - this._yTipStart) <= this._options.snapDistance))
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

    // Position the notch. Test for within snapDistance of end point.
    if ((Math.abs(this._xNotchEnd - this._xNotchStart) <= this._options.snapDistance) && (Math.abs(this._yNotchEnd - this._yNotchStart) <= this._options.snapDistance))
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
    this._positionNotch(this._xNotchStart, this._yNotchStart, placement);
        
    // Continue animation until both tip and notch are within one pixel of end point.
    if (continueAnimation) 
    {
        var me = this;
        this._moveId = animate.requestAnimation(function () {me._animatePosition(speed += me._options.speedIncr, placement);});
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
 * @param {number} x            The x position of the notch.
 * @param {number} y            The y position of the notch.
 * @param {string} placement    How to position the tip - top | bottom | left | right.
 */
Datatip.prototype._positionNotch = function (x, y, placement)
{
    var bNotch      = dom.bounds(this._notchBorder);
    var borderWidth = this._options.borderWidth;
    var nx, ny;
    if (placement === 'top')
    {
        nx = x - (bNotch.width / 2) - borderWidth;
        ny = bNotch.height * -1;
        dom.style(this._notchBorder, {left:nx+'px', bottom:(ny-borderWidth)+'px', top:'',    right:''});
        dom.style(this._notchFill,   {left:nx+'px', bottom:(ny+1)+'px',           top:'',    right:''});
    } 
    else if (placement === 'bottom')
    {
        nx = x - (bNotch.width / 2) - borderWidth;
        ny = bNotch.height * -1;
        dom.style(this._notchBorder, {left:nx+'px', top:(ny-borderWidth)+'px',    bottom:'', right:''});
        dom.style(this._notchFill,   {left:nx+'px', top:(ny+1)+'px',              bottom:'', right:''});
    }
    else if (placement === 'left')
    {
        ny = y - (bNotch.height / 2) - borderWidth;
        nx = bNotch.width * -1;
        dom.style(this._notchBorder, {top:ny+'px',  right:(nx-borderWidth)+'px',  bottom:'', left:''});
        dom.style(this._notchFill,   {top:ny+'px',  right:(nx+1)+'px',            bottom:'', left:''});
    }
    else if (placement === 'right')
    {
        ny = y - (bNotch.height / 2) - borderWidth;
        nx = bNotch.width * -1;
        dom.style(this._notchBorder, {top:ny+'px',  left:(nx-borderWidth)+'px',   bottom:'', right:''});
        dom.style(this._notchFill,   {top:ny+'px',  left:(nx+1)+'px',             bottom:'', right:''});
    }
};

/** 
 * Styles the notch depending on its placement.
 * 
 * @since 0.1.0
 * @private
 *
 * @param {string} placement How to position the tip - top | bottom | left | right.
 */
Datatip.prototype._styleNotch = function (placement)
{
    // Notch style uses css border trick.
    var nSize   = Math.max(this._options.notchSize, this._options.borderWidth);
    var nBorder = nSize+'px solid '+this._options.borderColor;
    var nFill   = nSize+'px solid '+this._options.backgroundColor;
    var nTrans  = nSize+'px solid transparent';

    if (placement === 'top')
    {
        dom.style(this._notchBorder, {borderTop:nBorder,    borderRight:nTrans, borderLeft:nTrans,   borderBottom:'0px'});
        dom.style(this._notchFill,   {borderTop:nFill,      borderRight:nTrans, borderLeft:nTrans,   borderBottom:'0px'});
    }
    else if (placement === 'bottom')
    {
        dom.style(this._notchBorder, {borderBottom:nBorder, borderRight:nTrans, borderLeft:nTrans,   borderTop:'0px'});
        dom.style(this._notchFill,   {borderBottom:nFill,   borderRight:nTrans, borderLeft:nTrans,   borderTop:'0px'});
    }
    else if (placement === 'left')
    {
        dom.style(this._notchBorder, {borderLeft:nBorder,   borderTop:nTrans,   borderBottom:nTrans, borderRight:'0px'});
        dom.style(this._notchFill,   {borderLeft:nFill,     borderTop:nTrans,   borderBottom:nTrans, borderRight:'0px'});
    }
    else if (placement === 'right')
    {
        dom.style(this._notchBorder, {borderRight:nBorder,  borderTop:nTrans,   borderBottom:nTrans, borderLeft:'0px'});
        dom.style(this._notchFill,   {borderRight:nFill,    borderTop:nTrans,   borderBottom:nTrans, borderLeft:'0px'});
    }
};

/** 
 * Hides the notch.
 * 
 * @since 0.1.0
 * @private
 */
Datatip.prototype._hideNotch = function ()
{
    dom.style(this._notchBorder, {borderTop:'0px', borderRight:'0px', borderBottom:'0px', borderLeft:'0px'});
    dom.style(this._notchFill,   {borderTop:'0px', borderRight:'0px', borderBottom:'0px', borderLeft:'0px'});
};

/** 
 * Sets the html for the tip.
 * 
 * @since 0.1.0
 * 
 * @param {string} html The html.
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.html = function (text)
{
    dom.html(this._tipText, text);
    return this;
};

/** 
 * Shows the tip.
 * 
 * @since 0.1.0
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.show = function ()
{ 
    if (this._tipOpacity !== 1)
    {
        this._stopFadeOut();
        dom.show(this._tip);
        dom.opacity(this._tip, 1);
        this._tipOpacity = 1;
    }
    return this;
};

/** 
 * Hides the tip.
 * 
 * @since 0.1.0
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.hide = function ()
{
    if (this._tipOpacity !== 0)
    {
        this._stopFadeOut();
        dom.hide(this._tip);
        dom.opacity(this._tip, 0);
        this._tipOpacity = 0;
    }
    return this;
};

/** 
 * Fades out the tip.
 * 
 * @since 0.1.0
 *
 * @return {Datatip} <code>this</code>.
 */
Datatip.prototype.fadeOut = function ()
{
    var me = this;
    this._stopFadeOut();
    this._fadeOutDelay = setTimeout(function () {me._animateFadeOut();}, me._options.fadeOutDelay);
    return this;
};

/** 
 * Animates a fade out of the tip.
 * 
 * @since 0.1.0
 * @private
 */
Datatip.prototype._animateFadeOut = function ()
{
    if (this._tipOpacity <= 0.1) this.hide();
    dom.opacity(this._tip, this._tipOpacity);
    this._tipOpacity -= this._tipOpacity * 0.1;
    var me = this;
    me._fadeOutId = animate.requestAnimation(function () {me._animateFadeOut();});
};

/** 
 * Stops a fade out of the tip.
 * 
 * @since 0.1.0
 * @private
 */
Datatip.prototype._stopFadeOut = function ()
{
    clearTimeout(this._fadeOutDelay);
    animate.cancelAnimation(this._fadeOutId);
};

module.exports = Datatip;