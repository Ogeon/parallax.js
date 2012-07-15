var Parallax = {
	iebody: null,
	useIebody: false,
	scrollPosition: 0,
	scrollOffset: 0,
	scrollTimeout: null,
	useParallax: true,
	windowSize: null,
	
	elementTypes: new Object(),
	scrollObjects: new Object(),
	elements: new Array(),
	
	searchDocument: function() {
		var checkElement = function(element) {
			if(element.className) {
				var classes = element.className.split(" ");
				for(var n = classes.length; n--;) {
					if(Parallax.elementTypes[classes[n]])
						Parallax.add(new (Parallax.elementTypes[classes[n]])(element))
				}
			}
		};
		
		var searchChildren = function(element) {
			var children = element.childNodes;
			for(var i = children.length; i--;) {
				var child = children[i];
				checkElement(child);
				searchChildren(child);
			}
		};
		
		checkElement(document.body);
		searchChildren(document.body);
		Parallax.step(true);
	},

	/**
	 * This method should be called when the user scrolls the page.
	**/
	onscroll: function() {
		if(!Parallax.useParallax)
			return;
		
		Parallax.scrollOffset = Parallax.useIebody?
				Parallax.iebody.scrollTop : pageYOffset;

		Parallax.step();
	},

	onresize: function() {
		Parallax.windowSize = null;
		Parallax.step(true);
	},

	/**
	 * Updates all parallax elements. This process is internal and will be
	 * triggered with Parallax.init().
	**/
	step: function(force) {
		if(!Parallax.useParallax)
			return;
		var offset = Parallax.scrollOffset;
		//Only run when the position actually changes
		if(offset != Parallax.scrollPosition || force) {
			var scrollObjects = Parallax.scrollObjects;
			for (var k in scrollObjects) {
				if (scrollObjects.hasOwnProperty(k)) {
					scrollObjects[k].update();
				}
			}
			
			var elements = Parallax.elements;
			for(var i = elements.length; i--;) {
					elements[i].update();
			}

			Parallax.scrollPosition = Parallax.scrollOffset;
			
			Parallax.scrollTimeout = setTimeout("Parallax.step()", 1000/60);
		} else {
			//Parallax.scrollTimeout = setTimeout("Parallax.step()", 1000/10);
		}

		
		
	},

	/**
	 * Enables or disables the parallax effects. It will stop the initiation of
	 * the effects if called with false before Parallax.init() is called. The
	 * parallax effects are enabled as default.
	 *
	 * Parameters:
	 * enable - pass true if the parallax effects should be used. Pass false
	 * 			otherwise.
	**/
	enable: function(enable) {
		Parallax.useParallax = enable;
	},
	
	add: function(parallaxElement) {
		Parallax.elements.push(parallaxElement);
	},
	
	getScrollObject: function(element) {
		var object = Parallax.scrollObjects[element];
		if(typeof object == "undefined") {
			object = new Parallax.ScrollObject(element);
			Parallax.scrollObjects[element] = object;
		}
		
		return object;
	},
	
	parseParametersFromElement: function(element) {
		var parameters = new Object();
		
		if(element.getAttribute("data-parallax")) {
			var paramStrings = element.getAttribute("data-parallax").split(";");
			
			for(var i = paramStrings.length; i--;) {
				var pair = paramStrings[i].split(":");
				if(pair.length != 2)
					continue;
				
				var value = pair[1].trim();
			
				if(value.toLowerCase() == "true" || value.toLowerCase() == "false")
					parameters[pair[0].trim()] = value.toLowerCase() == "true";
				else if((value.endsWith("px") || value.endsWith("%")) && typeof parseFloat(value) != "NaN")
					parameters[pair[0].trim()] = value;
				else if(typeof parseFloat(value) != "NaN")
					parameters[pair[0].trim()] = parseFloat(value);
			}
		}
		
		console.log(parameters);
		return parameters;
	},
	
	windowWidth: function() {
		var winW = 0;

		if(Parallax.windowSize == null)
			Parallax.updateWindowSize();

		winW = Parallax.windowSize[0];

		return winW;
	},

	windowHeight: function() {
		var winH = 0;

		if(Parallax.windowSize == null)
			Parallax.updateWindowSize();

		winH = Parallax.windowSize[1];

		return winH;
	},

	updateWindowSize: function() {
		var winW = winH= 0;
		if (document.body && document.body.offsetWidth) {
			winW = document.body.offsetWidth;
			winH = document.body.offsetHeight;
		}
		if (document.compatMode=='CSS1Compat' &&
				document.documentElement &&
				document.documentElement.offsetWidth ) {
			winW = document.documentElement.offsetWidth;
			winH = document.documentElement.offsetHeight;
		}
		if (window.innerWidth && window.innerHeight) {
			winW = window.innerWidth;
			winH = window.innerHeight;
		}

		Parallax.windowSize = [winW, winH];
	}
};

Parallax.ScrollObject = function(element) {
	this.target = element;
	this.position = [0, 0];
	this.inside = false;
	
	this.update = function() {
		var bounds = this.target.getBoundingClientRect();
		this.position = [
				(bounds.left + bounds.right)/2 - Parallax.windowWidth()/2,
				(bounds.top + bounds.bottom)/2 - Parallax.windowHeight()/2
			];
		
		this.inside =
				bounds.right >= 0 && bounds.left <= Parallax.windowWidth() &&
				bounds.bottom >= 0 && bounds.top <= Parallax.windowHeight();
	};
	
	this.getOffset = function(relative) {
		if(relative)
			return {
					x: this.position[0]/Parallax.windowWidth(),
					y: this.position[1]/Parallax.windowHeight()
				};
		else
			return {x: this.position[0], y: this.position[1]};
	};
	
	this.inView = function() {
		return this.inside;
	}
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

