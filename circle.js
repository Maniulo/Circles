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
	
	get canvasSize ()
	{
		return this.settings.get('fieldSize');
	},

	get fieldShape ()
	{
		return this.controller.field.shape;
	},

	getRandomImpulse: function ()
	{
		var x, y;
		x = Number.randomFloat(-this.speed, this.speed);
		y = Math.sqrt(this.speed * this.speed - x*x) * (Math.random() > 0.5 ? 1 : -1);
		return new Point(x, y);
	},

	move: function (time)
	{
		return new Point(
			this.impulse.x * time,
			this.impulse.y * time
		);
	},
	
	configure: function method ()
	{

		this.controller = this.settings.get('controller');
		this.colour     = this.settings.get('colour') || atom.Color.random().toString();
		this.impulse    = this.getRandomImpulse();

		this.shape = new Circle(
			this.makeCenterPoint(),
			this.radius
		);
		
		this.state = this.settings.get('state');
	},

	makeCenterPoint: function ()
	{
		return this.settings.get('point') || this.fieldShape.getRandomPoint(10);
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
				this.shape.center.move(this.move(t));
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
		this.collideBoundsAxis('x', t);
		this.collideBoundsAxis('y', t);
	},

	collideBoundsAxis: function (axis, t)
	{
		if (this.isOutOfBounds(axis))
		{
			this.impulse[axis] *= -1;
			this.shape.center[axis] += this.move(t)[axis];
		}
	},

	isOutOfBounds: function (axis)
	{
		var s = this.shape;
		return s.center[axis] < s.radius
		    || s.center[axis] + s.radius > this.canvasSize[axis];
	},
		
	renderTo: function (ctx, resources)
	{
        ctx.fill( this.shape, this.colour );
    }
});