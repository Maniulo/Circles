atom.declare( 'Circles.Controller', {
	maxCircles: 120,
	appWidth:   607,
	appHeight:  500,
	
	levels: [[1, 5], [2, 10], [4, 15], [6, 20], [10, 25], [15, 30], [18, 35], [22, 40], [30, 45], [37, 50], [48, 55], [55, 60]],
	currentLevel: 0,
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
		this.addCircles(this.levels[level][1]);
	},
	
	addCircles: function(amount)
	{
		for (var i = 0; i < amount; i++)
		{ 
			this.circles[i] = new Circles.Circle( this.layer, {
				controller: this,
				fieldSize: this.size,
				state: "move",
				zIndex: i
			});
		}
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
		console.log(this.expanded);
		
		if (this.expanded == 0)
		{
			if (this.circles.length <= this.levels[this.currentLevel][1] - this.levels[this.currentLevel][0])
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