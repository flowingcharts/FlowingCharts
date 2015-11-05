# FlowingCharts

FlowingCharts is a JavaScript charting library that supports both HTML5 Canvas and SVG.

* Website: [flowingcharts.com](http://www.flowingcharts.com/)
* Download: [flowingcharts.com/download](http://www.flowingcharts.com/download)
* Support: [flowingcharts.com/support](http://www.flowingcharts.com/support)

# How to build your own FlowingCharts

##### Grunt

We use [Grunt](http://gruntjs.com) to automate repetitive tasks. Built on top of Node.js, Grunt is a task-based command-line tool that can perform tasks such as minification, compilation, unit testing and many others through the use of plugins.

Help on using Grunt can be found at [gruntjs.com](http://gruntjs.com/getting-started)

##### Install Node

[Node](https://nodejs.org) needs to be installed for grunt to be able to run. Grunt and Grunt plugins are installed and managed via npm, the Node.js package manager. 

Download and install Node from [nodejs.org](https://nodejs.org/en/)

To make sure Node has been properly installed, you can open a command prompt and run the following command:

```
node -v
```

##### Install the CLI

The job of the Grunt CLI (Grunts command line interface) is to run the version of Grunt which has been installed alongside your project. 

Run the following command to install Grunt CLI in your system path, allowing it to be run from any directory.

Open a command prompt as Administrator.
For windows: click Start, in the Start Search box, type cmd, and then press CTRL+SHIFT+ENTER.

```
npm install -g grunt-cli
```

To make sure Grunt has been properly installed, you can run the following command:

```
grunt --version
```

##### Install project dependencies 

Run the following command to install the project dependencies in a `node_modules` folder.

Open a command prompt in the root directory of your project.
For windows: Navigate to the project directory in Windows Explorer > shift + right click > Open command window here.

```
npm install
```

##### Running Tasks



*Change to the project's root directory.
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
