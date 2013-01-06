// Globalizing LibCanvas variables
LibCanvas.extract();

// onDomReady - run our app
atom.dom(function () {
	new Circles.Controller();
});

atom.declare( 'Circles.Controller', {
	player: undefined,
	
	initialize: function () {
		this.size  = new Size(800, 500);
		this.app   = new App({ size: this.size });
		this.layer = this.app.createLayer({ invoke: true });
			
		mouse 	     = new Mouse(this.app.container.bounds);
		mouseHandler = new App.MouseHandler({ app: this.app, mouse: mouse });
		
		this.field = new Circles.Field( this.layer, {
				controller: this,
				size: this.size
		});
		
		mouseHandler.subscribe( this.field );
		
		this.field.events.add( 'click', function(e)
		{
			this.controller.player = new Circles.Player( this.layer, {
				controller: this.controller,
				x: e.x,
				y: e.y
			});
		});
		
		this.circles = new Array();
		for (var i = 0; i < 100; i++)
		{ 
			this.circles[i] = new Circles.Circle( this.layer, {
							controller: this,
							size: this.size 
						});
		}
	},
	
	checkCollision: function(player)
	{
		if (player != undefined)
		{
			for (var i = 0; i < 100; i++)
			{ 
				if (this.circles[i].shape.intersect(this.player.shape))
				{
					this.circles[i].state = "grow";
				}
			}
		}
	}
});

function randomf(min, max)
{
	if (max > min)
	{
		return Math.random() * (max - min) + min;
	}
	else
	{
		throw "Maximum value should be less than minimum."
	}
}

function randomColour()
{
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

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

atom.declare('Circles.Field', App.Element,
{
	configure: function()	{
		this.controller = this.settings.get('controller');
		this.shape = new Rectangle(
			0,
			0,
			this.settings.get('size').x,
			this.settings.get('size').y
		);
	},
	
	renderTo: function (ctx, resources) {
        ctx.fill( this.shape, '#dedede' );
    }
});