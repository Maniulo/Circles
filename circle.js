atom.declare('Circles.Circle', App.Element,
{
	radius:       5,
	speed:        0.1,
	growSpeed:    30,
	growMax:      50,
	grownTime:    0,
	grownTimeMax: 5000,
	dwindleSpeed: 20,
	colour:       "#000000",
	state:        "move",
	
	get canvasSize () { return this.settings.get('fieldSize'); },
	
	getRandomImpulse: function ()
	{
		x = atom.number.random(-this.speed, this.speed);
		y = Math.sqrt(this.speed * this.speed - x*x) * (Math.random() > 0.5 ? 1 : -1);
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
	
	configure: function method ()
	{
		X = this.settings.get('x');
		if (typeof X == "undefined")
		{
			X = Number.random(10, this.settings.get('fieldSize').x - 10);
		}
		
		Y = this.settings.get('y');
		if (typeof Y == "undefined")
		{
			Y = Number.random(10, this.settings.get('fieldSize').y - 10);
		}
		
		
		this.colour = this.settings.get('colour');
		if (typeof this.colour == "undefined")
		{
			this.colour = randomColour();
		}	
		
		this.impulse = this.getRandomImpulse();
		this.controller = this.settings.get('controller');
			
		this.shape = new Circle(
			X,
			Y,
			this.radius
		);
		
		this.state = this.settings.get('state');
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
			case "move":
				this.shape.center.move([this.moveX(t), this.moveY(t)]);
				this.collideBounds(t);
				this.redraw();
				break;
			case "grow":
				this.grow(t);
				this.controller.checkCollision(this);
				break;
			case "dwindle":
				this.dwindle(t);
				this.controller.checkCollision(this);
				break;
			case "destroy":
				this.controller.removeCircle(this);
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