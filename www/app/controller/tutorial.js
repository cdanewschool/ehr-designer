app.controller
(
	'TutorialCtrl',
	function($tutorial)
	{
		$tutorial.register
		(
			'createProject',
			{
				highlightOpacity:.25
			},
			[
				{
					type: "showMessage",
					message: {
						content:"<p><strong>Well hello there!</strong></p><p>This tutorial will walk you through the process of creating a new project and saving it.</p><p>Shall we get started?</p>",
						header:"Creating a New Project",
						buttonText: "Let's Go!"
					}
				},
			 	{
			 		type:"waitForClick",
			 		targets: ["a.dropdown-toggle"],
			 		tooltips: 
			 			[
			 			 {selector:"a.dropdown-toggle",text:'First, click the file menu',placement:'right'}
			 			 ]
			 	},
			 	{
			 		type:"waitForClick",
			 		targets: [".dropdown-menu li:nth-child(1) button"],
			 		tooltips: 
			 			[
			 			 {selector:".dropdown-menu li:nth-child(1) button",text:'Then click "New" to create a new project',placement:'right'}
			 			 ]
			 	},
			 	{
			 		type:"delay",
			 		delay: 1000
			 	},
			 	{
			 		type:"waitForClick",
			 		targets: [".modal-dialog .modal-footer button:nth-child(2)"],
			 		highlight: [".modal-dialog form input:nth-child(1)", ".modal-dialog .modal-footer button:nth-child(2)"],
			 		tooltips: 
			 			[
			 			 {selector:".modal-dialog form input:nth-child(1)",text:'Enter a name for your project (or use the default)',placement:'right'},
			 			 {selector:".modal-dialog .modal-footer button:nth-child(2)",text:'Then click OK',placement:'right'}
			 			 ]
			 	},
			 	{
			 		type:"delay",
			 		delay: 1000
			 	},
			 	{
			 		type:"waitForClick",
			 		targets: [".modal-dialog .modal-footer button:nth-child(2)"],
			 		highlight: [".modal-dialog form input:nth-child(1)", ".modal-dialog .modal-footer button:nth-child(2)"],
			 		tooltips: 
			 			[
			 			 {selector:".modal-dialog form input:nth-child(1)",text:'Next, enter a name for your project\'s section (or use the default)',placement:'right'}
			 			 ]
			 	},
			 	{
			 		type:"delay",
			 		delay: 1000
			 	},
			 	{
			 		type:"waitForClick",
			 		targets: [".modal-dialog .modal-footer button:nth-child(2)"],
			 		highlight: [".modal-dialog form input:nth-child(1)", ".modal-dialog .modal-footer button:nth-child(2)"],
			 		tooltips: 
			 			[
			 			 {selector:".modal-dialog form input:nth-child(1)",text:'Finally, enter a name for your section\'s first page (or use the default)',placement:'right'}
			 			 ]
			 	},
			 	{
					type: "showMessage",
					message: {
						content:"<p>That's it! You've successfully created your first project.</p><p>Now, lets Save it.</p>"
					}
				},
			 	{
			 		type:"waitForClick",
			 		targets: ["a.dropdown-toggle"],
			 		tooltips: 
			 			[
			 			 {selector:"a.dropdown-toggle",text:'Click the File menu again ',placement:'right'}
			 			 ]
			 	},
			 	{
			 		type:"waitForClick",
			 		targets: [".dropdown-menu li:nth-child(2) button"],
			 		tooltips: 
			 			[
			 			 {selector:".dropdown-menu li:nth-child(2) button",text:'And finally, click "Save"',placement:'right'}
			 			 ]
			 	},
			 	{
					type: "showMessage",
					message: {
						content:"<p>Nice work! You've created a new project and saved it.</p>",
						header:"Tutorial Complete",
						buttonText: "Close"
					}
				}
			 ]
		);
	}
);