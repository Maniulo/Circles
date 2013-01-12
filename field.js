atom.declare('Circles.Field', App.Element,
{
	buffer: null,
	colour: "#FFFFFF",
	shadowColour: "#DEE5EB",
	
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
		var
			shadow = this.shadow,
			r = c.shape.radius,
			s = Math.ceil(r * 2),
			shape = new Circle(s/2, s/2, r);
		
		
		this.buffer.ctx.fill(c.shape, this.shadowColour);
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