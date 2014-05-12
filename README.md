reallyawesome.js
================

A little AJAX and templating libary for working with JSON based API's via HTML tags

To use simply drop `<<get url="http(s)://url.com"></get>` where you want output. All configuration of the request is done through attributes. 

`<get|post|put|delete></get|post|put|delete>` Avliable elements, one for each request type. By default these are automatically found onload and the request placed immedietly.  
`url=` sets the request url  
`action=#id event` id of an element to watch, and event to listen too, functions as a way to deffer loading. Whitespace is important, and `event` must come after `id`.	`id` can defined with or without the leading `#`. By default binds to element and listens for click.  
`default=` Default plaintext or HTML to place insied the element before content loads. Very usefull with `action=`.
`raw=true|false` Weather or not to load the content of the request directly into the HTML, `raw="true"` will dump directly into the DOM, while `raw="false"` is the default and allows for transformations of the data before output.(note: swap this for `type="html|json|raw`?)  

`each=` Is where the "templating" portion comes in. RA.JS assumes that if you are sending a request you will be getting some form of JSON object back. `each=` lets you traverse that object tree and loop on arrays to output JSON nodes to the document. when `each=` is set, any HTML inside the request tag will be deuplicated, parsed, and output with the content of the relevent JSON node. We always return a `data` object from requests, this provides the starting point for traversal.  
If we have a JSON object that looks like `data.data.children[data]` and each data node in the array contains `url,title,author` we can format the request and template as such:
```html
<get id="front-page" url="http://api.reddit.com/" each="data.data.children" default="Loading...">
	<div>
		<a href="[[ data.url ]]">[[ data.title ]]</a><span>Author: [[data.author]]</span>
	</div>
</get>
```

Anything between `[[ ]]` will be evaluated in the context of the original `each` array (in this case `children[]`). Currently RA.JS uses a custom templating "language", for maximum extensibility it is likely that we will switch to handlebars.js or a similar compliant library, which would allow for easy replacement of the templating library.

Currently RA.JS supports
* GET requests
* Basic result templating
* Raw output
* And fireing requests on events

In the future RA.JS will support
* POST, PUT, DELETE requests and nice features to go along with each
* Better result formatting
* Much better templating support
* Ability to pass results off to functions

RA.JS is also a nice AJAX library at its core. Currently providing basic abstraction from standard xhr requests. invocation as `ajax.send({args}, callback);` where {args} is an object of {verb, url, headers, json}. Verb and URL are required. If you just want a small AJAX library check out [element1.js](https://github.com/hansolo669/element1.js), it's the core of reallyawesome.
