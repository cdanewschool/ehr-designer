app.service
(
	'canvas',
	function()
	{
		return {
			grid:
			{
				color: '#d4eaff',
				size: 40,
				subdivisions: 2,
				visible: true,
				snapTo:true
			},
			
			currentProject: null,
			currentSection: null,
			currentPage: null,
			
			pendingSection: null,
			pendingPage: null,
			
			selection: null
		};
	}
);