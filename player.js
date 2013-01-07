atom.declare('Circles.Player', App.Element,
{
	speed: 10,
	
	configure: function()
	{
		this.controller = this.settings.get('controller');
		x = this.settings.get('x');
		y = this.settings.get('y');
		
		this.shape = new Circle(
			x,
			y,
			100
		);
	},
	
	onUpdate: function (time)
	{
		this.controller.checkCollision(this);
		
		this.shape.radius -= time / this.speed;
		
		if (this.shape.radius <= 0)
		{
			this.destroy();
		}
		else
		{
			this.redraw();
		}
    },
	
	renderTo: function (ctx, resources) {
        ctx.fill( this.shape, 'red' );
    }
});