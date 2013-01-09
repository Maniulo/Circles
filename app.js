// Globalizing LibCanvas variables
LibCanvas.extract();

// onDomReady - run our app
atom.dom(
	function ()
	{
		new Circles.Controller();
	}
);