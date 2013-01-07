atom.declare( 'Circles.Controller', {
	player: undefined,
	maxCircles: 10,
	
	initialize: function () {
		this.size  = new Size(800, 500);
		this.app   = new App({ size: this.size });
		this.layer = this.app.createLayer({ invoke: true, intersection: 'all', zIndex: 5 });
		this.circlesLayer = this.app.createLayer({ invoke: true, intersection: 'auto', zIndex: 2});
			
		mouse 	     = new Mouse(this.app.container.bounds);
		mouseHandler = new App.MouseHandler({ app: this.app, mouse: mouse });
		
		this.field = new Circles.Field( this.circlesLayer, {
				controller: this,
				size: this.size
		});
		
		mouseHandler.subscribe( this.field );
		
		this.field.events.add( 'click', function(e)
		{
			this.controller.player.push(new Circles.Player( this.layer, {
				controller: this.controller,
				x: e.x,
				y: e.y
			}));
		});
		
		this.player = new Array();
		this.circles = new Array();
		for (var i = 0; i < this.maxCircles; i++)
		{ 
			this.circles[i] = new Circles.Circle( this.layer, {
							controller: this,
							fieldSize: this.size 
						});
		}
	},
	
	removePlayer: function(player)
	{
		for (var j = 0; j < this.player.length; j++)
		{
			if (this.player[j] == player)
			{
				this.player.splice(j,1);
				player.destroy();
				break;
			}
		}
	},
	
	checkCollision: function(player)
	{
		//for (var j = 0; j < this.player.length; j++)
		{
			for (var i = 0; i < this.circles.length; i++)
			{
				c = this.circles[i];
				if (c.shape.intersect(player.shape))
				{
					c.state = "grow";
					this.player.push(c);
					this.circles.splice(i,1);
				}
			}
		}
	}
});