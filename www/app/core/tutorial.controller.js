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
			 		targets: [".navbar-nav li:nth-child(2) > a"],
			 		tooltips: 
			 			[
			 			 {selector:".navbar-nav li:nth-child(2) > a",text:'First, click My Projects',placement:'right'}
			 			 ]
			 	},
			 	{
			 		type:"delay",
			 		delay: 500
			 	},
			 	{
			 		type:"waitForClick",
			 		targets: [".tile.new > .thumbnail > img"],
			 		highlight: [".tile.new > .thumbnail"],
			 		tooltips: 
			 			[
			 			 {selector:".tile.new > .thumbnail",text:'Then click "New Project" to create a new project',placement:'right'}
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
			 			 {selector:".modal-dialog form input:nth-child(1)",text:'Enter a name for your project (or stick with the default)',placement:'right'}
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
			 			 {selector:".modal-dialog form input:nth-child(1)",text:'Finally, enter a name for your project\'s first page',placement:'right'}
			 			 ]
			 	},
			 	{
					type: "showMessage",
					message: {
						content:"<p>That's it! You've successfully created your first project.</p><p>Now, lets work on it.</p>"
					}
				},
				{
			 		type:"waitForClick",
			 		targets: [".tile:nth-child(2) > .thumbnail > a"],
			 		highlight: [".tile:nth-child(2) > .thumbnail"],
			 		tooltips: 
			 			[
			 			 {selector:".tile:nth-child(2) > .thumbnail",text:'Click a page to edit it',placement:'right'}
			 			 ]
			 	},
			 	{
			 		type:"delay",
			 		delay: 1000
			 	},
			 	{
					type: "showMessage",
					message: {
						content:"<p>Now, start dragging some components from the Library to the stage. Selecting a component will bring up the Property Inspector, which will allow you to edit the selected component.</p>"
					}
				},
			 	{
					type: "showMessage",
					message: {
						content:"<p>That's all there is to it. Now start building!</p>",
						header:"Tutorial Complete",
						buttonText: "Close"
					}
				}
			 ]
		);
	}
);