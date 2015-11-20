# Browserify

## package.js

Included in package.json:

```json
"browserify": {
    "transform": [ "browserify-shim" ]
},
"browserify-shim": {
    "jQuery": "global:jQuery"
},
```

[stackoverflow](http://stackoverflow.com/a/23129051)
This code was added so that the module code in jquery/plugin.js would use the jquery.js already loaded in the html file 
because we can assume that people using the plugin will have loaded jquery already in a script tag so we dont
need to include it again in our bundled flowingcharts.js file.

## JavaScript Modules

Included in all JavaScript modules files: 

```
/* jshint browserify: true */ 
```

This tells jshint to ignore the commonjs specific code in the file which breaks jshints rules. 
