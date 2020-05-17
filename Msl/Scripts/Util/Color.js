
Util.Color = {
	TYPE_HEXSTRING:"hexstring"
	,TYPE_RGB:"rgb"
	,TYPE_HSL:"hsl"
	,Instance :function(type, data){
		switch(type){
			case Util.Color.TYPE_HEXSTRING:
				//[this.red, this.green, this.blue] = Util.Color.HexStringToRgb(data);
				[this.red, this.green, this.blue] = Util.Color.ColorNameOrHexStringToRgb(data);
				[this.hue, this.saturation, this.lightness] = Util.Color.RgbToHsl(this.red, this.green, this.blue);	
			break;
			case Util.Color.TYPE_RGB:
				this.red = 1*data[0];	if((this.red > 0 && this.red < 1) || this.red > 360) throw red;
				this.green = 1*data[1];	if((this.green > 0 && this.green < 1) || this.green > 360) throw green;
				this.blue = 1*data[2];	if((this.blue > 0 && this.blue < 1) || this.blue > 360) throw blue;					
				[this.hue, this.saturation, this.lightness] = Util.Color.RgbToHsl(this.red, this.green, this.blue);
				break;
			
			case Util.Color.TYPE_HSL:
				this.hue = 1*data[0]; 			if((this.hue > 0 && this.hue < 1) || this.hue > 360) throw hue;
				this.saturation = 1*data[1];	if((this.saturation > 0 && this.saturation < 1) || this.saturation > 100) throw saturation;
				this.lightness = 1*data[2];	if((this.lightness > 0 && this.lightness < 1) || this.lightness > 100) throw lightness;
				[this.red, this.green, this.blue] = Util.Color.HslToRgb(this.hue, this.saturation, this.lightness);
				break;
			
			default: throw "Color type " + type + " not recognized";
		}
		
		
		this.ToCssColor = function(){
			return "rgb(" + (this.red) + "," + this.green + "," + this.blue + ")";
		}
		
		this.ToCssFilter = function(){
			return "hue-rotate(" + (this.hue) + "deg)" + " saturate(" + this.saturation + "%) brightness(" + this.lightness + "%)";
		}
		
		this.ToHexString = function(){
			var red 	= Number(this.red).toString(16);	if (red.length < 2)		red  = "0" + red;
			var green 	= Number(this.green).toString(16);	if (green.length < 2)	green  = "0" + green;
			var blue	= Number(this.blue).toString(16);	if (blue.length < 2)	blue  = "0" + blue;
			return "#" + red+green+blue;
		}
		
		this.SetRed = function(value){this.red = value; this.RecalcHsl();}
		this.SetGreeh = function(value){this.green = value; this.RecalcHsl();}
		this.SetBlue = function(value){this.blue = value; this.RecalcHsl();}	
		
		this.SetHue = function(value){this.hue = value; this.RecalcRgb();}
		this.SetSaturation = function(value){this.saturation = value; this.RecalcRgb();}
		this.SetLightness = function(value){this.lightness = value; this.RecalcRgb();}
		
		this.RecalcHsl = function(){[this.hue, this.saturation, this.lightness] = Util.Color.RgbToHsl(this.red, this.green, this.blue);}
		this.RecalcRgb = function(){[this.red, this.green, this.blue] = Util.Color.HslToRgb(this.hue, this.saturation, this.lightness);}
	}

	,ColorNameOrHexStringToRgb(colorNameOrHexString){
		if(! colorNameOrHexString.startsWith("#"))
			colorNameOrHexString = Util.Color.colorNameOrHexString(colorNameOrRgb);
		return Util.Color.HexStringToRgb(colorNameOrHexString);
	}
	
	/*
	,colorNameToHexString(colorName){
		var d = document.createElement("div");
		d.style.color = colorName;
		document.body.appendChild(d)
		var hexString = window.getComputedStyle(d).color;
		d.parentNode.removeChild(d);
		return hexString;
	}*/
	
	,HexStringToRgb(hexString) {
		if(hexString.startsWith("#")) hexString  = hexString.substring(1);
		var r = 0, g = 0, b = 0;
		
		if (hexString.length == 3) {
			r = parseInt(hexString[0], 16) * 16;
			g = parseInt(hexString[1], 16) * 16;
			b = parseInt(hexString[2], 16) * 16;
		} else if (hexString.length == 6) {
			r = parseInt(hexString[0] + hexString[1], 16);
			g = parseInt(hexString[2] + hexString[3], 16);
			b = parseInt(hexString[4] + hexString[5], 16);
		}else{
			throw "CanNotParseColor " + hexString;
		}
	  
		return [r,g,b];
		//return new Util.Color.RgbInstance(r, g, b);
	}
	
	,RgbToHsl(r, g, b) {
		var r = r / 255, g = g / 255, b = b / 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
		
		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			
			h /= 6;
		}
		
		return [parseInt(h*360), parseInt(s*100), parseInt(l*100)];
	}
	
	,HslToRgb(h, s, l){
		var r, g, b, m, c, x
		
		if (!isFinite(h)) h = 0
		if (!isFinite(s)) s = 0
		if (!isFinite(l)) l = 0
		
		h /= 60
		if (h < 0) h = 6 - (-h % 6)
		h %= 6
		
		s = Math.max(0, Math.min(1, s / 100))
		l = Math.max(0, Math.min(1, l / 100))
		
		c = (1 - Math.abs((2 * l) - 1)) * s
		x = c * (1 - Math.abs((h % 2) - 1))
		
		if (h < 1) {
			r = c
			g = x
			b = 0
		} else if (h < 2) {
			r = x
			g = c
			b = 0
		} else if (h < 3) {
			r = 0
			g = c
			b = x
		} else if (h < 4) {
			r = 0
			g = x
			b = c
		} else if (h < 5) {
			r = x
			g = 0
			b = c
		} else {
			r = c
			g = 0
			b = x
		}
		
		m = l - c / 2
		r = Math.round((r + m) * 255)
		g = Math.round((g + m) * 255)
		b = Math.round((b + m) * 255)
		
		return [r,g,b];
	}
}