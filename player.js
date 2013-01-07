atom.declare('Circles.Player', App.Element,
{
	growSpeed:    45,
	grownTime:    0,
	grownTimeMax: 5000,
	dwindleSpeed: 20,
	growMax:      60,
	radius:       10,
	colour:       "green",
	state:        "grow",
	
	configure: function()
	{
		this.controller = this.settings.get('controller');
		
		this.shape = new Circle(
			this.settings.get('x'),
			this.settings.get('y'),
			this.radius
		);
	},
	
	grow: function(t)
	{
		if (this.shape.radius >= this.growMax)
		{
			this.shape.radius = this.growMax;
			this.grownTime += t;
			
			if (this.grownTime > this.grownTimeMax)
			{
				this.state = "dwindle";
			}
		}
		else
		{
			this.shape.radius += this.growSpeed / t;
		}
		this.redraw();
	},
	
	dwindle: function(t)
	{
		this.shape.radius -= this.dwindleSpeed / t;
		if (this.shape.radius > 0)
		{
			this.redraw();
		}
		else
		{
			this.shape.radius = 0;
			this.state = "destroy";
		}
	},
	
	onUpdate: function (t)
	{
		switch (this.state)
		{
			case "grow":
				this.grow(t);
				this.controller.checkCollision(this);
				break;
			case "dwindle":
				this.dwindle(t);
				this.controller.checkCollision(this);
				break;
			case "destroy":
				this.controller.removePlayer(this);
				break;
		}
    },
	
	renderTo: function (ctx, resources) {
        ctx.fill( this.shape, this.colour );
    }
});