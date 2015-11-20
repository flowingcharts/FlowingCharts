# Installation

We use [Grunt](http://gruntjs.com) to automate repetitive tasks such as minification, compilation, unit testing and many others through the use of Grunt plugins.  An introduction to getting started with Grunt can be found at [gruntjs.com](http://gruntjs.com/getting-started).

## Install Node

Grunt and Grunt plugins are installed and managed via npm, the [Node](https://nodejs.org) package manager. 

Download and install Node from [nodejs.org](https://nodejs.org/en/)

To make sure Node has been properly installed, open a command prompt and run the following command:

```
node -v
```

## Install the CLI

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

## Install GitHub Desktop

Download and install  [GitHub Desktop For Windows](https://desktop.github.com/) 

#### Setup

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

#### Clone the repository (repo)

Click `+` > `clone` > `flowingcharts` > `ok`

you should now see the `flowingcharts` repo in `C:\Work\GitHub`

## Install project dependencies 

Open a command prompt and go to `C:\Work\GitHub\flowingcharts`.
Windows: open Windows Explorer > navigate to the `C:\Work\GitHub\flowingcharts` > shift + right click > Open command window here.

Run the following command to install the project dependencies in the `node_modules` folder.
```
npm install
```

### Build the repo 

Open a command prompt and go to `C:\Work\GitHub\flowingcharts`.
Windows: open Windows Explorer > navigate to the `C:\Work\GitHub\flowingcharts` > shift + right click > Open command window here.

Run the following command to generate the `gen_build`, `gen_doc`, `gen_release` and `gen_test_coverage` directories.
```
grunt
````

