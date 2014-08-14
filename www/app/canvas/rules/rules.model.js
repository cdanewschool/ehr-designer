app.service
(
	'rules',
	[
		function()
		{
			return {
				rules: null,
				warnings: null,
				warningsDismissed:null,
				warningsPending:null,
				
				violationCache:null
			};
		}
	 ]
);