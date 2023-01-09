/*
 * Personal website of André Niet
 * hello@andreniet.de 
 */

/* Namespaces */
var Logger = Logger || {};
var DOMUtils = DOMUtils || {};
var Website = Website || {};
var Event = Event || {};
var MathUtils = MathUtils || {};

/* Logger */
Logger.log = function (argument) {
	console.log(argument)
};

/* DOM Utils */
DOMUtils.hasClass = function (ele,cls) {
	if (!ele) return;
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};
 
DOMUtils.addClass = function (ele,cls) {
	if (!ele) return;
	if (!this.hasClass(ele,cls)) ele.className += " "+cls;
};
 
DOMUtils.removeClass = function (ele,cls) {
	if (!ele) return;
	var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
	ele.className = ele.className.replace(reg,' ');
};

DOMUtils.getElementsByClassName = function(ele, cl) {
	var returnNodes = [];
	var myclass = new RegExp('\\b'+cl+'\\b');
	var elem = ele.getElementsByTagName('*');
	for (var i = 0; i < elem.length; i++) {
		var classes = elem[i].className;
		if (myclass.test(classes)) returnNodes.push(elem[i]);
	}
	return returnNodes;
}; 

/* Website */
Website.initWebsite =  function () {
    this.initCanvas();
    // Show Website 
	this.showWebsite();
};

Website.showWebsite = function () {
	DOMUtils.addClass(document.getElementsByTagName('body')[0], 'show');
};

Website.initCanvas = function () {
	var pauseDrawing;
	var fillStyleColor = "#333" // dark grey
	var compositeTypes = [
	  'source-over','source-in','source-out','source-atop',
	  'destination-over','destination-in','destination-out','destination-atop',
	  'lighter','darker','copy','xor'
	];
	// Check devices
	this.isTablet = DetectTierTablet();
	this.isMobile = DetectTierIphone();

	var canvas = document.getElementsByTagName('canvas')[0];
	canvas.width = window.innerWidth + 100;
  canvas.height = window.innerHeight + 100;
	var ctx = canvas.getContext("2d");
	//set the fill color
	ctx.fillStyle = fillStyleColor

	//draw a filled rectangle
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = 1;
	ctx.globalCompositeOperation = compositeTypes[6];

	var sign,
		mouseX,
		mouseY,
		previousMouseX,
		previousMouseY;

	var draw = function () {
		if (pauseDrawing || mousePositionHasNotChanged()) {
			return;
		}

		sign = MathUtils.randomNumber(-1, 1);
		ctx.lineWidth = MathUtils.randomNumber(1, 3);
		ctx.beginPath();
		// ctx.rect(mouseX - 2, mouseY - 40, 4, 80);
		ctx.arc(mouseX, 
				mouseY, 
				MathUtils.randomNumber(4, 80), 
				0, 
				Math.PI*2, 
				true); 
	
		ctx.closePath();
		ctx.stroke();

		previousMouseX = mouseX;
		previousMouseY = mouseY;
	}

	var mousePositionHasNotChanged = function () {
		return (mouseX === previousMouseX) && (mouseY === previousMouseY);
	};

	var onMouseMove = function (event) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	};

	var onWindowResize = function (event) {
		ctx.globalCompositeOperation = compositeTypes[0];

		canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = fillStyleColor;
		ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

		ctx.globalCompositeOperation = compositeTypes[6];
	};

	var onToggleButtonClicked = function (event) {
		pauseDrawing = !pauseDrawing;
	}

	// Add listener
	document.addEventListener("mousemove", onMouseMove, true);	
	// Toggle drawing button
	var toggleButton = document.getElementById("toggle_drawing_button");
	toggleButton.addEventListener("click", onToggleButtonClicked, true);
	
	var initDrawCount = 20
	if (this.isMobile) {
    	this.fitForSmartphones();
    	initDrawCount = 20
    } else if (Modernizr.canvas && !this.isTablet) {
    	// No canvas drawing for touch devices because of rendering issues
    	// while drawing when scrolling

		setInterval(draw, 30);
		window.addEventListener('resize', onWindowResize, false);

    } else if (this.isTablet) {
    	this.fitForTablets();
    }

	for (var i = initDrawCount; i >= 0; i--) {
		mouseX = MathUtils.randomNumber(0, canvas.width);
		mouseY = MathUtils.randomNumber(0, canvas.height);
		draw();
	}
}

Website.fitForSmartphones = function () {
	// Set a timeout...
	setTimeout(function(){
		// Hide the address bar
		window.scrollTo(0, 1);
	}, 0);

	// Add css class mobile
	DOMUtils.addClass(document.getElementsByTagName('html')[0], 'mobile');
};

Website.fitForTablets = function () {
	// Set a timeout
	setTimeout(function(){
		// Hide the address bar
		window.scrollTo(0, 1);
	}, 0);

	// Add css class mobile
	DOMUtils.addClass(document.getElementsByTagName('html')[0], 'tablet');
}

MathUtils.randomNumber = function (minVal,maxVal) {
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return Math.round(randVal);
}

// Wait for load complete
window.onload = function() {
	Website.initWebsite(); 	
};

