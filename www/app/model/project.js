app.service
(
	'project',
	function()
	{
		return {
			document:null,	//	current document object
	 		section: null,	//	current section object (one of document.children)
	 		page: null,		//	current page object (one of section.children)
	 		
	 		templates:
			{
				document:
				{
					name:"My Document",
					children:[]
				},
				section:
				{
					name:"My Section",
					children:[]
				}
			} 		
		};
	}
);