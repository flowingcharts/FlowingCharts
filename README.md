# [FlowingCharts](http://www.flowingcharts.com/)

FlowingCharts is a JavaScript charting library that supports both HTML5 Canvas and SVG.

* Website: [flowingcharts.com](http://www.flowingcharts.com/)
* Download: [flowingcharts.com/download](http://www.flowingcharts.com/download)
* Support: [flowingcharts.com/support](http://www.flowingcharts.com/support)

# Getting Started



## GitHub

Download and install GitHub Desktop For Windows from [https://desktop.github.com/](https://desktop.github.com/)

#### Options

Open GitHub

Go to `Settings` > `Options`

Clone path
```
C:\Work\GitHub
```

Configure git
```
JC
flowingcharts.com@gmail.com
```

`+ Add Account`
Login
```
username: flowingcharts
password: *************
```

#### Repository

Go to `+` > `clone` > `flowingcharts` > `ok`

you should now see `flowingcharts` repository in `C:\Work\GitHub`

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
For windows: click Start, in the Start Search box, type cmd, and then press CTRL+SHIFT+ENTER.

```
npm install -g grunt-cli
```

To make sure Grunt has been properly installed, you can run the following command:

```
grunt --version
```

##### Install project dependencies 

Run the following command to install the project dependencies in the `node_modules` folder.

Open a command prompt in the root directory of your project.
For windows: Navigate to the project directory in Windows Explorer > shift + right click > Open command window here.

```
npm install
```

##### Running Tasks

Open a command prompt in the root directory of your project.
For windows: Navigate to the project directory in Windows Explorer > shift + right click > Open command window here.

Start by using the `grunt` command to build the repository.