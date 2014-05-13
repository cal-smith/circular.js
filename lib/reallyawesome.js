 RegExp.quote = function(str) {//quotes out regex reserved characters. usefull for inserting variables in regex's
	 return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
 };

//templater works exclusivly with json. all non json requests get passed to loader
function templater(element){
	ajax.send({'verb':'GET', 'url':element.attributes.url.value}, function(data){
		element.innerHTML = "";//clears any default values etc.
		var template = 	Handlebars.compile(element.template);
		element.innerHTML = template(data);
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
	for(var i = 0; i < element.length; i++){
		element[i].template = element[i].innerHTML;//saves any innerHTML as a template. technically we could also use this to restore non-templated HTML
		element[i].innerHTML = "";
		if (typeof element[i].attributes.action !== "undefined"){//checks for action attr(deprecated)
			new defferer(element[i]);
		} else if (typeof element[i].attributes.type !== "undefined" && (element[i].attributes.type.value == "html" || element[i].attributes.type.value == "raw" || element[i].attributes.type.value == "json")){
				//currently we just dump everything in a "raw" format, however in the future these "hooks" will be used to define different data processing
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
	post: function(element, args){//POST: due to its nature and use in submitting forms we will have some POST specific stuff here
		var element = element;
		if(typeof element === "undefined"){
			element = document.getElementsByTagName('post');
		}
		new elementer(element);
	}
}

document.addEventListener("DOMContentLoaded", function(event) {//kick off the party when the DOM is ready.
	verb.get();
	verb.post();
});