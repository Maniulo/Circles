atom.declare('Circles.Interface', App.Element,
{
	text: "Click anywhere to cause",
	
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
	
	addHint: function()
	{
	},
	
	renderTo: function (ctx, resources)
	{
		
		ctx.font = "130px Century Gothic";
		var metrics = ctx.measureText(this.text);
		
		ctx.fillStyle = "rgba(255,255,255,0.35)";
		ctx.fillText(this.text, this.shape.width/2 - metrics.width/8 - 2, this.shape.height / 2 + 60 - 2);
		
		ctx.fillStyle = "rgba(65,120,175,0.35)";
		ctx.fillText(this.text, this.shape.width/2 - metrics.width/8, this.shape.height / 2 + 60);
		//console.log(metrics);
		
		
    }
});