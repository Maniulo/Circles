atom.declare( 'Circles.Controller', {
	density:    2000,
	appWidth:   607,
	appHeight:  500,
	
	currentLevel: 10,
	playerClicked: 0,
	expanded: 0,
	
	initialize: function ()
	{
		this.circles = [];
		this.size    = new Size(this.appWidth, this.appHeight);
		this.app     = new App({ size: this.size });
		this.layer   = this.app.createLayer({ invoke: true, intersection: 'full' });
		this.shape   = this.layer.ctx.rectangle;
			
		this.addMouseEvents();
		this.playLevel(this.currentLevel);
		
		this.fpsMeter();
		//vk();
	},
	
	playLevel: function(level)
	{
		for (var i = this.circles.length - 1; i >= 0; --i)
		{
			this.circles[i].destroy();
		}
		
		this.circles = [];
		this.addCircles(this.getCirclesForLevel(level), this.getCircleRadius(level));
		console.log(level + ": " + this.getCirclesForLevel(level) + " / " + this.getExpandedForLevel(level));
	},
	
	getCirclesForLevel: function(level)
	{
		return 5 + level * 5;
		if (level == 0)
		{
			return 5;
		}
		else if (level < 5)
		{
			return 5 + 3 * level;
		}
		else if (level < 15)
		{
			return 13 + 2 * level;
		}
		else
		{
			return 41 + level;
		}
	},
	
	getExpandedForLevel: function(level)
	{
		return Math.floor(this.getCirclesForLevel(level) * 0.3);
	},
	
	addCircles: function(amount, r)
	{
		for (var i = 0; i < amount; i++)
		{ 
			this.circles[i] = new Circles.Circle( this.layer, {
				controller: this,
				fieldSize: this.size,
				state: "move",
				radius: r,
				zIndex: i
			});
		}
	},
	
	getCircleRadius: function(level)
	{
		return this.appWidth * this.appHeight / this.getCirclesForLevel(level) / this.density;
	},
	
	addMouseEvents: function()
	{
		var mouse = new Mouse(this.app.container.bounds);

		mouse.events.add( 'click', function()
		{
			if (this.playerClicked < 1)
			{
				++this.playerClicked;
				++this.expanded;
				new Circles.Circle( this.layer, {
					controller: this,
					fieldSize: this.size,
					colour: "#FF7100",
					point: mouse.point.clone(),
					radius: this.getCircleRadius(this.currentLevel),
					state: "grow"
				});
			}
		}.bind(this));
	},
	
	fpsMeter: function ()
	{
		var fps = atom.trace(), time = [], last = Date.now();

		atom.frame.add(function () {
			if (time.length > 5) time.shift();

			time.push( Date.now() - last );
			last = Date.now();

			fps.value = Math.ceil(1000 / time.average()) + " FPS";
		});
	},
	
	vk: function()
	{
		VK.init(function() {
			var parts=document.location.search.substr(1).split("&");
			
			var flashVars = {}, curr;
			for (var i = 0; i < parts.length; i++) {
				curr = parts[i].split('=');
				flashVars[curr[0]] = curr[1];
			}

			// try to use this here:
			// var viewer_id = atom.uri().queryKey.viewer_id;
		   
			var viewer_id = flashVars['viewer_id'];
			console.log(viewer_id);
			
			VK.api(
				"users.get",
				{
					uids: viewer_id, fields: "first_name, last_name"
				},
				function(data)
				{
					console.log(data);
					console.log( data.response[0].first_name + ' ' + data.response[0].last_name);
				}
			)
		});
	},
	
	removeCircle: function(c)
	{
		--this.expanded;
		c.destroy();
		
		if (this.expanded == 0)
		{
			if (this.circles.length <= this.getCirclesForLevel(this.currentLevel) - this.getExpandedForLevel(this.currentLevel))
			{
				// new level (else replay)
				++this.currentLevel;
			}
			
			this.playerClicked = 0;
			this.playLevel(this.currentLevel);
		}
	},
	
	checkCollision: function(expandedCircle)
	{
		for (var i = this.circles.length - 1; i >= 0; --i)
		{
			var c = this.circles[i];
			if (c != expandedCircle && c.shape.intersect(expandedCircle.shape))
			{
				c.state = "grow";
				this.circles.splice(i,1);
				++this.expanded;
			}
		}
	}
});