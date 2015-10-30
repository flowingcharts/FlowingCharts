Setting up grunt for flowingcharts

Download and install Node
https://nodejs.org/en/

Grunt
http://gruntjs.com/getting-started

1. Install Node from https://nodejs.org/en/

2. Put the grunt command in your system path, allowing it to be run from any directory
To start a command prompt as an administrator
Click Start
In the Start Search box, type cmd, and then press CTRL+SHIFT+ENTER.
> npm install -g grunt-cli

3. Add the following files to the root directory of your project
package.json
gruntfile.js

4. Install project dependencies with npm install
Open command prompt in the root directory of your project (shift + right click > Open command window here)
eg.
>npm install grunt --save-dev
>npm install grunt-contrib-concat --save-dev
>npm install grunt-jsdoc --save-dev

5. Run the grunt tasks (see gruntfile.js)

6. http://stackoverflow.com/questions/23125338/how-do-i-use-browserify-with-external-dependencies
This code was added so that the module code in jquery/plugin.js would use the jquery.js already loaded in the html file 
because we can assume that people using the plugin will have loaded jquery already in a script tag so we dont
need to include it again in our bundled flowingcharts.js file.

add to package.json:

"browserify": {
	"transform": [ "browserify-shim" ]
},
"browserify-shim": {
	"jQuery": "global:jQuery"
},

7. Include '/* jshint browserify: true */ at top of each js file to stop commonjs modules causing errors when jshint is run.
The format for commonjs modules breaks alot of jshints tests - this tells jshint to ignore the commonjs specific code.