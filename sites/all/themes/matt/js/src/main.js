(function($){
	
	var app = {};

	/**
	* Initiating function that carries the scope
	*/
	$.fn.loadSite = function(basepath) {
		app = new appObject(basepath);	
	};
	


	//Chrome does not like document.ready
	$(window).load(function(){
		app.init();
	});

	/**
	* Resize event
	*/
	$(window).bind('resize', function () {
		
	});

	/**
	* Scroll event
	*/
	$(window).bind('scroll', function (event) {
	  
	});



})(jQuery);