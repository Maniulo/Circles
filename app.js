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

function randomColour()
{
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}