function ParallaxSection(DOMElement) {
	this.element;
	this.subElements;
	this.speed;
	this.vertical;
	this.imageSize;

	this.construct = function(DOMElement) {
		this.element = DOMElement;
		this.subElements = new Array();
		this.speed = 0;
		this.vertical = true;
		this.imageSize =[0, 0];

		ElementUtils.getBackgroundSize(this.element, this);


		//Get speed
		if(this.element.getAttribute("data-speed")!="" &&
				this.element.getAttribute("data-speed")!= null) 
			this.speed = parseFloat(this.element.getAttribute("data-speed"));

		if(this.speed != 0)
			this.element.style.backgroundAttachment = "fixed";

		this.element.style.backgroundPosition = "50% 50%";
		
		//Find chilren
		var subDivs = this.element.getElementsByTagName("div");
		for(var i = 0; i < subDivs.length; i++) {
			if(subDivs[i].className == "parallaxMap") {
				this.subElements.push(new ParallaxMap(subDivs[i]));
			}
			
			if(subDivs[i].className == "parallax") {
				this.subElements.push(new ParallaxSection(subDivs[i]));
			}
		}
	}

	this.setImageSize = function(size) {
		this.imageSize = size;
		Parallax.step(true);
	}
	
	
	this.update = function(scrollOffset) {
		//Only move if it makes a difference
		if(this.speed != 0) {
			var offset = ElementUtils.locationInView(this.element, scrollOffset);
			
			if(offset != null) {
				
				if(this.vertical) {
					var y = ElementUtils.elementPosition(this.element)[1];
					this.element.style.backgroundPosition = "50% " +
							Math.round(-offset*this.speed + Parallax.windowHeight()/2 - this.imageSize[1]/2) + "px";
				} else {
					//TODO: Make horizontal scrolling
				}
			}
		}
		//Update children if any
		for(var i = 0; i < this.subElements.length; i++) {
			this.subElements[i].update(scrollOffset);
		}

		this.setSpeed = function(speed) {
			this.speed = speed;

			if(speed == 0) {
				this.element.style.backgroundPosition = "50% 50%";
				this.element.style.backgroundAttachment = "scroll";
			}
		}
	}
	
	this.construct(DOMElement);
}
