# FlowingCharts

FlowingCharts is a JavaScript charting library that supports both HTML5 Canvas and SVG.

* Website: [flowingcharts.com](http://www.flowingcharts.com/)
* Download: [flowingcharts.com/download](http://www.flowingcharts.com/download)
* Support: [flowingcharts.com/support](http://www.flowingcharts.com/support)

## Onboarding

### [Grunt](http://gruntjs.com)

Built on top of Node.js, Grunt is a task-based command-line tool that speeds up workflows by reducing the effort required to prepare assets for production. Through the use of plugins it can perform repetitive tasks like minification, compilation, unit testing etc.

Help on using Grunt can be found at [gruntjs.com](http://gruntjs.com/getting-started)

#### Install [Node](https://nodejs.org)

Node needs to be installed for grunt to be able to run. Grunt and Grunt plugins are installed and managed via npm, the Node.js package manager. 

Download and install Node from [nodejs.org](https://nodejs.org/en/)

#### Install the CLI

Run the following command to install Grunts command line interface (CLI) globally.

Run your command shell as Administrator.
For windows: click Start, in the Start Search box, type cmd, and then press CTRL+SHIFT+ENTER.

```
npm install -g grunt-cli
```

This puts the grunt command line module in your system path, allowing it to be run from any directory.
The job of the Grunt CLI is to run the version of Grunt which has been installed next to a Gruntfile. 

#### Using Grunt


Change to the project's root directory.
Install project dependencies with npm install.
Run Grunt with grunt.
That's really all there is to it. Installed Grunt tasks can be listed by running grunt --help but it's usually a good idea to start with the project's documentation.





* Install project dependencies with npm install
Open command prompt in the root directory of your project (shift + right click > Open command window here)
eg.
> npm install grunt --save-dev
> npm install grunt-contrib-concat --save-dev
> npm install grunt-jsdoc --save-dev

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
