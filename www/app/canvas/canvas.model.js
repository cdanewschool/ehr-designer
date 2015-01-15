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
			currentPage: null,
			dirty: false,
			pendingPage: null,
			previewing: false,
			privacyOptions: 
				[
				 	{value:"private",label:"Private"},
				 	{value:"public",label:"Public"}
				 ],
			styleThemes: 
				[
				 	{value:"none1",label:"None"},
				 	{value:"light",label:"Light"},
				 	{value:"modern",label:"Modern"},
				 	{value:"classic",label:"Classic"}
				 ],
			selection: null
		};
	}
);