function browserHandler(){
	//Private
	var _browserWidth = 0;
	var _browserHeight = 0;

	//Width
	this.findBrowserWidth = function(){
		_browserWidth = window.innerWidth;
		if(typeof(_browserWidth) != 'number'){
			_browserWidth = $(window).width();
		}
	};
	this.getBrowserWidth = function(){
		return _browserWidth;
	};

	//Height
	this.findBrowserHeight = function(){
		_browserHeight = window.innerHeight;
		if(typeof(_browserHeight) != 'number'){
			_browserHeight = $(window).height();
		}
	};
	this.getBrowserHeight = function(){
		return _browserHeight;
	};
}