Parallax.Background = function(element, parameters) {
	this.target = element;
	this.scrollObject = Parallax.getScrollObject(element);
	this.relative = true;
	
	
	this.update = function() {
		console.log(this.scrollObject.inView());
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
};

Parallax.elementTypes["ParallaxBackground"] = Parallax.Background;
