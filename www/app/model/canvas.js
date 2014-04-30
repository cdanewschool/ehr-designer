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
			hash:
			{
				current:null,
				last:null
			},
			currentProject: null,
			currentSection: null,
			currentPage: null,
			
			pendingSection: null,
			pendingPage: null,
			previewing: false,
			
			privacyOptions: 
				[
				 	{value:"private",label:"Private"},
				 	{value:"public",label:"Public"}
				 ],
			selection: null
		};
	}
);