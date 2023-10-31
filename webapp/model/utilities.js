sap.ui.define([
	"sap/ui/Device"
], function(Device) {
	"use strict";

	// Resolve content density class
	var sContentDensityClass = (function() {

		var sCozyClass = "sapUiSizeCozy",
			sCompactClass = "sapUiSizeCompact";

		var oBody = jQuery(document.body);

		if (oBody.hasClass(sCozyClass) || oBody.hasClass(sCompactClass)) { // density class is already set by the FLP
			return "";
		} else {
			return Device.support.touch ? sCozyClass : sCompactClass;
		}
	}());

	return {
		
		/**
		 * Get resolved content density class
		 * Could be used for (root) views 
		 * 
		 * this.getView().addStyleClass(utilities.getContentDensityClass());
		 */

		getContentDensityClass: function() {
			return sContentDensityClass;
		}

	};
});