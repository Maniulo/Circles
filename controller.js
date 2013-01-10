atom.declare( 'Circles.Controller', {
	maxCircles: 100,
	appWidth:   607,
	appHeight:  500,
	
	initialize: function () {
		this.circles = [];
		this.size    = new Size(this.appWidth, this.appHeight);
		this.app     = new App({ size: this.size });
		this.layer   = this.app.createLayer({ invoke: true, intersection: 'full' });
		this.shape   = this.layer.ctx.rectangle;
			
		this.addMouseEvents();
		this.addCircles(this.maxCircles);
		
		this.fpsMeter();
		//vk();
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

		mouse.events.add( 'click', function() {
			new Circles.Circle( this.layer, {
				controller: this,
				fieldSize: this.size,
				colour: "#FF7100",
				point: mouse.point.clone(),
				state: "grow"
			});
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
		c.destroy();
	},
	
	checkCollision: function(expanded)
	{
		for (var i = this.circles.length - 1; i >= 0; --i)
		{
			var c = this.circles[i];
			if (c != expanded && c.shape.intersect(expanded.shape))
			{
				c.state = "grow";
				this.circles.splice(i,1);
			}
		}
	}
});