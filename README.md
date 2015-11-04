# FlowingCharts

FlowingCharts is a JavaScript charting library that supports both HTML5 Canvas and SVG.

* Website: [flowingcharts.com](http://www.flowingcharts.com/)
* Download: [flowingcharts.com/download](http://www.flowingcharts.com/download)
* Support: [flowingcharts.com/support](http://www.flowingcharts.com/support)

## Onboarding

### Node

* Download and install Node from [https://nodejs.org/en/](https://nodejs.org/en/)

### Grunt

* Help on using Grunt can be found at [http://gruntjs.com/getting-started](http://gruntjs.com/getting-started)

* Put the grunt command line module in your system path, allowing it to be run from any directory
To start a command prompt as an administrator
Click Start
In the Start Search box, type cmd, and then press CTRL+SHIFT+ENTER.
> npm install -g grunt-cli

* Install project dependencies with npm install
Open command prompt in the root directory of your project (shift + right click > Open command window here)
eg.
>npm install grunt --save-dev

>npm install grunt-contrib-concat --save-dev

>npm install grunt-jsdoc --save-dev

* Run the grunt tasks (see gruntfile.js)

* http://stackoverflow.com/questions/23125338/how-do-i-use-browserify-with-external-dependencies
This code was added so that the module code in jquery/plugin.js would use the jquery.js already loaded in the html file 
because we can assume that people using the plugin will have loaded jquery already in a script tag so we dont
need to include it again in our bundled flowingcharts.js file.

add to package.json:

```json
"browserify": {
    "transform": [ "browserify-shim" ]
},
"browserify-shim": {
    "jQuery": "global:jQuery"
},
```

* Include '/* jshint browserify: true */ at top of each js file to stop commonjs modules causing errors when jshint is run.
The format for commonjs modules breaks alot of jshints tests - this tells jshint to ignore the commonjs specific code.
