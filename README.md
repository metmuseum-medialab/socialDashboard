# socialDashboard
A webpage/server combination that renders a nice-looking view (or views) of social media streams, based on entered search criteria.


How to Use:
- clone into a directory on a web server
- copy secrets.tpl.js to secrets.js
 - add your twitter and instagram API keys
 - set the port values
- run "node server.node.js"
 - keep "npm install"-ing missing modules until it runs
 - (TODO: make a package.json file)
- open a browser to the server address and port
- the default search terms are "metmedialab" and "metmuseum"
 - hovering your mouse in the upper left corner reveals a gear icon. click on it to open a menu that will allow you to set your own search terms. Click the checkbox and it will resume with your new terms.


TODO
- more options in menu, for color, size, etc
- option to clear all items 
- save values when iterface is closed.
