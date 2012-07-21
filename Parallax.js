/*
	Copyright 2012 Erik Hedvall.

    This file is part of Parallax.js.

    Parallax.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Parallax.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Parallax.js.  If not, see <http://www.gnu.org/licenses/>.
*/

var Parallax = {
	iebody: null,
	useIebody: false,
	scrollPositionOld: 0,
	scrollPositionNew: 0,
	windowSize: null,
	scrollbarWidth: null,
	
	elementTypes: new Object(),
	scrollObjects: new Object(),
	elements: new Array(),

	idCounter: 0,
	
	getScrollBarWidth: function () {
		if(Parallax.scrollbarWidth != null)
			return Parallax.scrollbarWidth;


		var inner = document.createElement('p');
		inner.style.width = "100%";
		inner.style.height = "200px";

		var outer = document.createElement('div');
		outer.style.position = "absolute";
		outer.style.top = "0px";
		outer.style.left = "0px";
		outer.style.visibility = "hidden";
		outer.style.width = "200px";
		outer.style.height = "150px";
		outer.style.overflow = "hidden";
		outer.appendChild (inner);

		document.body.appendChild (outer);
		var w1 = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		var w2 = inner.offsetWidth;
		if (w1 == w2) w2 = outer.clientWidth;

		document.body.removeChild (outer);

		return Parallax.scrollbarWidth = (w1 - w2);
	},

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
		Parallax.onscroll(true);
	},

	/**
	 * This method should be called when the user scrolls the page.
	**/
	onscroll: function(force) {
		
		Parallax.scrollPositionNew = Parallax.useIebody?
				Parallax.iebody.scrollTop : pageYOffset;
		//Only run when the position actually changes
		if(Parallax.scrollPositionNew != Parallax.scrollPositionOld || force) {
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

			Parallax.scrollPositionOld = Parallax.scrollPositionNew;
			
			clearTimeout(Parallax.scrollTimeout);
			Parallax.scrollTimeout = setTimeout("Parallax.onscroll()", 1000/60);
		}
	},

	onresize: function() {
		Parallax.windowSize = null;
		Parallax.onscroll(true);
	},
	
	add: function(parallaxElement) {
		Parallax.elements.push(parallaxElement);
	},
	
	getScrollObject: function(element) {
		var object = Parallax.scrollObjects[element.getAttribute("data-ParallaxID")];
		if(typeof object == "undefined") {
			element.setAttribute("data-ParallaxID", Parallax.idCounter);
			Parallax.idCounter ++;
			object = new Parallax.ScrollObject(element);
			Parallax.scrollObjects[element.getAttribute("data-ParallaxID")] = object;
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
				
				var value = pair[1].trim().split(" ");

				if(value.length == 1)
					parameters[pair[0].trim()] = Parallax.fixParameterDataType(value[0].trim());
				else {
					for(var j = value.length; j--;)
						value[j] = Parallax.fixParameterDataType(value[j].trim());

					parameters[pair[0].trim()] = value;
				}
			}
		}
		
		return parameters;
	},

	fixParameterDataType: function(value) {
		if(value.toLowerCase() == "true" || value.toLowerCase() == "false")
			return value.toLowerCase() == "true";
		else if((value.endsWith("px") || value.endsWith("%")) && typeof parseFloat(value) != "NaN")
			return value;
		else if(""+parseFloat(value) != "NaN")
			return parseFloat(value);

		return value;
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

		Parallax.windowSize = [winW-Parallax.getScrollBarWidth(), winH];
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

