sap.ui.define([
	"fs/cb/bankcustomer/displays1/controller/BaseController",
	"fs/cb/bankcustomer/displays1/model/utilities",
	"sap/ui/model/json/JSONModel"
], function(BaseController, utilities, JSONModel) {
	"use strict";

	return BaseController.extend("fs.cb.bankcustomer.displays1.controller.App", {

		onInit: function() {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			// appView - Model to controll busy indactor of the App
			oViewModel = new JSONModel({
				busyOnSearchComponent: true,
				busy: true,
				delay: 0
			});
			this.setModel(oViewModel, "appView");

			var iNumberOfServices = 2;
			var iCount = 0;
			
			fnSetAppNotBusy = function() {
				 iCount++; // increase number of calls
				 if (iCount === iNumberOfServices) {
				    oViewModel.setProperty("/delay", iOriginalBusyDelay);
				 	oViewModel.setProperty("/busy", false); // Busy indicator to be removed first if the smart controls are created 
				 }
			};

			// Remove busy indicator if metadata of the respective OData services are loaded
			this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
			this.getOwnerComponent().getModel("search").metadataLoaded().then(fnSetAppNotBusy);

			// apply content density mode to root view
			this.getView().addStyleClass(utilities.getContentDensityClass());
		}
	});

});