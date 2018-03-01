(function($){
/*
* Preloader
*/
preLoadImages = function(element,_loadEvent){
	
	var options = {
		delay:200,
		check_timer:300,
		//ondone:function(){ },
		//oneachload:function(image){ },
		fadein:500
	};
	var images = element.find("img"), timer, counter = 0, i = 0, checkFlag = [], delaySum = options.delay;
	

	/*
	* Setup images ready for preload
	*/
	this.loadImgs = function(){

		images.each(function(index){
			/*
			if(navigator.userAgent.match(/MSIE 7.0/i) || navigator.userAgent.match(/MSIE 8.0/i)){
				$(this).css({"visibility":"hidden"});
			}else{
				$(this).css({"visibility":"hidden",opacity:0});
			}
			*/
			$(this).css("visibility","hidden");
			$(this).wrap("<div class='preloader' />");
			checkFlag[index] = false;	
		});

		images = $.makeArray(images);
	
		init();
	};
	
	
	/*
	* Preload the image(s)
	*/
	function init(){
		
		timer = setInterval(function(){
			
			if(counter>=checkFlag.length){
				clearInterval(timer);
				//options.ondone();
				document.dispatchEvent(_loadEvent);
				return;
			}
		
			for(i=0;i<images.length;i++){
				if(images[i].complete===true){
					if(checkFlag[i]===false){
						checkFlag[i] = true;
						//options.oneachload(images[i]);
						counter++;
						delaySum = delaySum + options.delay;
					}
					/*
					if(navigator.userAgent.match(/MSIE 7.0/i) || navigator.userAgent.match(/MSIE 8.0/i)){
						$(images[i]).css("visibility","visible");
					}else{
						$(images[i]).css("visibility","visible").animate({opacity:1},options.fadein);
					}
					*/
					$(images[i]).css("visibility","visible");
					$(images[i]).parent().removeClass("preloader");
					$(images[i]).parent().addClass("loaded");
				}else{
					//$(images[i]).wrap("<div class='preloader' />");
				}
			}
		
		},options.check_timer);	 
	}
	
};
})(jQuery);