function ParallaxMap(DOMElement, googleMap) {
	this.element;
	this.subElements;
	this.speed;
	this.height;
	this.vertical;
	this.currentOffset;

	this.construct = function(DOMElement, googleMap) {
		this.element = DOMElement;
		this.subElements = new Array();
		this.speed = 0;
		this.height = this.element.clientHeight;
		this.vertical = true;
		this.currentOffset = 0;
		this.map = googleMap;

		//Get speed
		if(this.element.getAttribute("data-speed")!="" &&
				this.element.getAttribute("data-speed")!= null) 
			this.speed = 1+parseFloat(this.element.getAttribute("data-speed"));
		
		//Find chilren
		var subDivs = this.element.getElementsByTagName("div");
		for(var i = 0; i < subDivs.length; i++) {
			if(subDivs[i].className == "parallax") {
				this.subElements.push(new ParallaxSection(subDivs[i]));
			}
		}
	}
	
	this.update = function(scrollOffset) {
		//Only move if it makes a difference
		if(this.speed != 0) {
			var offset = ElementUtils.locationInView(this.element, scrollOffset);
			
			if(offset != null) {
				if(this.vertical) {
					this.map.panBy(0, -(this.currentOffset-offset)*this.speed);
				} else {
					//TODO: Make horizontal scrolling
				}

				this.currentOffset = offset;
			}
		}
		//Update children if any
		for(var i = 0; i < this.subElements.length; i++) {
			this.subElements[i].update(scrollOffset);
		}
	}

	this.setSpeed = function(speed) {
		this.speed = 1+speed;

		if(speed == 0) {
			this.currentOffset = 0;
		}
	}
	
	this.construct(DOMElement, googleMap);
}
