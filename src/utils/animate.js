/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains functions for animating html elements.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          dom 
 */

// Animation polyfill.
var lastTime = 0;
var vendors  = ['ms', 'moz', 'webkit', 'o'];
var raf      = window.requestAnimationFrame;
var caf      = window.cancelAnimationFrame;
for (var x = 0; x < vendors.length && !raf; ++x) 
{
    raf = window[vendors[x]+'RequestAnimationFrame'];
    caf = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}
if (!raf)
{
    raf = function (callback, element) 
    {
        var currTime   = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id         = window.setTimeout(function () {callback(currTime + timeToCall);}, timeToCall);
        lastTime       = currTime + timeToCall;
        return id;
    };
}
if (!caf)
{
    caf = function (id) {clearTimeout(id);};
}

/** 
 * Request animation.
 *
 * @since 0.1.0
 *
 * @param {Function} callback Function to call when it's time to update your animation for the next repaint
 *
 * @return {number} The request id, that uniquely identifies the entry in the callback list.
 */
var requestAnimation = function (callback)
{
    return raf(callback);
};

/** 
 * Cancel animation.
 *
 * @since 0.1.0
 *
 * @param {number} id The id value returned by the call to requestAnimation() that requested the callback.
 */
var cancelAnimation = function (id)
{
    caf(id);
};

module.exports = 
{
    requestAnimation        : requestAnimation,
    cancelAnimation         : cancelAnimation
};