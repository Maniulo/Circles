atom.declare( 'Circles.Controller', {
	maxCircles: 100,
	appWidth:   607,
	appHeight:  500,
	
	initialize: function () {
		var mouse, mouseHandler;

		this.size  = new Size(this.appWidth, this.appHeight);
		this.app   = new App({ size: this.size });
		
		this.bgLayer = this.app.createLayer({ invoke: true, intersection: 'auto', zIndex: 0 });
		this.circlesLayer = this.app.createLayer({ invoke: true, intersection: 'full', zIndex: 1});
			
		mouse 	     = new Mouse(this.app.container.bounds);
		mouseHandler = new App.MouseHandler({ app: this.app, mouse: mouse });
		
		this.field = new Circles.Field( this.bgLayer, {
			controller: this,
			size: this.size,
			hidden: true
		});
		
		mouseHandler.subscribe( this.field );
		
		mouse.events.add( 'click', function() {
			new Circles.Circle( this.circlesLayer, {
				controller: this,
				fieldSize: this.size,
				colour: "#FF7100",
				point: mouse.point.clone(),
				state: "grow"
			});
		}.bind(this));
		
		this.circles = new Array();
		for (var i = 0; i < this.maxCircles; i++)
		{ 
			this.circles[i] = new Circles.Circle( this.circlesLayer, {
				controller: this,
				fieldSize: this.size,
				state: "move",
				zIndex: i
			});
		}
		
		this.fpsMeter();
		//vk();
	},
	
	fpsMeter: function () {
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
		for (var i = 0; i < this.circles.length; i++)
		{
			var c = this.circles[i];
			if (c.shape.intersect(expanded.shape))
			{
				c.state = "grow";
				this.circles.splice(i,1);
			}
		}
	}
});