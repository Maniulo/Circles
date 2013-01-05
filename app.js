// Globalizing LibCanvas variables
LibCanvas.extract();

// onDomReady - run our app
atom.dom(function () {
	new Circles.Controller();
});


/** @class Pong.Controller */
atom.declare( 'Circles.Controller', {

	initialize: function () {
		this.size  = new Size(500, 500);
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
			console.log( 'element поймал клик мыши', e );
			c = new Circles.Circle( this.layer, {
				controller: this,
				size: this.size,
				x: e.x,
				y: e.y
			});
		})
	}
});

atom.declare('Circles.Circle', App.Element, {

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
			500,
			500
		);
	},
	
	renderTo: function (ctx, resources) {
        ctx.fill( this.shape, '#dedede' );
    }
});