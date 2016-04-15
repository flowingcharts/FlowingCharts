/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains color functions.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          color 
 */

// List of valid color names.
var colorNames = 
{
    'aliceblue':'#f0f8ff','antiquewhite':'#faebd7','aqua':'#00ffff','aquamarine':'#7fffd4','azure':'#f0ffff',
    'beige':'#f5f5dc','bisque':'#ffe4c4','black':'#000000','blanchedalmond':'#ffebcd','blue':'#0000ff','blueviolet':'#8a2be2','brown':'#a52a2a','burlywood':'#deb887',
    'cadetblue':'#5f9ea0','chartreuse':'#7fff00','chocolate':'#d2691e','coral':'#ff7f50','cornflowerblue':'#6495ed','cornsilk':'#fff8dc','crimson':'#dc143c','cyan':'#00ffff',
    'darkblue':'#00008b','darkcyan':'#008b8b','darkgoldenrod':'#b8860b','darkgray':'#a9a9a9','darkgreen':'#006400','darkkhaki':'#bdb76b','darkmagenta':'#8b008b','darkolivegreen':'#556b2f',
    'darkorange':'#ff8c00','darkorchid':'#9932cc','darkred':'#8b0000','darksalmon':'#e9967a','darkseagreen':'#8fbc8f','darkslateblue':'#483d8b','darkslategray':'#2f4f4f','darkturquoise':'#00ced1',
    'darkviolet':'#9400d3','deeppink':'#ff1493','deepskyblue':'#00bfff','dimgray':'#696969','dodgerblue':'#1e90ff',
    'firebrick':'#b22222','floralwhite':'#fffaf0','forestgreen':'#228b22','fuchsia':'#ff00ff',
    'gainsboro':'#dcdcdc','ghostwhite':'#f8f8ff','gold':'#ffd700','goldenrod':'#daa520','gray':'#808080','green':'#008000','greenyellow':'#adff2f',
    'honeydew':'#f0fff0','hotpink':'#ff69b4',
    'indianred ':'#cd5c5c','indigo':'#4b0082','ivory':'#fffff0','khaki':'#f0e68c',
    'lavender':'#e6e6fa','lavenderblush':'#fff0f5','lawngreen':'#7cfc00','lemonchiffon':'#fffacd','lightblue':'#add8e6','lightcoral':'#f08080','lightcyan':'#e0ffff','lightgoldenrodyellow':'#fafad2',
    'lightgrey':'#d3d3d3','lightgreen':'#90ee90','lightpink':'#ffb6c1','lightsalmon':'#ffa07a','lightseagreen':'#20b2aa','lightskyblue':'#87cefa','lightslategray':'#778899','lightsteelblue':'#b0c4de',
    'lightyellow':'#ffffe0','lime':'#00ff00','limegreen':'#32cd32','linen':'#faf0e6',
    'magenta':'#ff00ff','maroon':'#800000','mediumaquamarine':'#66cdaa','mediumblue':'#0000cd','mediumorchid':'#ba55d3','mediumpurple':'#9370d8','mediumseagreen':'#3cb371','mediumslateblue':'#7b68ee',
    'mediumspringgreen':'#00fa9a','mediumturquoise':'#48d1cc','mediumvioletred':'#c71585','midnightblue':'#191970','mintcream':'#f5fffa','mistyrose':'#ffe4e1','moccasin':'#ffe4b5',
    'navajowhite':'#ffdead','navy':'#000080',
    'oldlace':'#fdf5e6','olive':'#808000','olivedrab':'#6b8e23','orange':'#ffa500','orangered':'#ff4500','orchid':'#da70d6',
    'palegoldenrod':'#eee8aa','palegreen':'#98fb98','paleturquoise':'#afeeee','palevioletred':'#d87093','papayawhip':'#ffefd5','peachpuff':'#ffdab9','peru':'#cd853f','pink':'#ffc0cb','plum':'#dda0dd','powderblue':'#b0e0e6','purple':'#800080',
    'red':'#ff0000','rosybrown':'#bc8f8f','royalblue':'#4169e1',
    'saddlebrown':'#8b4513','salmon':'#fa8072','sandybrown':'#f4a460','seagreen':'#2e8b57','seashell':'#fff5ee','sienna':'#a0522d','silver':'#c0c0c0','skyblue':'#87ceeb','slateblue':'#6a5acd','slategray':'#708090','snow':'#fffafa','springgreen':'#00ff7f','steelblue':'#4682b4',
    'tan':'#d2b48c','teal':'#008080','thistle':'#d8bfd8','tomato':'#ff6347','turquoise':'#40e0d0',
    'violet':'#ee82ee',
    'wheat':'#f5deb3','white':'#ffffff','whitesmoke':'#f5f5f5',
    'yellow':'#ffff00','yellowgreen':'#9acd32'
};

