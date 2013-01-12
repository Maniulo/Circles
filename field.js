atom.declare('Circles.Field', App.Element,
{
	buffer: null,
	colour: "#FFFFFF",
	
	configure: function()
	{
		this.controller = this.settings.get('controller');
		this.shape = new Rectangle(
			new Point(0,0),
			this.settings.get('size')
		);
		
		this.buffer = LibCanvas.buffer(this.shape.width, this.shape.height, true);
		this.buffer.ctx.fill(this.shape, this.colour);
	},
	
	addShadow: function (c)
	{
		this.buffer.ctx.fill(c.shape, c.shadowColour);
		this.redraw();
	},
	
	renderTo: function (ctx, resources)
	{
		ctx.drawImage({
			image:    this.buffer,
			from:     new Point(0,0),
			optimize: true
		});
    }
});