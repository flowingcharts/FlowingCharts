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
 * @param {CartesianCoords|PolarCoords} coords  The coordinate system. 
 */
function EventHandler (options)
{
    // TODO Chrome, FF and Opera dont dispatch a mouseout event if you leave the browser window whilst hovering an svg element.

    var element         = options.element;
    var coords          = options.coords;
    var isOver          = false;
    var isDragging      = false;
    var isDown          = false;
    var isDownOver      = false;
    var downX           = 0;
    var downY           = 0;
    var dispatchedOver  = false;
    var elementPosition;
    var pointerPosition;
    var viewportWidth;
    var viewportHeight;

    // Mouse event handler
    function mouseEventHandler (event)
    {
        var clientX = event.clientX;
        var clientY = event.clientY;
        pointerPosition = getPointerPosition(clientX, clientY);
        isPointerOverChart(clientX, clientY);

        var dx   = pointerPosition.x - downX;
        var dy   = pointerPosition.y - downY;
        var diff = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        switch (event.type)
        {
            case 'mousemove' : 
                if (isDragging) 
                {
                    dispatch('mousedrag', event, pointerPosition);
                }  
                else if (isDownOver && (diff > 5)) 
                {
                    isDragging = true;
                    dispatch('mousedragstart', event, {x:downX, y:downY});
                }
                else if (isOver && !isDown && (downX !== pointerPosition.x || downY !== pointerPosition.y)) 
                {
                    dispatch('mousemove', event, pointerPosition);
                }

                if (isOver && !dispatchedOver)
                {
                    dispatchedOver = true;
                    dispatch('mouseover', event, pointerPosition);
                }
                else if (!isOver && dispatchedOver)
                {
                    dispatchedOver = false;
                    dispatch('mouseout', event, pointerPosition);
                }
            break;

            case 'mousedown' : 
                if (isOver)
                {
                    isDownOver = true; 
                    dispatch('mousedown', event, pointerPosition);
                    downX = pointerPosition.x;
                    downY = pointerPosition.y;
                } 
                else dispatch('mousedownoutside', event, pointerPosition); 
                isDown = true; 
            break;

            case 'mouseup' : 
                if (isDragging)    
                {
                    dispatch('mousedragend', event, pointerPosition);
                }
                else if (isDownOver)      
                {  
                    dispatch('mouseup', event, pointerPosition);    
                    dispatch('mouseclick', event, pointerPosition); 
                }
                isDragging = false;
                isDown     = false; 
                isDownOver = false;
            break;

            // For cases when the mouse moves outside the browser window whilst over the charts viewport.
            case 'mouseout' : 
                if (event.toElement === null && event.relatedTarget === null) 
                {
                    if (isOver && dispatchedOver)
                    {
                        dispatchedOver = false;
                        dispatch('mouseout', event, pointerPosition);
                    }
                }
            break;
        }

        // Prevent default mouse functionality.
        if (isOver || isDragging) event.preventDefault();
    }

    // Touch event handler
    function touchEventHandler (event)
    {
        /*
        For a single click the order of events is:

        1. touchstart
        2. touchmove
        3. touchend
        4. mouseover
        5. mousemove
        6. mousedown
        7. mouseup
        8. click

        Use preventDefault() inside touch event handlers, so the default mouse-emulation handling doesn’t occur.
        http://www.html5rocks.com/en/mobile/touchandmouse/

        But weve attached handlers to the window rather than the element so only call preventDefault() if were
        dragging or over the chart viewport so we dont break default window touch events when not over the chart.
        */
        var clientX, clientY, diff;
        if (event.targetTouches && event.targetTouches.length === 1)
        {
            var t = event.targetTouches[0];
            clientX = t.clientX;
            clientY = t.clientY;
            pointerPosition = getPointerPosition(clientX, clientY);
            isPointerOverChart(clientX, clientY);

            var dx   = pointerPosition.x - downX;
            var dy   = pointerPosition.y - downY;
            diff     = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        }
        else
        {

        }

        switch (event.type)
        {
            case 'touchmove' : 

                if (isDragging) 
                {
                    dispatch('touchdrag', event, pointerPosition);
                }  
                else if (isDownOver && (diff > 10)) 
                {
                    isDragging = true;
                    dispatch('touchdragstart', event, {x:downX, y:downY});
                }

                if (isOver && !dispatchedOver)
                {
                    dispatchedOver = true;
                    dispatch('touchover', event, pointerPosition);
                }
                else if (!isOver && dispatchedOver)
                {
                    dispatchedOver = false;
                    dispatch('touchout', event, pointerPosition);
                }
            break;

            case 'touchstart' : 
                if (isOver)
                {
                    isDownOver = true; 
                    dispatch('touchdown', event, pointerPosition);
                    downX = pointerPosition.x;
                    downY = pointerPosition.y;
                } 
                else dispatch('touchdownoutside', event, pointerPosition); 
                isDown = true;
            break;

            case 'touchend' : 
                if (isDragging)    
                {
                    dispatch('touchdragend', event, pointerPosition);
                }
                else if (isDownOver)      
                {  
                    dispatch('touchup', event, pointerPosition);    
                    dispatch('touchclick', event, pointerPosition); 
                }
                isDragging = false;
                isDown     = false; 
                isDownOver = false;
            break;
        }

        // Prevent default touch functionality.
        if (isOver || isDragging) event.preventDefault();
    }

    // Event dispatcher.
    function dispatch (eventType, event, pointerPosition)
    {
        window.console.log(eventType);
        if (options[eventType] !== undefined) 
        {
            options[eventType](
            {
                originalEvent : event,
                isOver        : isOver,
                isDragging    : isDragging,
                isDown        : isDown,
                dataX         : coords.getDataX(pointerPosition.x),
                dataY         : coords.getDataY(pointerPosition.y),
                pixelX        : pointerPosition.x,
                pixelY        : pointerPosition.y
            });
        }
    }

    // Update the position of the element within the browser viewport and 
    // the viewport width and height when the window size changes ie resized or scrolled.
    function updateElementPosition () 
    {
        viewportWidth   = dom.viewportWidth();
        viewportHeight  = dom.viewportHeight();
        elementPosition = dom.bounds(element);
    }
    updateElementPosition();

    // Return the position of the pointer within the element.
    function getPointerPosition (clientX, clientY) 
    {
        var x = clientX - elementPosition.left;
        var y = clientY - elementPosition.top;
        return {x:x, y:y};
    }

    // Check if the pointer is over the charts viewport.
    function isPointerOverChart (clientX, clientY)
    {
        // Prevent pointer events being dispatched when the pointer is outside the element or over scrollbars in FF and IE.
        if (clientX < 0 || clientX > viewportWidth || clientY < 0 || clientY > viewportHeight) 
        {
            isOver = false;
        }
        // Check if pointer is over the chart viewport.
        else if (pointerPosition.x >= coords.viewPort().x() && (pointerPosition.x - coords.viewPort().x()) <= coords.viewPort().width() && 
                 pointerPosition.y >= coords.viewPort().y() && (pointerPosition.y - coords.viewPort().y()) <= coords.viewPort().height())  
        {
            isOver = true;
        }    
        else 
        {
            isOver = false;
        }
    }

    var win = dom.getWindowForElement(element);

    // Monitor changes to to browser window.
    dom.on(win, 'scroll resize', updateElementPosition);

    // Mouse events.
    dom.on(win, 'mousemove mouseup mousedown', mouseEventHandler);
    dom.on(element, 'mouseout', mouseEventHandler);

    // Touch events.
    if ('ontouchstart' in window) dom.on(win, 'touchstart touchmove touchend', touchEventHandler);
}

module.exports = EventHandler;