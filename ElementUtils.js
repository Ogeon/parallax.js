var ElementUtils = {
	locationInView: function(obj, scrollOffset) {
		var y = ElementUtils.elementPosition(obj)[1];
		var winH = Parallax.windowHeight();
		var height = obj.clientHeight;
		
		if((scrollOffset < y + height) && (scrollOffset + winH > y))
			return y - scrollOffset + height/2 - winH/2;
		else
			return null;
	},

	elementPosition: function(obj, moving) {
		/*if(typeof obj.position != "undefined" && !moving)
			return obj.position;*/

		var curleft = curtop = 0;
		var o = obj;
		if (o.offsetParent) {
			do {
				curleft += o.offsetLeft;
				curtop += o.offsetTop;
			} while (o = o.offsetParent);
		}

		obj.position = [curleft,curtop];

		return [curleft,curtop];
	},

	getBackgroundSize: function(obj, caller) {

		if(obj.currentStyle) {
			bac = obj.currentStyle.backgroundImage;
		} else {
			bac = getComputedStyle(obj,'').getPropertyValue('background-image');
		}

		var imageSrc = bac.replace(/"/g, '').replace(/url\(|\)$/ig, '');    

		new ElementUtils.imageMeasurer(imageSrc, caller);
	},

	imageMeasurer: function(src, caller){
		var image;
		var caller = caller;
		var src = src;

		function imageloadpost(){
			caller.setImageSize([image.width, image.height]);
		}


		image=new Image();
		image.src=src;
		image.onload=function(){
			imageloadpost();
		}
		image.onerror=function(){
			imageloadpost();
		}

	}
};
