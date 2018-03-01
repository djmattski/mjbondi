// JavaScript Document
window.addEvent('domready', function() {
	
	/*
	* Public vars
	*/
	var imageCount = -1;
	var currImage = 0;
	var newHeight = 0;
	var newWidth = 0;
	var deltaHeight = 0;
	var maxHeight = 750;
	

	//
	
	/*
	* Set the initial css properties for all images
	*/
	var allImages = $$('#album div.image');
	if(allImages != null){
		allImages.each(function(el,index){
			if(index == 0){
				
				//Set the height of the album to the height of the image
				/*
				newHeight = el.getElement('img').getStyle('height');
				newHeight = parseInt(newHeight);
				deltaHeight = (665-newHeight)/2;
				el.setStyle('margin-top',deltaHeight);
				*/
				setCurrent(el,true);
				
			}else{
				el.setStyle('opacity',0);
				el.getElements('span').each(function(tag,index){
					if(index == 1){
						newWidth = tag.get('html');
					}
					if(index == 2){
						newHeight = tag.get('html');
					}
				});
				
				deltaHeight = (710-newHeight)/2;
				heightString = newHeight+'px';
				el.setStyles({
					height:heightString,
					marginTop:deltaHeight
				});
			}
			//
			imageCount++;
		});
		
		//Check for hash tag and jump straight to that image
		var hash = window.location.hash;
		if(hash != ''){
			var destination = hash.substr(1);
			var hashUnderScore = destination.lastIndexOf('_');
			var hashActiveNo = parseInt(destination.substr(hashUnderScore+1));
			//Correct the hash value to correspond with an array type numbering system 0,1,2 etc...
			hashActiveNo --;
			//alert(hashActiveNo);
			doTheSlide(hashActiveNo);
			
		}
	}
	
	
	/*
	* Set the functionality of the left and right panes
	*/
	var theLeft = document.id('leftPane');
		if(theLeft != null){
		$('leftPane').setStyle('opacity',0);
		$('leftPane').set('morph', {duration: 1000, transition: 'sine:in'});
		$('leftPane').addEvents({
			mouseenter: function(){
				this.set('tween', {duration: 800, transition: 'sine:in', link: 'ignore'});
				this.tween('opacity',1);
			},
			mouseleave: function(){
				this.set('tween', {duration: 800, transition: 'sine:in', link: 'ignore'});
				this.tween('opacity',0);
			},
			click: function(){
				
				
				//Alter the active class
				var activeEl = $('album').getElement('.active');
				var newActive = activeEl.getPrevious('div');
				if(newActive){
					currImage --;
					//
					var theTitle = '';
					var filename = '';
					var altText = '';
					newActive.getElements('span').each(function(tag,index){
						if(index == 0){
							filename = tag.get('html');
						}
						if(index == 3){
							theTitle = tag.get('html');
						}
						if(index == 4){
							altText = tag.get('html');
						}
					});
					
					var fileTest = newActive.getChildren('.loaded');
					if(fileTest.length == 0){
						/*var theImg = newActive.getElement('img');
						theImg.setProperties({
							src:filename
						});*/
						var theImg  = new Element('img', {src:filename, alt: altText});
						theImg.inject(newActive, 'top');
						newActive.addEvent('preloaderFinish', function(){
							setCurrent(newActive,false);
						});
						preLoadImages(newActive);
					}else{
						setCurrent(newActive,false);	
					}
					//
					//Grab any text that might accompany the image
					var myElement = $('content_text');
					var myRequest = new Request({
						url: '/getMyText/'+theTitle,
						method: 'get',
						/*onRequest: function(){
							myElement.set('html', 'loading...');
						},*/
						onSuccess: function(responseText){
							myElement.set('html', responseText);
						},
						onFailure: function(){
							myElement.set('html', '');
						}
					});
					myRequest.send();
					//
					
					var currLeft = (currImage*958)*-1;
					activeEl.removeClass('active');
					newActive.addClass('active');
					//
					activeEl.set('tween', {duration: 1500, transition: 'sine:in', link: 'ignore'});
					activeEl.tween('opacity',0);

					// Move to the next item
					$('album').set('tween', {duration: 1500, transition: 'sine:in', link: 'ignore'});
					$('album').tween('left',currLeft);
					//Update the active class of the pager
					var activePager = $$('.pager').getElement('li a.activePage');
					var nextPagerLi = activePager.getParent('li').getPrevious('li');
					if(nextPagerLi){
						activePager.removeClass('activePage');
						nextPager = nextPagerLi.getElement('a');
						nextPager.addClass('activePage');
						//
						activePager.tween('color','#9c9c9c');
						activePager.setStyle('text-shadow', 'none');
						//
						nextPager.tween('color','#000000');
						nextPager.setStyle('text-shadow', '1px 1px 0px #dfdfdf');
					}
					
					//Update the hash
					window.location.hash = theTitle;
				}
			}
		});
		
		//
		$('rightPane').setStyle('opacity', 0);
		$('rightPane').set('morph', {duration: 1000, transition: 'sine:in'});
		$('rightPane').addEvents({
			mouseenter: function(){
				this.set('tween', {duration: 800, transition: 'sine:in', link: 'ignore'});
				this.tween('opacity',1);
			},
			mouseleave: function(){
				this.set('tween', {duration: 800, transition: 'sine:in', link: 'ignore'});
				this.tween('opacity',0);
			},
			click: function(){
				// Move to next
				var activeEl = $('album').getElement('.active');
				var newActive = activeEl.getNext('div');
				if(newActive){
					currImage ++;
					//
					var theTitle = '';
					var filename = '';
					var altText = '';
					newActive.getElements('span').each(function(tag,index){
						if(index == 0){
							filename = tag.get('html');
						}
						if(index == 3){
							theTitle = tag.get('html');
						}
						if(index == 4){
							altText = tag.get('html');
						}
					});
					
					var fileTest = newActive.getChildren('.loaded');
					if(fileTest.length == 0){
						//filename = newActive.getElement('span').get('html');
						//var imageHtml = '<img src="'+filename+'" alt="" />';
						var theImg  = new Element('img', {src:filename, alt: altText});
						/*var theImg = newActive.getElement('img');
						theImg.setProperties({
							src:filename
						});*/
						theImg.inject(newActive, 'top');
						//newActive.set('html',imageHtml);
						newActive.setStyle('background-color','#dfdfdf');
						newActive.set('tween',{duration:500});
						newActive.tween('opacity',0.4);
						newActive.addEvent('preloaderFinish', function(){
							setCurrent(newActive,false);
						});
						preLoadImages(newActive);
					}else{
						setCurrent(newActive,false);
					}
					//Grab any text that might accompany the image
					var myElement = $('content_text');
					var myRequest = new Request({
						url: '/getMyText/'+theTitle,
						method: 'get',
						/*onRequest: function(){
							myElement.set('html', 'loading...');
						},*/
						onSuccess: function(responseText){
							myElement.set('html', responseText);
						},
						onFailure: function(){
							myElement.set('html', '');
						}
					});
					myRequest.send();
					//
					var currLeft = (currImage*958)*-1;
					activeEl.removeClass('active');
					newActive.addClass('active');
					//
					activeEl.set('tween', {duration: 1500, transition: 'sine:in', link: 'ignore'});
					activeEl.tween('opacity',0);
					
					// Move to the next item
					$('album').set('tween', {duration: 1500, transition: 'sine:in', link: 'ignore'});
					$('album').tween('left',currLeft);
					//Update the active class of the pager
					var activePager = $$('.pager').getElement('li a.activePage');
					var nextPagerLi = activePager.getParent('li').getNext('li');
					if(nextPagerLi){
						activePager.removeClass('activePage');
						nextPager = nextPagerLi.getElement('a');
						nextPager.addClass('activePage');
						//
						activePager.tween('color','#9c9c9c');
						activePager.setStyle('text-shadow', 'none');
						//
						nextPager.tween('color','#000000');
						nextPager.setStyle('text-shadow', '1px 1px 0px #dfdfdf');
					}
					
					//Update the hash
					window.location.hash = theTitle;
				}
			}
		});
	}
	
	/*
	* Functionality for pager links
	*/
	$$('.pager li a').each(function(el,index){
		el.addEvent('click',function(event){
			currImage = index;
			doTheSlide(index);
			return false;
		});	
	});
	
	
	/**
	* Engine to move the images across for pager and #hash location
	*/
	function doTheSlide(index){
		
		var activeEl = $('album').getElement('.active');
		var activeNo = activeEl.getProperty('id');
		var underScore = activeNo.lastIndexOf('_');
		activeNo = activeNo.substr(underScore+1);
		
		//
		var diff = 0;
		var delta = 0;
		if(index < activeNo){
			//Move to the left
			diff = activeNo-index;
			delta = 958*diff;
		}else{
			//Move right
			diff = index-activeNo;
			delta = (958*diff)*-1;
		}
		
		//Move the albumCover el
		var allImages = $$('#album div.image');
		allImages.each(function(el,index){
			el.setStyle('background-color','#dfdfdf');
			el.set('tween',{duration:800});
			el.tween('opacity',0.4);
		});
		//
		activeEl.removeClass('active');
		var currLeft = parseInt($('album').getStyle('left'));
		var newLeft = currLeft+delta;
		//
		var fx = new Fx.Tween($('album'), {
			duration: 1500,
			link: 'ignore',
			transition: 'sine:in',
			property:'left'
		});
		fx.start(currLeft,newLeft).chain(function() {
			allImages.each(function(el,index2){
				if(index2 != index){//currImage
					el.tween('opacity',0);
				}
			});
			var newActive = $('album').getElement('#image_'+index);
			var theTitle = '';
			var filename = '';
			var altText = '';
			newActive.getElements('span').each(function(tag,index){
				if(index == 0){
					filename = tag.get('html');
				}
				if(index == 3){
					theTitle = tag.get('html');
				}
				if(index == 4){
					altText = tag.get('html');
				}
			});
			var fileTest = newActive.getChildren('.loaded');
			if(fileTest.length == 0){
				//filename = newActive.getElement('span').get('html');
				//var imageHtml = '<img src="'+filename+'" alt="" />';
				//newActive.set('html',imageHtml);
				/*var theImg = newActive.getElement('img');
				theImg.setProperties({
					src:filename
				});*/
				var theImg  = new Element('img', {src:filename, alt: altText});
				theImg.inject(newActive, 'top');
				newActive.addEvent('preloaderFinish', function(){
					setCurrent(newActive,false);
				});
				preLoadImages(newActive);
			}else{
				setCurrent(newActive,false);
			}
			newActive.addClass('active');
			//Grab any text that might accompany the image
			var myElement = $('content_text');
			var myRequest = new Request({
				url: '/getMyText/'+theTitle,
				method: 'get',
				/*onRequest: function(){
					myElement.set('html', 'loading...');
				},*/
				onSuccess: function(responseText){
					myElement.set('html', responseText);
				},
				onFailure: function(){
					myElement.set('html', '');
				}
			});
			myRequest.send();
			//
			
			//Update the hash
			window.location.hash = theTitle;
		});
		
		
		//Set the pager
		var activePagerLink = $$('.pager').getElement('li a.activePage');
		var newPagerLink = $$('.pager').getElement('#pager_'+index).getElement('a');
		activePagerLink.removeClass('activePage');
		newPagerLink.addClass('activePage');
		//
		activePagerLink.tween('color','#9c9c9c');
		activePagerLink.setStyle('text-shadow', 'none');
		//
		newPagerLink.tween('color','#000000');
		newPagerLink.setStyle('text-shadow', '1px 1px 0px #dfdfdf');
			
	}
	
	
	
	/**
	* Home page showcase functions
	*/
	var show = document.id('showcaseAlbum');
	if(show != null){
		var numImages = 0;
		var homeImages = $$('#showcaseAlbum div');
		homeImages.each(function(el,index){
			numImages ++;
			if(index > 0){
				el.setStyle('opacity',0);
				el.getElements('span').each(function(tag,index){
					if(index == 1){
						newWidth = tag.get('html');
					}
					if(index == 2){
						newHeight = tag.get('html');
					}
				});
				
				deltaHeight = (710-newHeight)/2;
				heightString = newHeight+'px';
				el.setStyles({
					height:heightString,
					marginTop:deltaHeight
				});
			}else{
				el.setStyle('opacity',0);
				el.addEvent('preloaderFinish', function(){
					var newHeight = 0;
					var newWidth = 0;
					var newActiveImg = el.getElements('img');
					newActiveImg.each(function(ele,index){
						newHeight = ele.getStyle('height');
						newHeight = parseInt(newHeight);
						newWidth = ele.getStyle('width');
						newWidth = parseInt(newWidth);
					});
					var deltaHeight = (710-newHeight)/2;
					el.setStyles({
						height:newHeight,
						marginTop:deltaHeight	
					});
					el.set('tween', {duration: 1000, transition: 'sine:in', link: 'ignore'});
					el.tween('opacity',1);
				});
				preLoadImages(el);
			}
		});
		//
		var currItem = 0;
		var nextItem = 1;
		var timer = setInterval(function(){
			//Swap out current image, preload next.
			var newActive = $('showcaseAlbum').getElement('#image_'+nextItem);
			var altText = '';
			newActive.getElements('span').each(function(tag,index){
				if(index == 3){
					altText = tag.get('html');
				}
			});
			
			var fileTest = newActive.getChildren('a span');
			if(fileTest.length > 0){
				filename = fileTest.get('html');
				var imageHtml = '<img src="'+filename+'" alt="'+altText+'" />';
				var imgHolder = newActive.getElement('a');
				imgHolder.set('html',imageHtml);
				imgHolder.addEvent('preloaderFinish', function(){
					var newHeight = 0;
					var newWidth = 0;
					var newActiveImg = imgHolder.getElements('img');
					newActiveImg.each(function(el,index){
						newHeight = el.getStyle('height');
						newHeight = parseInt(newHeight);
						newWidth = el.getStyle('width');
						newWidth = parseInt(newWidth);
					});
					var deltaHeight = (710-newHeight)/2;
					newActive.setStyles({
						height:newHeight,
						marginTop:deltaHeight	
					});
				});
				preLoadImages(imgHolder);
			}
			var activeShowcase = $('showcaseAlbum').getElement('#image_'+currItem);
			//Fade in and out

			var fx1 = new Fx.Tween(activeShowcase, {
				duration: 1500,
				link: 'ignore',
				transition: 'sine:in',
				property:'opacity',
				onComplete: function(){
					activeShowcase.removeClass('activeShow');
					newActive.addClass('activeShow');
				}
			});
			var fx2 = new Fx.Tween(newActive, {
				duration: 1500,
				link: 'ignore',
				transition: 'sine:in',
				property:'opacity'
			});
			fx1.start(1,0);
			fx2.start(0,1);
			//
			nextItem ++;
			currItem ++;
			if(nextItem > (numImages-1)){
				nextItem = 0;
			}
			if(currItem >= (numImages)){
				currItem = 0;
			}
		}, 6000);
	}
	
	
	
	/*
	* Set new active image and left and right panes
	*/
	function setCurrent(newActive,setMargin){
		newActive.setStyles({
			backgroundColor:'transparent'
		});
		//Set the height of the album to the height of the image
		var newHeight = 0;
		var newWidth = 0;
		var newActiveImg = newActive.getElements('img');
		newActiveImg.each(function(el,index){
			newHeight = el.getStyle('height');
			newHeight = parseInt(newHeight);
			newWidth = el.getStyle('width');
			newWidth = parseInt(newWidth);
		});
		var deltaHeight = (710-newHeight)/2;
		$('leftPane').setStyles({
			height:newHeight,
			top:deltaHeight
		});
		$('rightPane').setStyles({
			height:newHeight,
			top:deltaHeight
		});
		
		if(setMargin){
			newActive.setStyles({
				height:newHeight,
				marginTop:deltaHeight	
			});
		}else{
			newActive.setStyles({
				height:newHeight
			});	
		}
		
		newActive.set('tween', {duration: 1000, transition: 'sine:in', link: 'ignore'});
		newActive.tween('opacity',1);
	}
	
	
	
	/*
	* Preloader
	*/
	function preLoadImages(element){
		
		var options = {
						 delay:200,
						 check_timer:300,
						 //ondone:function(){ },
						 //oneachload:function(image){ },
						 fadein:500
						};
		
		var images = element.getElements("img"), timer, counter = 0, i = 0, checkFlag = new Array(), delaySum = options.delay;
		
		images.each(function(el,index){
			/*
			if(navigator.userAgent.match(/MSIE 7.0/i) || navigator.userAgent.match(/MSIE 8.0/i)){
				el.setStyle("visibility","hidden");
			}else{
				el.setStyles({visibility:"hidden",opacity:0});
			}
			*/
			el.setStyle("visibility","hidden");
			var theWrap = new Element('div.preloader').wraps(el);
			checkFlag[index] = false;	
		});
		

		images = Array.from(images);
		
		init();
		
		function init(){
			
			timer = setInterval(function(){
				
				if(counter>=checkFlag.length){
					clearInterval(timer);
					//options.ondone();
					element.fireEvent('preloaderFinish', '');
					return;
				}
			
				for(i=0;i<images.length;i++){
					if(images[i].complete==true){
						if(checkFlag[i]==false){
							checkFlag[i] = true;
							//options.oneachload(images[i]);
							counter++;
							delaySum = delaySum + options.delay;
						}
						/*
						if(navigator.userAgent.match(/MSIE 7.0/i) || navigator.userAgent.match(/MSIE 8.0/i)){
							$$(images[i]).setStyle("visibility","visible");
						}else{
							$$(images[i]).setStyle("visibility","visible");
							$$(images[i]).set('tween',{duration:800});
							$$(images[i]).tween('opacity',1);
						}
						*/
						$$(images[i]).setStyle("visibility","visible");
						$$(images[i]).getParent().removeClass("preloader");
						$$(images[i]).getParent().addClass("loaded");
					}
				}
			
			},options.check_timer);	 
		};
		
	}
	
	/*
	* Show email form
	*
	var checkExists = document.id('emailSubLink');
	if(checkExists != null){
		$('emailSubLink').addEvent('click',function(event){
			$('subForm').setStyle("opacity",0);
			$('subForm').setStyle("display","block");
			$('subForm').set('tween', {duration: 500, transition: 'sine:in', link: 'ignore'});
			$('subForm').tween('opacity',1);
			return false;
		});	
		//Submit the form
		var emailForm = $('emailSubForm');
		emailForm.addEvent('submit',function(event){
			event.stop();//Stop the form submitting
			
			//Simple validate
			var emailInput = this.getElementById('email');
			var emailVal = emailInput.get('value');
			//console.log(emailVal);
			var regPatt = /^[a-zA-Z0-9\.\-+]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$/;
			if(emailVal.match(regPatt) != null){
				//Close enough
				var safeEmail = encodeURI(emailVal);
				var myRequest = new Request({
					url: '/saveForm/'+safeEmail,
					method: 'get',
					onSuccess: function(responseText){
						$('email').set('value','');
						$('formErrors').set('html', responseText);
						if(responseText.match(/^Thanks/) != null){
							var t = setTimeout(closeTheForm,4000);
						}
					},
					onFailure: function(){
						$('formErrors').set('html', 'Sorry, could not save your email address.');
					}
				});
				myRequest.send();
				
				//console.log('match');
			}else{
				$('formErrors').set('html','Sorry, not entirely convinced by that email address. If it is correct please <a href="/contact">contact me</a>.');
				//console.log('no match');
			}
			
		});
		//Close the form
		$('closeForm').addEvent('click',function(event){
			closeTheForm();
		});
		//Function to close
		function closeTheForm(){
			var theForm = $('subForm');
			var fxClose = new Fx.Tween(theForm, {
				duration: 500,
				link: 'ignore',
				transition: 'sine:in',
				property:'opacity',
				onComplete: function(){
					theForm.setStyle("display","none");
					$('formErrors').set('html', '');
				}
			});
			fxClose.start(1,0);
		}
	}
	*/
	
	
	/*
	* Navigation
	*/
	
	var dropDowns = $(document.body).getElement('nav').getElement('ul').getElements('li.expanded').getElement('a');
	dropDowns.each(function(el,index){
		el.addEvent('click',function(event){
			event.stop();
			var theLi = this.getParent('li');
			var theUl = theLi.getElement('ul.menu');
			theUl.setStyle("opacity",0);
			theUl.setStyle("display","block");
			var fxFadeIn = new Fx.Tween(theUl, {
				duration: 500,
				link: 'ignore',
				transition: 'sine:in',
				property:'opacity',
				onComplete: function(){
					theLi.addEvent('mouseleave',function(){
						theLi.removeEvents('mouseleave');
						var fxFadeOut = new Fx.Tween(theUl, {
							duration: 500,
							link: 'ignore',
							transition: 'sine:in',
							property:'opacity',
							onComplete: function(){
								theUl.setStyle('display','none');	
							}
						});
						fxFadeOut.start(1,0);
					});
				}
			});
			fxFadeIn.start(0,1);
		});
	});
	
	
});