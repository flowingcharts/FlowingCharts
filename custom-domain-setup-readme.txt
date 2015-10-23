Pointing flowingcharts.com at flowingcharts.github.io

http://www.names.co.uk/
> Control Panel > DNS Administration > flowingcharts.com

Add the "A" and "CNAME" records:

Hostname	Type	Result
			A 		192.30.252.153
			A 		192.30.252.154
www			CNAME 	flowingcharts.github.io

A 192.30.252.153
A 192.30.252.154
Records for the naked (no www) domain
These are the static Github IP addresses from which your content will be served

CNAME flowingcharts.github.io
The purpose of the CNAME is to redirect all www subdomain traffic to a GitHub page which will 301 redirect to the naked domain.

https://github.com/flowingcharts/flowingcharts.github.io
Add a file called "CNAME" to the root directory of the repo which contains the custom domain name "flowingcharts.com"
This file tells GitHub to use this repo to handle traffic to this domai