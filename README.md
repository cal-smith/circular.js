circular.js
================

A little AJAX and templating libary for working with JSON based API's via HTML tags

[Little demo here,](http://www.reallyawesomedomain.com/circular.js/demo.html) [source here](https://github.com/hansolo669/circular.js/blob/master/demo.html)

### Usage
To use simply drop `<<get url="http(s)://url.com"></get>` where you want output. All configuration of the request is done through attributes. 

`<get|post|put|delete></get|post|put|delete>` Avliable elements, one for each request type. By default these are automatically found onload and the request placed immedietly.

`url=` sets the request url

`action=#id event` id of an element to watch, and event to listen too, functions as a way to deffer loading. Whitespace is important, and `event` must come after `id`.	`id` can defined with or without the leading `#`. By default binds to element and listens for click.

`default=` Default plaintext or HTML to place insied the element before content loads. Very usefull with `action=`.

`type="html|json|raw"` Declares what type of response to expect. `html` is for loading HTML fragments, `raw` is for loading anything that isnt HTML or JSON, and `json` will spit raw JSON into the document.

`wrap=` passes a string that will be used as a variable to wrap a flat JSON object. Ex: `wrap=json` a JSON document that looks like `{'day':'monday', 'rating':'1'},{'day':'friday', 'rating':'5'}` will be transformed to `{'json':[{'day':'monday', 'rating':'1'},{'day':'friday', 'rating':'5'}]}` which lets us preform `{{#each json}}` and template out the data.

### Templating
circular uses handlebars.js as it's templating library. This allows us to take JSON formatted responses and insert them nicely into the document. As long as `type=""` is not defined the result data from the request will be passed to handlebars, which will process any HTML inside the request element as a handlebars template. If you have a JSON object that looks like `{"name":"hansolo669", "site":"reallyawesomedomain.com"}` you can output it as such: `<a href="{{site}}">{{name}}</a>`. A more complex example, with a JSON object like `'data':{'children':['data':{'url':'fancy.com', 'title':'fancy!'}]}` follows:

```html
{{#each data.children}}
	<li>
		<a href="{{data.url}}"> {{data.title}}</a>
	</li>
{{/each}}
```

### Notes

Currently circular.js supports
* GET requests
* Basic result templating
* Raw output
* And fireing requests on events

In the future circular.js will support
* POST, PUT, DELETE requests and nice features to go along with each
* Better result formatting
* Much better templating support
* Ability to pass results off to functions
