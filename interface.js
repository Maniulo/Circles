atom.declare('Circles.Interface', App.Element,
{
	text: "",
	
	configure: function()
	{
		this.controller = this.settings.get('controller');
		this.shape = new Rectangle(
			new Point(0,0),
			this.settings.get('size')
		);
	},
	
	updateScore: function(expanded, total)
	{
		this.text = expanded + " / " + total;
		this.redraw();
	},
	
	renderTo: function (ctx, resources)
	{
		ctx.font = "40px Verdana";
		var metrics = ctx.measureText(this.text);
		
		ctx.fillText(this.text, (this.shape.width ) / 2, this.shape.height / 2 + 20);
    }
});