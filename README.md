reallyawesome.js
================

A little AJAX and templating libary for working with JSON based API's via HTML tags

[Little demo here](http://www.reallyawesomedomain.com/reallyawesome.js/demo.html)

### Usage
To use simply drop `<<get url="http(s)://url.com"></get>` where you want output. All configuration of the request is done through attributes. 

`<get|post|put|delete></get|post|put|delete>` Avliable elements, one for each request type. By default these are automatically found onload and the request placed immedietly.

`url=` sets the request url

`action=#id event` id of an element to watch, and event to listen too, functions as a way to deffer loading. Whitespace is important, and `event` must come after `id`.	`id` can defined with or without the leading `#`. By default binds to element and listens for click.

`default=` Default plaintext or HTML to place insied the element before content loads. Very usefull with `action=`.

`type="html|json|raw"` Declares what type of response to expect. `html` is for loading HTML fragments, `raw` is for loading anything that isnt HTML or JSON, and `json` will spit raw JSON into the document.

### Templating
reallyawesome uses handlebars.js as it's templating library. This allows us to take JSON formatted responses and insert them nicely into the document. As long as `type=""` is not defined the result data from the request will be passed to handlebars, which will process any HTML inside the request element as a handlebars template. If you have a JSON object that looks like `{"name":"Cal", "site":"reallyawesomedomain.com"}` you can output it as such: `<a href="{{site}}">{{name}}</a>`. A more complex example, with a JSON object like `{data.children[data.url, data.title]}` follows:

```html
{{#each data.children}}
	<li>
		<a href="{{data.url}}"> {{data.title}}</a>
	</li>
{{/each}}
```

### Notes

Currently RA.js supports
* GET requests
* Basic result templating
* Raw output
* And fireing requests on events

In the future RA.js will support
* POST, PUT, DELETE requests and nice features to go along with each
* Better result formatting
* Much better templating support
* Ability to pass results off to functions

### Core

RA.js is also a nice AJAX library at its core. Currently providing basic abstraction from standard xhr requests. invocation as `ajax.send({args}, callback);` where {args} is an object of {verb, url, headers, json}. Verb and URL are required. If you just want a small AJAX library check out [element1.js](https://github.com/hansolo669/element1.js), it's the core of reallyawesome.
