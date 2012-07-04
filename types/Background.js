Parallax.Background = function(element, parameters) {
	this.target = element;
	this.scrollObject = Parallax.getScrollObject(element);
	this.relative = false;
	
	
	this.update = function() {
		if(!this.scrollObject.inView())
			return;
		
		var scrollOffset = this.scrollObject.getOffset(this.relative);
		console.log(scrollOffset);
	};
	
	this.setParameters = function(parameters) {
		if(typeof parameters == "undefined")
			return;
		
		if(typeof parameters["relative"] != "undefined")
			this.relative = parameters["relative"];
		
		
	};
	
	this.setParameters(parameters);
	var elementParameters = Parallax.parseParametersFromElement(element);
	this.setParameters(elementParameters);
};

Parallax.elementTypes["ParallaxBackground"] = Parallax.Background;
