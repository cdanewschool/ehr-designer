app.service
(
	'library',
	function()
	{
		return {
			getDefinition:function(element)
			{
				if( element.attr("data-component-type") == "template" )
					return this.templatesIndex(element.attr("data-id"));
				else if( element.attr("data-component-type") == "component" )
					return this.componentsIndexed[element.attr("data-id")];
				
				return this.elementsIndexed[element.attr("data-component-id")];
			},
			
			components:null,
			componentsByCategory:null,
			componentsIndexed:null,
			
			elements:null,
			elementsByCategory:null,
			elementsIndexed:null,
			
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
			],
			
			templates:null,
			templatesIndexed:null
		};
	}
);