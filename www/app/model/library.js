app.service
(
	'library',
	function()
	{
		return {
			getDefinition:function(element,id)
			{
				var id = id || element.attr("data-id");
				
				if( element.attr("data-component-type") == "template" )
					return this.templatesIndexed(id);
				else if( element.attr("data-component-type") == "component" )
					return this.componentsIndexed[id];
				
				return this.elementsIndexed[id];
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