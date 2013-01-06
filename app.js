// Globalizing LibCanvas variables
LibCanvas.extract();

// onDomReady - run our app
atom.dom(function () {
	new Circles.Controller();
});


/** @class Pong.Controller */
atom.declare( 'Circles.Controller', {

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
		
		this.field.events.add( 'click', function(e) {
			c = new Circles.Player( this.layer, {
				controller: this,
				x: e.x,
				y: e.y
			});
		});
		
		for (var i = 0; i < 100; i++)
		{ 
			a = new Circles.Circle( this.layer, {
				controller: this,
				size: this.size 
			});
		}
	}
});

atom.declare('Circles.Circle', App.Element, {

	getRandomImpulse: function () {
		x = Number.random(0, 350) * (Math.random() > 0.5 ? 1 : -1);
		y = Math.sqrt(350*350 - x*x) * (Math.random() > 0.5 ? 1 : -1);
		return new Point ( x, y );
	},
	
	configure: function()	{
		this.impulse = this.getRandomImpulse();
		
		this.shape = new Circle(
			Number.random(10, this.settings.get('size').x - 10),
			Number.random(10, this.settings.get('size').y - 10),
			10
		);
	},
	
	get canvasSize () { return this.settings.get('size'); },
	
	moveSpeed: 10000,
	speed: 10,
	
	onUpdate: function (time) {
		s = this.shape;
		
		s.center.move(
			[this.impulse.x * time / this.moveSpeed,
			 this.impulse.y * time / this.moveSpeed]
		);
		
		if (s.center.x < s.radius || s.center.x + s.radius > this.canvasSize.x)
		{
			this.impulse.x *= -1;
		}
		
		if (s.center.y < s.radius || s.center.y + s.radius > this.canvasSize.y)
		{
			this.impulse.y *= -1;
		}
		
		this.redraw();
    },
	
	renderTo: function (ctx, resources) {
        ctx.fill( this.shape, 'blue' );
    }
});

atom.declare('Circles.Player', App.Element, {

	configure: function()	{
		x = this.settings.get('x');
		y = this.settings.get('y');
		
		this.shape = new Circle(
			x,
			y,
			100
		);
	},
	
	speed: 10,
	
	onUpdate: function (time) {
		// вращаемся со скоростью 90 градусов в секунду
		this.shape.radius -= time / this.speed; //( (90).degree() * time / 1000 );
		
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

atom.declare('Circles.Field', App.Element, {

	configure: function()	{
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