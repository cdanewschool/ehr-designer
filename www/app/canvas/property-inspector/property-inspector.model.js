app.service
(
	'propertyInspector',
	function()
	{
		return {
			fieldWithFocus:null,
			
			itemLabels:{},
			
			selectedDataType: undefined,
			selectedDataTypeField: undefined,
			selectedDataTypeData: undefined
		};
	}
);