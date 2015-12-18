/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Exports the {@link EventHandler} class.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          charts/EventHandler 
 * @requires        utils/dom
 */

// Required modules.
var dom = require('../utils/dom');

/** 
 * @classdesc Event handler class.
 *
 * @class
 * @alias EventHandler
 * @since 0.1.0
 * @constructor
 *
 * @param {HTMLElement}                 element The target element.
 * @param {CartesianCoords|PolarCoords} coords  The coordinate system. 
 */
function EventHandler (options)
{
    var element         = options.element;
    var coords          = options.coords;
    var elementPosition = {};
    var isOver          = false;
    var isDragging      = false;
    var isDown          = false;
    var downX           = 0;
    var downY           = 0;
    var dispatchedOver  = false;

    // Mouse event handler
    function mouseEventHandler (event)
    {
        var type = event.type;
        type.replace(/^(on\.)/,""); // For event types with 'on' prefix.

        var pixelCoords = getPixelCoords(event);
        switch(type)
        {
            case 'mousemove' : 
                if (!isDragging && isDown && isOver && (downX !== pixelCoords.x || downY !== pixelCoords.y)) 
                {
                    isDragging = true;
                                        dispatch('mousedragstart', pixelCoords);
                }
                else if (isDragging)    dispatch('mousedrag', pixelCoords);
                else if (isOver)        dispatch('mousemove', pixelCoords);

                if (isOver && !dispatchedOver)
                {
                    dispatchedOver = true;
                                        dispatch('mouseover', pixelCoords);
                }
                if (!isOver && !dispatchedOver)
                {
                    dispatchedOver = false;
                                        dispatch('mouseout', pixelCoords);
                }
            break;
            case 'mousedown' : 
                if (isOver)      
                {
                                        dispatch('mousedown', pixelCoords);
                    downX = pixelCoords.x;
                    downY = pixelCoords.y;
                    isDown = true; 
                } 
            break;
            case 'mouseup' : 
                if      (isDragging)    dispatch('mousedragend', pixelCoords);
                else if (isOver)        dispatch('click', pixelCoords); 
                if      (isOver)        dispatch('mouseup', pixelCoords);    
                isDragging = false;
                isDown     = false; 
            break;
        }
    }

    // Touch event handler
    function touchEventHandler (event)
    {

    }

    // Event dispatcher.
    function dispatch (eventType, pixelCoords)
    {
        if (options[eventType] !== undefined) 
        {
            options[eventType](
            {
                event   : event,
                pixelX  : pixelCoords.x,
                pixelY  : pixelCoords.y,
                dataX   : coords.getDataX(pixelCoords.x),
                dataY   : coords.getDataY(pixelCoords.y)
            });
        }
    }

    // Updated the position of the element when the window is resize or scrolled.
    function updateElementPosition () 
    {
        elementPosition = dom.getPosition(element);
    }
    updateElementPosition();

    // Return the actual pixel coords within the viewport.
    function getPixelCoords (event) 
    {
        var x = event.clientX - elementPosition.x - coords.viewPort().x();
        var y = event.clientY - elementPosition.y - coords.viewPort().y();
        if (x >= 0 && x <= coords.viewPort().width() && y >= 0 && y <= coords.viewPort().height())  isOver = true;
        else                                                                                        isOver = false;
        return {x:x, y:y};
    }

    // Events listeners.
    dom.on(window, 'mousemove mouseup mousedown', mouseEventHandler);
    dom.on(window, 'scroll resize', updateElementPosition);
    dom.on(window, 'touchstart touchmove touchend', touchEventHandler);
}

module.exports = EventHandler;