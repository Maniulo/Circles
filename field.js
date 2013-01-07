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
	}
});