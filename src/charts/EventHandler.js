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
    // TODO Mouse out window over svg element - chrome doesnt fire an event.

    var element         = options.element;
    var coords          = options.coords;
    var elementPosition;
    var viewportWidth;
    var viewportHeight;
    var pixelCoords;
    var isOver          = false;
    var isDragging      = false;
    var isDown          = false;
    var downX           = 0;
    var downY           = 0;
    var dispatchedOver  = false;

    // Mouse event handler
    function mouseEventHandler (event)
    {
        event.preventDefault();
        var type = event.type;
        switch (type)
        {
            case 'mousemove' : 

                pixelCoords = getPixelCoords(event);

                // Prevent mouseevents being dispatched when mouse is over scrollbars in FF and IE.
                if (event.clientX < 0               || 
                    event.clientX > viewportWidth   || 
                    event.clientY < 0               || 
                    event.clientY > viewportHeight)                                             isOver = false;
                // Check if mouse is over the chart.
                else if (pixelCoords.x >= coords.viewPort().x() && 
                        (pixelCoords.x - coords.viewPort().x()) <= coords.viewPort().width() && 
                        pixelCoords.y >= coords.viewPort().y() && 
                        (pixelCoords.y - coords.viewPort().y()) <= coords.viewPort().height())  isOver = true;
                else                                                                            isOver = false;

                if (!isDragging && isDown && isOver && (downX !== pixelCoords.x || downY !== pixelCoords.y)) 
                {
                    isDragging = true;
                    dispatch('mousedragstart', event, pixelCoords);
                }
                else if (isDragging) 
                {
                    dispatch('mousedrag', event, pixelCoords);
                }   
                else if (isOver && !dispatchedOver)
                {
                    dispatchedOver = true;
                    dispatch('mouseover', event, pixelCoords);
                }
                else if (!isOver && dispatchedOver)
                {
                    dispatchedOver = false;
                    dispatch('mouseout', event, pixelCoords);
                }
                else if (isOver) 
                {
                    dispatch('mousemove', event, pixelCoords);
                }
            break;

            case 'mousedown' : 
                if (isOver)      
                {
                    dispatch('mousedown', event, pixelCoords);
                    downX = pixelCoords.x;
                    downY = pixelCoords.y;
                    isDown = true; 
                } 
            break;

            case 'mouseup' : 
                if      (isDragging)    dispatch('mousedragend', event, pixelCoords);
                else if (isOver)      
                {  
                    dispatch('click', event, pixelCoords); 
                    dispatch('mouseup', event, pixelCoords);    
                }
                isDragging = false;
                isDown     = false; 
            break;

            case 'mouseout' : 
                // Chrome, FF and Opera dont dispatch a mouseout event if you leave the window whilst hovering an svg element.
                if (event.toElement === null && event.relatedTarget === null) 
                {
                    if (isOver && dispatchedOver)
                    {
                        dispatchedOver = false;
                        dispatch('mouseout', event, pixelCoords);
                    }
                }
            break;
        }
    }

    // Touch event handler
    function touchEventHandler (event)
    {

    }

    // Event dispatcher.
    function dispatch (eventType, event, pixelCoords)
    {
        if (options[eventType] !== undefined) 
        {
            options[eventType](
            {
                event       : event,
                isOver      : isOver,
                isDragging  : isDragging,
                isDown      : isDown,
                dataX       : coords.getDataX(pixelCoords.x),
                dataY       : coords.getDataY(pixelCoords.y),
                pixelX      : pixelCoords.x,
                pixelY      : pixelCoords.y,
                clientX     : event.clientX,
                clientY     : event.clientY,
                pageX       : event.pageX,
                pageY       : event.pageY,
            });
        }
    }

    // Updated the position of the element when the window is resize or scrolled.
    function updateElementPosition () 
    {
        viewportWidth   = dom.viewportWidth();
        viewportHeight  = dom.viewportHeight();
        elementPosition = dom.bounds(element);
    }
    updateElementPosition();

    // Return the actual pixel coords within the viewport.
    function getPixelCoords (event) 
    {
        var x = event.clientX - elementPosition.left;
        var y = event.clientY - elementPosition.top;
        return {x:x, y:y};
    }

    // Events listeners.
    dom.on(window, 'mousemove mouseup mousedown mouseout', mouseEventHandler);
    dom.on(window, 'scroll resize', updateElementPosition);
    dom.on(window, 'touchstart touchmove touchend', touchEventHandler);
}

module.exports = EventHandler;