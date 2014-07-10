app.service
(
	'history',
	function()
	{
		return {
			actions: [],
			currentAction: null,
			id:0,
			maxSize: 10
		};
	}
);