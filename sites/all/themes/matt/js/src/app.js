(function($){
	appObject = function(basepath){

		//Private
		var _path = basepath;
		var _browserHandler = new browserHandler();
		var _nav = {};
		var _album = {};


		//Public


		/********************
		Init function */

		this.init = function(initNavHeight){


			//Alter js class
			$('html').removeClass('no-js');


			//Navigation
			_nav = new navHandler();
			_nav.init();
			

			//Album
			if ($('#albumCover').length > 0) {
				_album = new albumHandler();
				_album.init();
			}
		};

			

		/********************
		Getters and Setters */



		/********************
		Helpers */

		/**
		* Check a cetain width
		* @param target (int) : The target width to check against
		* @return boolean
		*/
		this.checkWidth = function(target){
			_browserHandler.findBrowserWidth();
			var w = _browserHandler.getBrowserWidth();
			if (w >= target) {
				return true;
			}else{
				return false;
			}
		};


		/********************
		Resize events */

		


		/********************
		Scroll events */



	};
})(jQuery);
