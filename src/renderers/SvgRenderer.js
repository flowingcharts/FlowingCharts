/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Exports the {@link SvgRenderer} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/SvgRenderer 
 * @requires renderers/Renderer
 * @requires util
 */

// Required modules.
var Renderer = require('./Renderer');
var util = require('../util');
var extendClass = util.extendClass;
var extendObject = util.extendObject;
var appendTo = util.appendTo;

// Namespace for SVG elements.
var svgNS = "http://www.w3.org/2000/svg";  

/** 
 * @classdesc A wrapper class for rendering to a HTML5 canvas.
 *
 * @class
 * @alias SvgRenderer
 * @augments Renderer
 * @since 0.1.0
 * @author J Clare
  *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer.
 */
function SvgRenderer (options)
{
    SvgRenderer.baseConstructor.call(this, options);

    this.canvas = document.createElementNS(svgNS, 'svg');
    appendTo(this.canvas, options.container, options.onResize);
}
extendClass(Renderer, SvgRenderer);

extendObject(SvgRenderer.prototype, /** @lends SvgRenderer.prototype  */
{
    // Private variables.
    _svgElement : null,     // The svg element that is part of the current drawing routine.

    /** 
     * @inheritdoc
     */
    clear : function ()
    {
        while (this.canvas.firstChild) 
        {
            this.canvas.removeChild(this.canvas.firstChild);
        }
        return this;
    },

    /** 
     * @inheritdoc
     */
    fill : function (options)
    {
        this.startFill(options);

        this._svgElement.setAttribute('fill', this.fillColor());
        this._svgElement.setAttribute('fill-opacity', this.fillOpacity());

        this.endFill();
        return this;
    },

    /** 
     * @inheritdoc
     */
    stroke : function (options)
    {
        this.startStroke(options);

        window.console.log(this.lineWidth());

        this._svgElement.setAttribute('stroke', this.lineColor());
        this._svgElement.setAttribute('stroke-width', this.lineWidth());
        this._svgElement.setAttribute('stroke-linejoin', this.lineJoin());
        this._svgElement.setAttribute('stroke-linecap', this.lineCap());
        this._svgElement.setAttribute('stroke-opacity', this.lineOpacity());

        this.endStroke();
        return this;
    },

    /** 
     * @inheritdoc
     */
    rect : function (x, y, w, h)
    {
        var svgRect = document.createElementNS(svgNS, 'rect');
        svgRect.setAttribute('x', x);
        svgRect.setAttribute('y', y);
        svgRect.setAttribute('width', w);
        svgRect.setAttribute('height', h);
        this.canvas.appendChild(svgRect);
        this._svgElement = svgRect;
        return this;
    },

    /** 
     * @inheritdoc
     */
    circle : function (cx, cy, r)
    {
        var svgCircle = document.createElementNS(svgNS, 'circle');
        svgCircle.setAttribute('cx', cx);
        svgCircle.setAttribute('cy', cy);
        svgCircle.setAttribute('r', r);
        this.canvas.appendChild(svgCircle);
        this._svgElement = svgCircle;
        return this;
    }
});

module.exports = SvgRenderer;