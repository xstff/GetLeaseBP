sap.ui.define([
	"fs/cb/bankcustomer/displays1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/ListType"
], function(BaseController, JSONModel, ListType) {
	"use strict";

	return BaseController.extend("fs.cb.bankcustomer.displays1.controller.Accounts", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("accountTable");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			this._oTable = oTable;

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				tableTitle: this.getResourceBundle().getText("xtit.accountTableTitle"),
				tableNoDataText: this.getResourceBundle().getText("ymsg.accountTableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "accountTableView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)

			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		onExit: function() {
			var oTable = this.byId("accountTable");
			var oBinding = oTable.getBinding("items");
			if (oBinding) {
				oBinding.detachDataReceived(this._onDataReceived, this);
			}
		},

		onBeforeRendering: function(o) {
			var oTable = this.byId("accountTable");
			// If listener was set then remove it.
			oTable.getBinding("items").detachDataReceived(this._onDataReceived, this);
			// Now register our function
			oTable.getBinding("items").attachDataReceived(this._onDataReceived, this);
		},

		_onDataReceived: function(oEvent, oData) {
			var data = oEvent.getParameter("data");
			var cnt = 0;
			if (data && data.results) {
				cnt = data.results.length;
			}
			var visible = false;
			if (cnt > 0) {
				visible = true;
			}

			var oMainViewModel = this.getModel("mainview");
			oMainViewModel.setProperty("/accountTableVisible", visible);

			if (data && data.results) {

				var oTable = this.byId("accountTable");
				var oTblItems = oTable.getItems();
				var fnCallback = function(enable, sSemanticObject, sAction, oParams) {
					var type = ListType.Inactive;
					if (enable && this.getBindingContext().getObject().StatusCode !== "3") {
						type = ListType.Navigation;
					}
					this.setType(type);
				};

				var i;
				for (i = 0; i < data.results.length; i++) {
					var acct = data.results[i];
					var sSemanticObject = acct.NavSemanticObj;
					var sAction = acct.NavAction;
					var oParams = {};

					if (sSemanticObject && sSemanticObject === "BankAccountContract") {
						var sID = acct.BkAcctIdfgElmnts.ID;
						sID = this._deleteStartingZeros(sID);
						oParams = {
							BkCountryCode: acct.BkAcctIdfgElmnts.BkCountryCode,
							BkRoutingID: acct.BkAcctIdfgElmnts.BkRoutingID,
							ID: sID
						};
					} else {
						oParams = {
							BkAcctInternalID: acct.BkAcctIdfgElmnts.IntID
						};
					}

					if (i < oTblItems.length) {
						var oTblItem = oTblItems[i];
						this.callbackIsCrossAppNavigationSupported(fnCallback.bind(oTblItem), sSemanticObject, sAction, oParams);
					}
				}
			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the table counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("xtit.accountTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("xtit.accountTableTitle");
			}
			this.getModel("accountTableView").setProperty("/tableTitle", sTitle);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {

			var oCtxt = oItem.getBindingContext();

			var semanticObject = oCtxt.getProperty("NavSemanticObj");
			var action = oCtxt.getProperty("NavAction");

			var oParams = {};
			if (semanticObject && semanticObject === "BankAccountContract") {
				var sID = oCtxt.getProperty("BkAcctIdfgElmnts/ID");
				sID = this._deleteStartingZeros(sID);
				oParams = {
					BkCountryCode: oCtxt.getProperty("BkAcctIdfgElmnts/BkCountryCode"),
					BkRoutingID: oCtxt.getProperty("BkAcctIdfgElmnts/BkRoutingID"),
					ID: sID
				};
			} else {
				oParams = {
					BkAcctInternalID: oCtxt.getProperty("BkAcctIdfgElmnts/IntID")
				};
			}
			this.navToExternal(semanticObject, action, oParams);

		},

		_deleteStartingZeros: function(sTxt) {
			var sText = sTxt;
			if (sTxt) {
				sText = sTxt.replace(/^0+/, "");
			}
			return sText;
		}

	});
});