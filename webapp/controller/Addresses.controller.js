sap.ui.define([
	"fs/cb/bankcustomer/displays1/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("fs.cb.bankcustomer.displays1.controller.Addresses", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			
			var oViewModel = new JSONModel({
				tableTitle: this.getResourceBundle().getText("xtit.addressTableTitle"),
				tableNoDataText: this.getResourceBundle().getText("ymsg.addressTableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "addressTableView");
		},

		onUpdateFinished: function(o) {
			var oTable = this.byId("addressTable");
			var oBinding = 	oTable.getBinding("items");
//			var aggr = oTable.getAggregation("items");
			var visible = true;
			if (oBinding && oBinding.getLength() <= 0) {
				visible = false;
			}
			var oMainViewModel = this.getModel("mainview");
			oMainViewModel.setProperty("/addressTableVisible", visible);
		}
		
	});

});