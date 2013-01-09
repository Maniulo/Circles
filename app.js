// Globalizing LibCanvas variables
LibCanvas.extract();

// onDomReady - run our app
atom.dom(
	function ()
	{
		new Circles.Controller();
	}
);

function randomf(min, max)
{
	if (max > min)
	{
		return Math.random() * (max - min) + min;
	}
	else
	{
		throw "Maximum value should be less than minimum."
	}
}