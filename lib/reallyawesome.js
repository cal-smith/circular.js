/*
*todo!
*input safety. pass the attrs though escaping. of course you still need a safe serverside, but this would stop any silly client side bugs.
*
*
*/

RegExp.quote = function(str) {//quotes out regex reserved characters. usefull for inserting variables in regex's
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

var ra = {//namespaces us to window.ra.
	//templater works exclusivly with json. all non json requests get passed to loader
	templater: function(element){
		ajax.send({'verb':'GET', 'url':element.attributes.url.value}, function(data){
			element.innerHTML = "";//clears any default values etc.
			var template = 	Handlebars.compile(element.template);
			if (typeof element.attributes.wrap !== "undefined") {
				data[element.attributes.wrap.value] = data;
				console.log(data);
			}
			element.innerHTML = template(data);//also htmlfrag and append. speed is important.
		});
	},

	//loader for loading raw resources.
	loader: function(element) {
		ajax.send({'verb':'GET', 'url':element.attributes.url.value, 'json':'false'}, function(data){
			element.innerHTML = data;//switch to htmlfrag and append. much faster.
		});
	},

	defferer: function(element) {//defferer: defferes a load action untill a click event is fired
		console.log(element.attributes.url.value);
		var bind = element.attributes.action.value;//gets the id of the element to listen on
		bind = bind.replace('#', '');//strips any # characters
		bind.trim();//trims it up
		var e = document.getElementById(bind);
		e.addEventListener('click', function(){//the actuall event listing.
			new ra.templater(element);
		});
	},

	elementer: function(element){
		for(var i = 0; i < element.length; i++){
			element[i].template = element[i].innerHTML;//saves any innerHTML as a template. technically we could also use this to restore non-templated HTML
			element[i].innerHTML = "";
			if (typeof element[i].attributes.default !== "undefined") {//check to see if we can set a default value.
				element[i].innerHTML = element[i].attributes.default.value;//usefull if you need to populate a element with some sort of content
			}
			if (typeof element[i].attributes.action !== "undefined"){//checks for action attr
				new ra.defferer(element[i]);
			} else if (typeof element[i].attributes.type !== "undefined" && (element[i].attributes.type.value == "html" || element[i].attributes.type.value == "raw" || element[i].attributes.type.value == "json")){
					//currently we just dump everything in a "raw" format, however in the future these "hooks" could be used to define different data processing
					new ra.loader(element[i]);
			} else {
				new ra.templater(element[i]);
			}
		}
	},

	verb: {
		get: function(element, args){
			var element = element;
			if(typeof element === "undefined"){//this dance should let us progmatically access elements. usefull if you want to manually invoke the routine on say <div>s or <ul>s
				element = document.getElementsByTagName('get');
			}
			new ra.elementer(element);
		},
		post: function(element, args){
			var element = element;
			if(typeof element === "undefined"){
				element = document.getElementsByTagName('post');
			}
			new ra.elementer(element);
		}
	},

	init: function(){
		document.addEventListener("DOMContentLoaded", function(event) {//kick off the party when the DOM is ready.
			ra.verb.get();
			//ra.verb.post();
		});
	}

}