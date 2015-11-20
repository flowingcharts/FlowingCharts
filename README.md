# [FlowingCharts](http://www.flowingcharts.com/)

FlowingCharts is a JavaScript charting library that supports both HTML5 Canvas and SVG.

* Website: [flowingcharts.com](http://www.flowingcharts.com/)
* Download: [flowingcharts.com/download](http://www.flowingcharts.com/download)
* Support: [flowingcharts.com/support](http://www.flowingcharts.com/support)

# Getting Started

## GitHub

Download and install  [GitHub Desktop For Windows](https://desktop.github.com/) 

#### Options

Open GitHub Desktop

Click 
`Settings` > `Options`

Clone path
```
C:\Work\GitHub
```

Configure git
```
JC
flowingcharts.com@gmail.com
```

Click
`+ Add Account`

Login
```
username: flowingcharts
password: *************
```

#### Repository (repo)

Click `+` > `clone` > `flowingcharts` > `ok`

you should now see the `flowingcharts` repo in `C:\Work\GitHub`

## Grunt

We use [Grunt](http://gruntjs.com) to automate repetitive tasks such as minification, compilation, unit testing and many others through the use of Grunt plugins.  An introduction to getting started with Grunt can be found at [gruntjs.com](http://gruntjs.com/getting-started).

##### Install Node

Grunt and Grunt plugins are installed and managed via npm, the [Node](https://nodejs.org) package manager. 

Download and install Node from [nodejs.org](https://nodejs.org/en/)

To make sure Node has been properly installed, open a command prompt and run the following command:

```
node -v
```

##### Install the CLI

The job of the Grunt CLI (Grunts command line interface) is to run the version of Grunt which has been installed alongside your project. 

Run the following command to install Grunt CLI in your system path, allowing it to be run from any directory.

Open a command prompt as Administrator.
Windows: click Start, in the Start Search box, type cmd, and then press CTRL+SHIFT+ENTER.

```
npm install -g grunt-cli
```

To make sure Grunt has been properly installed, you can run the following command:

```
grunt --version
```

##### Install project dependencies 

Run the following command to install the project dependencies in the `node_modules` folder.

Open a command prompt and go to `C:\Work\GitHub\flowingcharts`.
Windows: open Windows Explorer > navigate to the `C:\Work\GitHub\flowingcharts` > shift + right click > Open command window here.

```
npm install
```

##### Running Tasks

Open a command prompt and go to `C:\Work\GitHub\flowingcharts`.
Windows: open Windows Explorer > navigate to the `C:\Work\GitHub\flowingcharts` > shift + right click > Open command window here.

Run this after installation to generate 'gen_dist', 'gen_doc', 'gen_release' and 'gen_test_coverage' directories.
```
grunt
```

Development build.
```
grunt build
```

Carry out unit testing on the JavaScript module files and generate a test coverage file at 'gen_test_coverage/coverage.html'. 
```
grunt test
```

Publish a release version to 'gen_release/<%= pkg.version %>/'. 
```
grunt publish
```

Generate API documentation in 'gen_doc'. 
```
grunt doc
```