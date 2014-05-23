app.service
(
	'library',
	function()
	{
		return {
			components:null,
			componentsByCategory:null,
			componentsIndexed:null,
			
			sampleData:null,
			sampleDataTypes: 
			[
			 	{
			 		id: "patient",
			 		label: "Patient",
			 		fields:
			 		[
			 		 	{ label: ".name",id: "name.text" },
			 		 	{ label: ".name (first)",id: "name.given" },
			 		 	{ label: ".name (last)",id: "name.family" },
			 		 	{ label: ".gender",id: "gender.coding[0].display" },
			 		 	{ label: ".birthdate",id: "birthDate" },
			 		 	{ label: ".email",id: "telecom.system[1].value" },
			 		 	{ label: ".phone",id: "telecom.system[0].value" },
			 		 	{ label: ".picture",id: "photo.url" }
			 		 ]
			 	}
			]
		};
	}
);