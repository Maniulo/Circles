// Globalizing LibCanvas variables
LibCanvas.extract();

// onDomReady - run our app
atom.dom(
	function ()
	{
		new Circles.Controller();
	}
);

function randomColour()
{
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}