(function($){
/**
* Control aspects of the contact page
*/
albumHandler = function(){

	//Private
	var _basepath = '';
	var _browserHandler = new browserHandler();
	var _preloader = {};
	var _currImg = 0;
	var _nextImg = 0;
	var _totalImages = 0;
	var _loadEvent;
	var _moveAmount = 0;
	var _theDir = '';
	var _nextImgDiv = {};
	var myScroll = {};
	var _isScrolling = false;
	var _liWidthEst = 30;


	/********************
	* Getters and Setters
	*/
	this.setBasePath = function(path){
		_basepath = path;
	};
	/********************/


	/**
	* Init function
	*/
	this.init = function (){
		//Check pager length and trim if needed
		_alterPager();

		_totalImages = $('.albumimg').length;
		_bindPanes();
		_bindPager();
		_loadEvent = new Event('_loadEvent');
		document.addEventListener('_loadEvent',_imgLoaded,false);

		//Alter page width
		var width = parseInt($('.loaded img').attr('width'));
		_alterPageWidth(width);
		//console.log(width);

		//Set width of 1st image if needed
		$('#image_0').css('max-width',width);

	};

	/**
	* Bind left and right panes
	*/
	function _bindPanes(){
		$('#albumCover').on('click','.paneNav',function(){
			_theDir = $(this).attr('data-dir');
			_newImg(false);
		});
	}

	/**
	* Bind pager items
	*/
	function _bindPager(){
		$('.pager li a').each(function(index,el){
			$(this).on('click',function(){
				if (!_isScrolling) {
					_nextImg = index;
					_newImg(true);
					_activePager(index);
				}
			});
		});
	}

	/**
	* Create hidden pager if needed
	*/
	function _alterPager(){
		if ($('.scrollify').length > 0) {
			var pagerLength = $('.pager li').length;
			var newWidth = _liWidthEst*pagerLength; //_liWidthEst = estimate of avg width of each li
			$('#pagerWrap ul').css('width',newWidth);
			myScroll = new IScroll('#pagerWrap',{
				scrollY: false,
				scrollX: true
				//useTransform: false
			});
			myScroll.on('scrollStart', function(){
				_isScrolling = true;
			});
			myScroll.on('scrollEnd', function(){
				_isScrolling = false;
			});
		}
	}

	/**
	* Active pager
	* @param index (int) - id pos of pager to activate
	*/
	function _activePager(index){
		$('.activePage').removeClass('activePage');
		$('#pager_'+index+' a').addClass('activePage');
		//Update x position of pager if needed
		if ($('#pagerWrap').hasClass('scrollify')) {
			var pagerWidth = $('#pagerWrap').width();
			var ulWidth = $('#pagerWrap ul').width();
			
			var liPos = _liWidthEst * index;
			var halfPager = pagerWidth / 2;
			if ((liPos > halfPager) && (liPos < (ulWidth-halfPager))) {
				
				
				if (_theDir == 'left') {
					liPos = liPos - (pagerWidth/2);	
				}else{
					liPos = (liPos-_liWidthEst) - (pagerWidth/2);
				}
				
				var newMove = liPos * -1;
				
				myScroll.scrollTo(newMove, 0, 300);
			}
		}
	}

	/**
	* Alter #page width
	* @param width (int) - the width of the image in the album
	*/
	function _alterPageWidth(width){
		if (width < 1200) {
			$('#page').css('max-width','950px');
		}else{
			$('#page').css('max-width','1200px');
		}
	}

	/**
	* Move the main image across - based on dir - and set a new image
	* @param pager (boolean) - is this a call from the pager or panes
	*/
	function _newImg(pager){
		if (!pager) {
			//Obtain next img - based on _currImg + _theDir - set to pos ab - preload img ready for move
			if (_theDir == 'left') {
				_nextImg = _currImg - 1;
			}else{
				_nextImg = _currImg + 1;
			}
		}else{
			//Fake _theDir to ensure that images move correctly
			_theDir = (_nextImg > _currImg)? 'right' : 'left';
		}

		//Check range
		if (_nextImg >= 0 && _nextImg < _totalImages) {

			//Set hight of album to the curr imge as this will go absolute and loose ref
			var currImgHeight = $('.active img').css('height');
			$('#album').css('height',currImgHeight);

			//Make the curr img pos:ab for movement
			$('.active').css('position','absolute');

			//Detemine position and move amount
			var nextLeft = parseInt($('.active img').width()) + 10;//10 = margin
			if (_theDir == 'left') {
				//Reverse
				nextLeft = nextLeft * -1;
			}
			_moveAmount = nextLeft;

			//Ready new image
			_nextImgDiv = $('#image_'+_nextImg);

			//Obtain the src for the next img - height is always needed!
			var imgOptions = {};
			$(_nextImgDiv).find('span').each(function(index,el){
				switch(index){
					case 0:
						imgOptions.src = $(el).text();
					break;
					case 1:
						imgOptions.width = $(el).text();
					break;
					case 2:
						imgOptions.height = $(el).text();
					break;
					case 3:
						imgOptions.alt = $(el).text();
					break;
				}
			});

			_alterPageWidth(imgOptions.width);

			_nextImgDiv.removeClass('hidden');
			_nextImgDiv.addClass('moving');
			_nextImgDiv.css({
				position: 'absolute',
				left: nextLeft,
				maxWidth: imgOptions.width+'px'
			});

			//Check if img exists for insert
			if($(_nextImgDiv).find('img').length === 0){
				_nextImgDiv.addClass('image'+imgOptions.width);
				_nextImgDiv.prepend('<img class="noopac" src="'+imgOptions.src+'" width="'+imgOptions.width+'" height="'+imgOptions.height+'" alt="'+imgOptions.alt+'" />');
				//_nextImgDiv.find('img').css('opacity',0);

				//Preload img - onload fires event to call _imgLoaded();
				_preloader = new preLoadImages(_nextImgDiv,_loadEvent);
				_preloader.loadImgs();
			}else{
				$(_nextImgDiv).find('img').removeClass('noopac');
			}

			//Move stuff!
			//Need to move the 2 imgs on screen based on _theDir		
			var activeNewLeft = _moveAmount * -1;
			var movingNewLeft = 0;
			//Animate using js to catch a finish event
			$('.active img').addClass('noopac');
			$('#album').css('height',imgOptions.height);
			$('.active').animate({left:activeNewLeft}, 800, function(){});
			_nextImgDiv.animate({left:movingNewLeft}, 800, function(){
				//Remove classes, ab pos
				$('.active').removeClass('active').css({
					position: 'static',
					left: 0
				}).addClass('hidden');
				$('.active img').removeClass('noopac');

				//
				$(this).removeClass('moving').css({
					position: 'static',
					left: 0
				}).addClass('active');

				//
				/*
				var actualImgHeight = $(this).find('img').height();
				$('#album').animate({height:actualImgHeight}, 400, function(){
					$(this).css('height','auto');
				});
				*/
				//$('#album').css('height',imgOptions.height);
				$('#album').css('height','auto');
				_currImg = _nextImg;
				_activePager(_currImg);

				//Obtain the text if any to go with the image
				if (imgOptions.alt) {
					_loadText(imgOptions.alt);
				}
			});

		}

	}

	/**
	* Load up text if it exists
	* nodeTitle (string) - title of the node
	*/
	function _loadText(nodeTitle){
		$.getJSON(_basepath+"/getMyText/"+nodeTitle)
		.done(function(json) {
			//console.log(json);
			//if (json.content !== '') {
				if (json.new) {
					//New image meta text has come through
					$('#content_text').animate({opacity:0},300,function(){
						$('#content_text').html(json.content);
						$('#content_text').animate({opacity:1},300,function(){});
						$('#content_text').removeClass('albumTextYes');
					});
				}else{
					//Album text has come through - only change if needed - Note: we might be changing the content to nothing!
					if (!$('#content_text').hasClass('albumTextYes')) {
						$('#content_text').animate({opacity:0},300,function(){
							$('#content_text').html(json.content);
							$('#content_text').animate({opacity:1},300,function(){});
							$('#content_text').addClass('albumTextYes');
						});
					}
				}
			//}
		})
		.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ', ' + error;
			console.log( "Request Failed: " + err);
		});
	}


	/**
	* An image has loaded via a listener event
	*/
	function _imgLoaded(){
		//_nextImgDiv.find('img').css('opacity',1);
		_nextImgDiv.find('img').removeClass('noopac');
		_nextImgDiv = {};//Reset
	}



};
})(jQuery);
