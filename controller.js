atom.declare( 'Circles.Controller', {
	density:    2000,
	appWidth:   607,
	appHeight:  500,
	
	currentLevel: 11,
	playerClicked: 0,
	expanded: 0,
	expandedNow: 0,
	
	initialize: function ()
	{
		this.circles = [];
		this.size    = new Size(this.appWidth, this.appHeight);
		this.app     = new App({ size: this.size });
		this.fieldLayer = this.app.createLayer({ invoke: true, intersection: 'manual', zIndex: 0 });
		this.scoreLayer = this.app.createLayer({ invoke: true, intersection: 'manual', zIndex: 2 });
		this.layer      = this.app.createLayer({ invoke: true, intersection: 'full', zIndex: 1 });
		this.shape   = this.layer.ctx.rectangle;
			
		this.resetField();
		this.interface = new Circles.Interface(this.scoreLayer, {
			controller: this,
			size: this.size,
			zIndex: 1
		});
		
		this.addMouseEvents(this.field);
		this.playLevel(this.currentLevel);
		
		this.fpsMeter();
		
		this.bindMethods('control');
		this.q = "!";
		atom.frame.add( this.control );
		//vk();
	},
	
	control: function()
	{
		if (this.expandedNow == 0 && this.playerClicked != 0)
		{
			if (this.hasWon())	// new level (else replay)
				++this.currentLevel;
			
			this.endLevel();
		}
		
		if (this.circles.length == 0)
		{
			this.playLevel(this.currentLevel);
		}
	},
	
	playerColour: function()
	{
		// "#FF7100"
		return atom.Color.random().toString();
	},
	
	resetField: function()
	{
		if (this.field)
			this.field.destroy();
		
		this.field = new Circles.Field( this.fieldLayer, {
			controller: this,
			size: this.size,
			zIndex: 0
		});
	},
	
	endLevel: function()
	{
		for (var i = this.circles.length - 1; i >= 0; --i)
		{
			this.circles[i].state = "disappear";
		}
	},
	
	playLevel: function(level)
	{
		this.resetField();
		
		this.playerClicked = 0;
		this.expanded = 0;
		this.circles = [];
		this.addCircles(this.getCirclesForLevel(level), this.getCircleRadius(level));
		
		this.interface.updateScore(0, this.getCirclesForLevel(level), false);
	},
	
	getCirclesForLevel: function(level)
	{
		//return 5 + level * 5;
		if (level == 1)
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
		if (level == 1)
		{
			return 1;
		}
		else if (level < 5)
		{
			return Math.floor(this.getCirclesForLevel(level) * 0.3);
		}
		else if (level < 15)
		{
			return Math.floor(this.getCirclesForLevel(level) * 0.6);
		}
		else
		{
			return Math.floor(this.getCirclesForLevel(level) * 0.8);
		}
		
	},
	
	addCircles: function(amount, r)
	{
		for (var i = 0; i < amount; i++)
		{ 
			this.circles[i] = new Circles.Circle( this.layer, {
				controller: this,
				fieldSize: this.size,
				state: "appear",
				radius: r,
				zIndex: i
			});
		}
	},
	
	getCircleRadius: function(level)
	{
		return this.appWidth * this.appHeight / this.getCirclesForLevel(level) / this.density;
	},
	
	addMouseEvents: function(field)
	{
		var mouse = new Mouse(this.app.container.bounds);

		mouse.events.add( 'click', function()
		{
			this.controller.playerClick(mouse.point.clone());			
		}.bind(field));
	},
	
	playerClick: function(mousePoint)
	{
		if (this.playerClicked < 1)
		{
			++this.playerClicked;
			++this.expandedNow;
			
			new Circles.Circle( this.layer, {
				controller: this,
				fieldSize: this.size,
				colour: this.playerColour(),
				point: mousePoint,
				radius: this.getCircleRadius(this.currentLevel),
				state: "grow",
				zIndex: this.getCirclesForLevel(this.currentLevel) + 1
			});
		}
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
	
	hasWon: function()
	{
		return this.expanded >= this.getExpandedForLevel(this.currentLevel);
	},
	
	removeCircle: function(c)
	{
		for (var i = this.circles.length - 1; i >= 0; --i)
			if (c == this.circles[i])
			{
				c.destroy();
				this.circles.splice(i,1);
				break;
			}
	},
	
	removeExpandedCircle: function(c)
	{
		--this.expandedNow;
		c.destroy();
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
				++this.expandedNow;
				++this.expanded;
				this.interface.updateScore(this.expanded, this.getCirclesForLevel(this.currentLevel), this.hasWon());
			}
		}
	}
});