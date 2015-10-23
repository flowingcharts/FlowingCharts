/*! flowingcharts v0.1.0 2015-10-23 */
var flowingcharts=function(a){"use strict";var b=a.canvas=a.canvas||{};return b.isSupported=function(){return!!document.createElement("canvas").getContext},a}(flowingcharts||{}),flowingcharts=function(a){"use strict";var b=a.geom=a.geom||{};return b.BoundingBox=function(a,b,c,d){this.xMin(a||0),this.yMin(b||0),this.xMax(c||100),this.yMax(d||100)},b.BoundingBox.prototype={xMin:function(a){return void 0!==a?(this._xMin=a,this._width=Math.abs(this._xMax-this._xMin),this._xCenter=this._xMin+this._width/2,this):this._xMin},xMax:function(a){return void 0!==a?(this._xMax=a,this._width=Math.abs(this._xMax-this._xMin),this._xCenter=this._xMin+this._width/2,this):this._xMax},xCenter:function(a){return void 0!==a?(this._xCenter=a,this._xMin=this._xCenter-this._width/2,this._xMax=this._xCenter+this._width/2,this):this._xCenter},width:function(a){return void 0!==a?(this._width=a,this._xMax=this._xMin+this._width,this._xCenter=this._xMin+this._width/2,this):this._width},yMin:function(a){return void 0!==a?(this._yMin=a,this._height=Math.abs(this._yMax-this._yMin),this._yCenter=this._yMin+this._height/2,this):this._yMin},yMax:function(a){return void 0!==a?(this._yMax=a,this._height=Math.abs(this._yMax-this._yMin),this._yCenter=this._yMin+this._height/2,this):this._yMax},yCenter:function(a){return void 0!==a?(this._yCenter=a,this._yMin=this._yCenter-this._height/2,this._yMax=this._yCenter+this._height/2,this):this._yCenter},height:function(a){return void 0!==a?(this._height=a,this._yMax=this._yMin+this._height,this._yCenter=this._yMin+this._height/2,this):this._yCenter},clone:function(){return new b.BoundingBox(this._xMin,this._yMin,this._xMax,this._yMax)},equals:function(a){return a.getXMin()!==this._xMin?!1:a.getYMin()!==this._yMin?!1:a.getXMax()!==this._xMax?!1:a.getYMax()!==this._yMax?!1:!0},intersects:function(a){return a.getXMin()>this._xMax?!1:a.getXMax()<this._xMin?!1:a.getYMin()>this._yMax?!1:a.getYMax()<this._yMin?!1:!0},contains:function(a){return a.getXMin()<this._xMin?!1:a.getXMax()>this._xMax?!1:a.getYMin()<this._yMin?!1:a.getYMax()>this._yMax?!1:!0}},a}(flowingcharts||{}),flowingcharts=function(a){"use strict";var b=a.geom=a.geom||{};return b.CartesianSpace=function(a,b,c,d){this.canvasX=a||0,this.canvasY=b||0,this.canvasWidth=c||0,this.canvasHeight=d||0,this.bBox=new flowingcharts.geom.BoundingBox,this.oldBBox=new flowingcharts.geom.BoundingBox,this._oldBBoxSet=!1,this.minZoom=-1,this.maxZoom=-1,this.maintainAspectRatio=!1},b.CartesianSpace.prototype={canvasX:0,canvasY:0,canvasWidth:0,canvasHeight:0,minZoom:-1,maxZoom:-1,maintainAspectRatio:!1,getBBox:function(){return this.bBox},setBBox:function(a){this._oldBBoxSet?this.oldBBox=this.bBox.clone():this.oldBBox=a.clone(),this.bBox=a.clone(),this._oldBBoxSet=!0,this.commitChanges()},getPixelPoint:function(a){return new ia.Point(this.getPixelX(a.x),this.getPixelY(a.y))},getPixelRect:function(a){var b=new ia.Rectangle(this.getPixelX(a.getXMin()),this.getPixelY(a.getYMax()),this.getPixelWidth(a.getWidth()),this.getPixelHeight(a.getHeight()));return b},getPixelX:function(a){var b=this.canvasX+this.getPixelWidth(a-this.bBox.getXMin());return b},getPixelY:function(a){var b=this.canvasY+this.canvasHeight-this.getPixelHeight(a-this.bBox.getYMin());return b},getPixelWidth:function(a){if(0===a)return 0;var b=a/this.bBox.getWidth()*this.canvasWidth;return b},getPixelHeight:function(a){if(0===a)return 0;var b=a/this.bBox.getHeight()*this.canvasHeight;return b},getDataPoint:function(a){var b=new ia.Point(this.getDataX(a.x),this.getDataY(a.y));return b},getDataBBox:function(a){var b=this.getPixelX(a.left()),c=this.getPixelY(a.bottom()),d=b+this.getPixelWidth(a.width),e=c+this.getPixelHeight(a.height),f=new flowingcharts.geom.BoundingBox(b,c,d,e);return f},getDataX:function(a){var b=this.bBox.getXMin()+this.getDataWidth(a);return b},getDataY:function(a){var b=this.bBox.getYMin()+this.getDataHeight(this.canvasHeight-a);return b},getDataWidth:function(a){if(0===a)return 0;var b=a/this.canvasWidth*this.bBox.getWidth();return b},getDataHeight:function(a){if(0===a)return 0;var b=a/this.canvasHeight*this.bBox.getHeight();return b},commitChanges:function(){this.maintainAspectRatio&&this.adjustBBox(this.bBox);var a=!0;if(-1!=this.minZoom){var b=Math.max(this.bBox.getWidth(),this.bBox.getHeight());b>this.minZoom&&(a=!1)}if(-1!=this.maxZoom){var c=Math.min(this.bBox.getWidth(),this.bBox.getHeight());c<this.maxZoom&&(a=!1)}if(a){var d=this.getPixelRect(this.oldBBox),e=this.getPixelRect(this.bBox),f=Math.round(e.width),g=Math.round(e.height),h=Math.round(d.width),i=Math.round(d.height);f===h&&g===i?eventType=ia.BBoxEvent.BBOX_TRANSLATE:eventType=ia.BBoxEvent.BBOX_SCALE}else this.bBox=this.oldBBox.clone(),this.maintainAspectRatio&&this.adjustBBox(this.bBox),eventType=ia.BBoxEvent.BBOX_SCALE},adjustBBox:function(a){var b,c,d,e,f=a.getHeight()/this.canvasHeight,g=a.getWidth()/this.canvasWidth;f>g?(c=a.getYMin(),e=a.getHeight(),d=this.canvasWidth/this.canvasHeight*e,b=a.getXMin()-(d-a.getWidth())/2):g>f?(b=a.getXMin(),d=a.getWidth(),e=this.canvasHeight/this.canvasWidth*d,c=a.getYMin()-(e-a.getHeight())/2):(b=a.getXMin(),c=a.getYMin(),d=a.getWidth(),e=a.getHeight()),a.setXMin(b),a.setYMin(c),a.setWidth(d),a.setHeight(e)}},a}(flowingcharts||{}),flowingcharts=function(a,b){"use strict";a.jquery=a.jquery||{};return b.fn.flowingcharts=function(a){var c=b.extend({color:"#556b2f",backgroundColor:"brown"},a);return this.css({color:c.color,backgroundColor:c.backgroundColor}),this},a}(flowingcharts||{},window.jQuery),flowingcharts=function(a){"use strict";var b=a=a||{},c=new b.geom.BoundingBox;return console.log(c),b}(flowingcharts||{});
//# sourceMappingURL=flowingcharts.map