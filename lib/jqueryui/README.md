NOTE that the *emphasized* line has been added to the `stop` method of jquery-ui's `$.ui.plugin.add("draggable", "cursor")` definition:

$.ui.plugin.add("draggable", "cursor", {
	start: function() {
		var t = $("body"), o = $(this).data("ui-draggable").options;
		if (t.css("cursor")) {
			o._cursor = t.css("cursor");
		}
		t.css("cursor", o.cursor);
	},
	stop: function() {
	
		*if( !$(this).data("ui-draggable") ) return;*
		
		var o = $(this).data("ui-draggable").options;
		if (o._cursor) {
			$("body").css("cursor", o._cursor);
		}
	}
});