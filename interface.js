atom.declare('Circles.Interface', App.Element,
{
	text: "Click anywhere to cause",
	success: false,
	
	configure: function()
	{
		this.controller = this.settings.get('controller');
		this.shape = new Rectangle(
			new Point(0,0),
			this.settings.get('size')
		);
	},
	
	updateScore: function(expanded, total, success)
	{
		this.text = expanded + " / " + total;
		this.success = success;
		this.redraw();
	},
	
	addHint: function()
	{
	},
	
	renderTo: function (ctx, resources)
	{
		ctx.font = "130px Century Gothic";
		var metrics = ctx.measureText(this.text);
		
		ctx.fillStyle = "rgba(255,255,255,0.35)";
		ctx.fillText(this.text, this.shape.width/2 - metrics.width/8 - 2, this.shape.height / 2 + 60 - 2);
		
		if (!this.success)
			ctx.fillStyle = "rgba(0,0,0,0.1)";
		else
			ctx.fillStyle = "rgba(110,180,50,0.5)";
		ctx.fillText(this.text, this.shape.width/2 - metrics.width/8, this.shape.height / 2 + 60);
		//console.log(metrics);
		
		
    }
});