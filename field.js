atom.declare('Circles.Field', App.Element,
{
	configure: function()	{
		this.controller = this.settings.get('controller');
		this.shape = new Rectangle(
			new Point(0,0),
			this.settings.get('size')
		);
	}
});