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