/** 
 * Check if c is a valid color.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is a number, otherwise false.
 */
var isColor = function (c)
{
    if (isHex(c))       return true;
    if (isRGB(c))       return true;
    if (isColorName(c)) return true;
    return false;
};

/** 
 * Check if c is a valid rgb color.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is an rgb color, otherwise false.
 */
var isRGB = function (c)
{
    return (c.indexOf('rgb') != -1);
};

/** 
 * Check if c is a valid rgba color.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is an rgba color, otherwise false.
 */
var isRGBA = function (c)
{
    return (c.indexOf('rgba') != -1);
};

/** 
 * Check if c is a valid hex color.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is a hexadecimal color, otherwise false.
 */
var isHex = function (c)
{
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(c);
};

/** 
 * Check if c is a valid color name.
 *
 * @since 0.1.0
 *
 * @param {string} c The color.
 *
 * @return {boolean} true, if c is a color name, otherwise false.
 */
var isColorName = function (c)
{
    if (colorNames[c.toLowerCase()] !== undefined) return true;
    return false;
};

/** 
 * Converts rgb to hex.
 *
 * @since 0.1.0
 *
 * @param {number} r The red component.
 * @param {number} g The green component.
 * @param {number} b The blue component.
 *
 * @return {string} The hexadecimal value.
 */
var RGBToHex = function (r, g, b)
{
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/** 
 * Converts hex to rgb.
 *
 * @since 0.1.0
 *
 * @param {string} hex The hexadecimal value.
 *
 * @return {Object} An object containing the rgb color values {r:255, g:255, b:255}.
 */
var hexToRGB = function (hex)
{
    // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) 
    {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
    {
        r : parseInt(result[1], 16), 
        g : parseInt(result[2], 16), 
        b : parseInt(result[3], 16)
    } : null;
};

/** 
 * Converts a color name to hex.
 *
 * @since 0.1.0
 *
 * @param {string} c The color name.
 *
 * @return {string} The hexadecimal value.
 */
var colorNameToHex = function (c)
{
    return colorNames[c.toLowerCase()];
};

/** 
 * Get the components colors for an rgba color string.
 *
 * @since 0.1.0
 *
 * @param {string} rgba The rgb(a) color string 'rgba(255, 255, 255, 0.5)'.
 *
 * @return {Object} An object containing the component colors {r:255, g:255, b:255, a:0.5}.
 */
var componentColors = function (rgba)
{
    var arr = rgba.match(/\d+/g);
    var o = 
    {
        r : Math.floor(arr[0]), 
        g : Math.floor(arr[1]), 
        b : Math.floor(arr[2])
    };
    return  o;
};

/**
 * Converts a color to an rgba string.
 *
 * @since 0.1.0
 *
 * @param {string} c        The color.
 * @param {number} opacity  The opacity value 0 to 1.
 *
 * @return {string} An rgba color string 'rgba(255, 255, 255, 0.5)' or undefined if not a valid color.
 */
var toRGBA = function (c, opacity)
{
    var o;
    if (isRGBA(c) && opacity === undefined)
        return c; 
    else if (isRGB(c))
        o = componentColors(c); 
    else if (isHex(c))       
        o = hexToRGB(c);
    else if (isColorName(c))
    {
        var hex = colorNameToHex(c);
        o = hexToRGB(hex);
    }   
    else return undefined;
    
    o.a = opacity !== undefined ? opacity : 1;  
    return 'rgba('+o.r+','+o.g+','+o.b+','+o.a+')';
};

module.exports = 
{
    isColor         : isColor,
    isHex           : isHex,
    isRGB           : isRGB,
    isRGBA          : isRGBA,
    toRGBA          : toRGBA
};