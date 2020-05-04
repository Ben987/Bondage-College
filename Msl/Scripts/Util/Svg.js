'use strict'

Util.Svg = {
	CurvedArrow(startX, startY, endX, endY, aspectRatio){
		startX /= aspectRatio;
		endX /= aspectRatio;
		var midX = startX, midY = startY, viewBoxWidth = 100 / aspectRatio;
		
		var pathString = "M" + startX +"," + startY +" C" + startX + "," + startY + " " + midX + "," + midY + " " + endX +"," + endY;
		
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		svg.setAttribute("viewBox", "0 0 "+viewBoxWidth+" 100");
		svg.innerHTML = "<defs><marker id='head' orient='auto' markerWidth='2' markerHeight='4' refX='0.1' refY='2'>"
				+ "<path d='M0,0 V4 L2,2 Z' fill='red'/>"
				+ "</marker></defs>"
				+ "<path id='arrow-line' marker-end='url(#head)' stroke-width='2' fill='none' stroke='white' d='"+pathString+"' ></path>"
				+ "</svg>"
		svg.style.position = "absolute";
		svg.style.width="100%";
		svg.style.height="100%";
		return svg;
	}
}