atom.declare('Circles.Circle', App.Element,
{
	maxSpeed:     0.2,
	growSpeed:    5,
	grownTime:    0,
	grownTimeMax: 5000,
	dwindleSpeed: 20,
	growMax:      50,
	radius:       10,
	colour:       "#000000",
	state:        "move",
	
	get canvasSize () { return this.settings.get('size'); },
	
	getRandomImpulse: function ()
	{
		x = randomf(-this.maxSpeed, this.maxSpeed);
		y = Math.sqrt(this.maxSpeed * this.maxSpeed - x*x) * (Math.random() > 0.5 ? 1 : -1);
		return new Point(x, y);
	},
	
	moveX: function(time)
	{
		return this.impulse.x * time;
	},
	
	moveY: function(time)
	{
		return this.impulse.y * time;
	},
	
	configure: function()
	{
		this.impulse = this.getRandomImpulse();
		
		this.colour = randomColour();
		
		this.shape = new Circle(
			Number.random(10, this.settings.get('size').x - 10),
			Number.random(10, this.settings.get('size').y - 10),
			10
		);
		
		this.state = "move";
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
		if (this.shape.radius > 0)
		{
			this.shape.radius -= this.dwindleSpeed / t;
			this.redraw();
		}
		else
		{
			this.destroy();
		}
	},
	
	onUpdate: function (t)
	{
		switch (this.state)
		{
			case "move":
				this.shape.center.move([this.moveX(t), this.moveY(t)]);
				this.collideBounds(t);
				this.redraw();
				break;
			case "grow":
				this.grow(t);
				break;
			case "dwindle":
				this.dwindle(t);
				break;
		}
    },
	
	collideBounds: function(t)
	{
		s = this.shape;
		
		if (s.center.x < s.radius || s.center.x + s.radius > this.canvasSize.x)
		{
			this.impulse.x *= -1;
			s.center.x += this.moveX(t);
		}
		
		if (s.center.y < s.radius || s.center.y + s.radius > this.canvasSize.y)
		{
			this.impulse.y *= -1;
			s.center.y += this.moveY(t);
		}
	},
	
	renderTo: function (ctx, resources)
	{
        ctx.fill( this.shape, this.colour );
    }
});