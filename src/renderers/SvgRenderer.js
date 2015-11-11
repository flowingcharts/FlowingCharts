/* jshint browserify: true */
'use strict';

/**
 * @fileoverview Contains the SvgRenderer class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module renderers/SvgRenderer 
 */

// Required modules.
var util = require('../util');
var appendTo = util.appendTo;

// Namespace for SVG elements.
var svgNS = "http://www.w3.org/2000/svg"; 

/** 
 * @class A wrapper class for rendering to SVG.
 *
 * @since 0.1.0
 * @author J Clare
 * @constructor
 *
 * @requires util.appendTo
 *
 * @param {Object} [options] The options.
 * @param {HTMLElement} [options.container] The html element that will contain the renderer.
 */
function SvgRenderer (options)
{
    options = options !== undefined ? options : {};

    this._svg = document.createElementNS(svgNS, 'svg');
    appendTo(this._svg, options.container, options.onResize);
}

SvgRenderer.prototype = 
{
    // Private variables.
    _svg : null,            // The svg element.
    _style : {},            // Contains the rendering styles.
    _svgElement : null,     // The svg element that is part of the current drawing routine.


    /** 
     * Clears the svg.
     *
     * @since 0.1.0
     * @return {SvgRenderer} <code>this</code>.
     */
    clear : function ()
    {
        while (this._svg.firstChild) 
        {
            this._svg.removeChild(this._svg.firstChild);
        }
        return this;
    },

    /** 
     * Draws a solid shape by filling the path's content area.
     *
     * @since 0.1.0
     * @return {SvgRenderer} <code>this</code>.
     */
    fill : function ()
    {
        if (this._style.fillColor !== undefined)    this._svgElement.setAttribute('fill', this._style.fillColor);
        if (this._style.fillOpacity !== undefined)  this._svgElement.setAttribute('fill-opacity', this._style.fillOpacity);
        return this;
    },

    /** 
     * Draws the shape by stroking its outline.
     *
     * @since 0.1.0
     * @return {SvgRenderer} <code>this</code>.
     */
    stroke : function ()
    {
        if (this._style.lineColor !== undefined)    this._svgElement.setAttribute('stroke', this._style.lineColor);
        if (this._style.lineWidth !== undefined)    this._svgElement.setAttribute('stroke-width', this._style.lineWidth);
        if (this._style.lineJoin !== undefined)     this._svgElement.setAttribute('stroke-linejoin', this._style.lineJoin);
        if (this._style.lineCap !== undefined)      this._svgElement.setAttribute('stroke-linecap', this._style.lineCap);
        if (this._style.lineOpacity !== undefined)  this._svgElement.setAttribute('stroke-opacity', this._style.lineOpacity);
        return this;
    },

    /** 
     * Defines the fill style.
     *
     * @since 0.1.0
     * @param {string} [color] The fill color.
     * @param {number} [opacity] The fill opacity.
     * @return {SvgRenderer} <code>this</code>.
     */
    fillStyle : function (color, opacity)
    {
        if (color !== undefined)    this._style.fillColor = color;
        if (opacity !== undefined)  this._style.fillOpacity = opacity;
        return this;
    },

    /** 
     * Defines the line style.
     *
     * @since 0.1.0
     * @param {string} [color] The line color.
     * @param {number} [thickness] The line thickness.
     * @param {string} [join] The line join.
     * @param {string} [cap] The line cap.
     * @param {number} [opacity] The line opacity.
     * @return {SvgRenderer} <code>this</code>.
     */
    strokeStyle : function (color, thickness, join, cap, opacity)
    {
        if (color !== undefined)     this._style.lineColor = color;
        if (thickness !== undefined) this._style.lineWidth = thickness;
        if (join !== undefined)      this._style.lineJoin = join;
        if (cap !== undefined)       this._style.lineCap = cap;
        if (opacity !== undefined)   this._style.lineOpacity = opacity;
        return this;
    },

    /** 
     * Draws a rectangle.
     *
     * @since 0.1.0
     * @param {number} x The x-coord of the top left corner.
     * @param {number} y The y coord of the top left corner.
     * @param {number} w The width.
     * @param {number} h The height.
     * @return {SvgRenderer} <code>this</code>.
     */
    rect : function (x, y, w, h)
    {
        var svgRect = document.createElementNS(svgNS, 'rect');
        svgRect.setAttribute('x', x);
        svgRect.setAttribute('y', y);
        svgRect.setAttribute('width', w);
        svgRect.setAttribute('height', h);
        this._svg.appendChild(svgRect);
        this._svgElement = svgRect;
        return this;
    },

    /** 
     * Draws a circle.
     *
     * @since 0.1.0
     * @param {number} cx The x-coord of the centre of the circle.
     * @param {number} cy The y-coord of the centre of the circle.
     * @param {number} r The circle radius.
     * @return {SvgRenderer} <code>this</code>.
     */
    circle : function (cx, cy, r)
    {
        var svgCircle = document.createElementNS(svgNS, 'circle');
        svgCircle.setAttribute('cx', cx);
        svgCircle.setAttribute('cy', cy);
        svgCircle.setAttribute('r', r);
        this._svg.appendChild(svgCircle);
        this._svgElement = svgCircle;
        return this;
    }
};

module.exports = SvgRenderer;