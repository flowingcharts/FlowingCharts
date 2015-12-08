/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview Exports the {@link PathItem} class.
 * @author Jonathan Clare 
 * @copyright FlowingCharts 2015
 * @module geom/PathItem 
 * @requires utils/util
 */

// Required modules.
var CanvasItem  = require('./CanvasItem');
var util        = require('../utils/util');
var extendClass = util.extendClass;

/** 
 * @classdesc An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * 
 * @class
 * @alias PathItem
 * @augments CanvasItem
 * @since 0.1.0
 * @constructor
 *
 * @param {string} type The path type.
 * @param {number[]} points An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 */
function PathItem (type, points)
{
    PathItem.baseConstructor.call(this, type);

    // Private instance members.
    this._points = []; 

    this.points(this._points);
}
extendClass(CanvasItem, PathItem);

/** 
 * Get or set the xy positions.
 *
 * @since 0.1.0
 * @param {number[]} arrCoords An array of xy positions of the form [x1, y1, x2, y2, x3, y3, x4, y4...].
 * @return {number|PathItem} The xy positions if no arguments are supplied, otherwise <code>this</code>.
 */
PathItem.prototype.points = function (arrCoords)
{
    if (arguments.length > 0)
    {
        this._points = arrCoords.concat();
        return this;
    }
    else return this._points;
};

module.exports = PathItem;