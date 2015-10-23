Pointing flowingcharts.com at flowingcharts.github.io

1. Go to http://www.names.co.uk/ and login
2. Control Panel > DNS Administration > flowingcharts.com
3. Add the following:

Hostname	Type	Result
			A 		192.30.252.153
			A 		192.30.252.154
www			CNAME 	flowingcharts.github.io

4. Go to https://github.com/flowingcharts/flowingcharts.github.io
5. Add a file called "CNAME" to the root directory of the repo which contains the custom domain name "flowingcharts.com"