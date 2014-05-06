 RegExp.quote = function(str) {//quotes out regex reserved characters. usefull for inserting variables in regex's
	 return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
 };

function search(json, find, callback){
		for(var i in json){
			//console.log([i,json[i]]);
			if(i == "children"){
				callback([i,json[i]]);
			} else if(json[i] !== null && typeof(json[i]) == "object"){
			search(json[i], find, callback);
		}
	}
}

//templater works exclusivly with json. all non json requests get passed to loader
function templater(element){//templater. replaces template strings, or if no each attr exits, simply dumps the result into element.innerHTML
	ajax.send({'verb':'GET', 'url':element.attributes.url.value}, function(data){
		element.innerHTML = "";//clears any default values etc.
		if(element.attributes.each){//check for each attr
			var byeach = element.attributes.each.value;//gets the root object (the part we have to loop over, aka the array) as a string

			search(data, "children", function(key){
				window.test = key;
				console.log(key);
			});

			/*
			var foreach = eval(byeach)//evals the root object to a "real" object (note add some eval safty)
			var template = element.template;//gets out the template!
			var commands = template.match(/\[\[[^]+?\]\]/ig);//matches template strings
			var replace = []; //container for the template variables
			for(var i = 0; i < commands.length; i++){//
				var command = commands[i].slice(2, -2);//removes the two brackets
				command = command.trim();
				replace.push(command);//pushes it to our container
			}
			for(var i = 0; i < foreach.length; i++){//with foreach we know how many times have to loop as it is the children array
				var result = template;//result is the output variable. we set it to the template so we can replace everything nicely
				for(var k = 0; k < replace.length; k++){//now we loop over replace (the command container) and each time swap in real data to our template variables
					var replacement = byeach + "[" + i + "]." + replace[k];//build the whole identifyer. will end up as data.blah[].stuff
					replacement = eval(replacement);//makes replacement a real object (again eval safty)
					var re = new RegExp('\\[\\[(\\s*'+ RegExp.quote(replace[k]) +'\\s*)\\]\\]', 'ig');//finds our replaceable strings in the template
					result = result.replace(re, replacement);//replaces them while leaving the rest of the template untouched. laser guided string editing.
				}
				element.insertAdjacentHTML('beforeend', result);//adds each element via insertAdjacentHTML. should keep things quick and not trash the DOM.
			}*/
		} else{
			element.innerHTML = JSON.stringify(data);//stringifys and dumps the data.
		}
	});
}

//loader for loading raw resources.
function loader (element) {
	ajax.send({'verb':'GET', 'url':element.attributes.url.value, 'json':'false'}, function(data){
		element.innerHTML = data;
	});
}

function defferer (element) {//defferer: defferes a load action untill a click event is fired
	if (element.attributes.defualt !== "undefined") {//check to see if we can set a default value.
		element.innerHTML = element.attributes.default.value;//usefull if you need to populate a element with some sort of content
	}
	var bind = element.attributes.action.value;//gets the id of the element to listen on
	bind = bind.replace('#', '');//strips any # characters
	bind.trim();//trims it up
	var e = document.getElementById(bind);
	e.addEventListener('click', function(){//the actuall event listing.
		new templater(element);
	});
}

function elementer(element){
	window.test = element[0];
	for(var i = 0; i < element.length; i++){
		element[i].template = element[i].innerHTML;//saves any innerHTML as a template. technically we could also use this to restore non-templated HTML
		element[i].innerHTML = "";
		if (typeof element[i].attributes.action !== "undefined"){//checks for action attr(deprecated)
			new defferer(element[i]);
		} else if (typeof element[i].attributes.raw !== "undefined" && element[i].attributes.raw.value == true){
			new loader(element[i]);
		} else {
			new templater(element[i]);
		}
	}
}

var verb = {
	get: function(element, args){//GET
		var element = element;
		if(typeof element === "undefined"){//this dance should let us progmatically access elements. usefull if you want to manually invoke the routine on say <div>s or <ul>s
			element = document.getElementsByTagName('get');
		}
		new elementer(element);
	},
	post: function(element, url, args){//POST: due to its nature and use in submitting forms we will have some POST specific stuff here
		var element = element;
		if(typeof element === "undefined"){
			element = document.getElementsByTagName('post');
		}
		new elementer(element);
	}
},

ajax = {//class for ajax interaction. as a bonus you can do basic requests via: ajax.send('VERB', url, function(var){ //etc });
	//needs error handling, jsonp handling, non json request handling, progress handling, proper post handling
	send: function(args, callback){// args takes object of: {verb, url, headers, json}
		if (typeof args.json === "undefined"){
			args.json = true;
		}
		var req = new XMLHttpRequest();
		req.open(args.verb, args.url);
		//req.setRequestHeader('Content-Type', 'text/xml');
		if(typeof args.headers !== "undefined"){
			headers.forEach(function(value, key){
				req.setRequestHeader(key, value);
			});
		}
		//set ready state
		req.onload = res;
		req.send();
		function res(){
			if (args.json){
				callback(JSON.parse(this.response), this.status);
			} else {
				callback(this.response, this.status);
			}
		}
	}
};

document.addEventListener("DOMContentLoaded", function(event) {//kick off the party when the DOM is ready.
	verb.get();
	verb.post();
});
