Setting up grunt for flowingcharts

Node
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
> npm install grunt --save-dev
> npm install grunt-contrib-concat --save-dev
> npm install grunt-contrib-copy --save-dev
> npm install grunt-contrib-jshint --save-dev
> npm install grunt-contrib-qunitjs --save-dev 
> npm install grunt-contrib-uglify --save-dev
> npm install grunt-contrib-watch --save-dev
> npm install grunt-jsdoc --save-dev
> npm install grunt-jsonlint --save-dev 
> npm install ink-docstrap

5. Run the grunt tasks
Open command prompt in the root directory of your project (shift + right click > Open command window here)

To run the default task: concatenate, check and uglify code
> grunt

To detect errors and potential problems in code
> grunt test

To publish a release version
> grunt publish

To generate code documentation
> grunt doc

To run the watch task.
> grunt watch