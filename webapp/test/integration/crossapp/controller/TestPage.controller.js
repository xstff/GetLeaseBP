/*global location*/
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("test.integration.crossapp.controller.TestPage", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf fs.cb.timedeposit.maintain.fs.cb.timedeposit.maintain.test.crossap.view.TestPage
		 */
		onInit: function() {

			this.sSemanticObject = "BankCustomer";
			this.sSemanticAction = "display";

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fs.cb.timedeposit.maintain.fs.cb.timedeposit.maintain.test.crossap.view.TestPage
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf fs.cb.timedeposit.maintain.fs.cb.timedeposit.maintain.test.crossap.view.TestPage
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fs.cb.timedeposit.maintain.fs.cb.timedeposit.maintain.test.crossap.view.TestPage
		 */
		//	onExit: function() {
		//
		//	},

		navToExternal: function(oParams, sAppStateKey) {
			this.oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");

			if (this.oCrossAppNavigator) {

				this.oCrossAppNavigator.toExternal({
					target: {
						semanticObject: this.sSemanticObject,
						action: this.sSemanticAction
					},
					params: oParams,
					appStateKey: sAppStateKey
				});
			}

		},

		navigateToAppWithoutParamaters: function(oEvent) {

			this.navToExternal();

		},

		navigateToAppUsingBPUUID: function(oEvent) {

			var oParams = {
				CustomerUUID: "8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55"
			};

			this.navToExternal(oParams);

		},

		navigateToAppUsingWrongBPUUID: function(oEvent) {

			var oParams = {
				CustomerUUID: "88888888-A21C-1ED5-A7D1-8B305EA24F55"
			};

			this.navToExternal(oParams);

		},

		navigateToAppUsingAppState: function(oEvent) {

			var oParams = {
				BkAcctInternalID: "9D503919F9841ED5B4968CDCD4B1A21C"
			};

			var initialContent = {
				AcctHldrPartyInternalID: "TD4",
				OplBkContrMgmtUnitID: "50000607",
				TimeDepositBkAcctID: "0010002379",
				TimeDepositBusinessSystemID: "F6D_100",
				TimeDepositID: "DE18900000010010002379",
				TimeDepositIDSchemeAgencyID: "310",
				TimeDepositIDSchemeID: "BAC.001",
				TimeDepositStandardID: "DE18900000010010002379"
			};

			var appComponent = this.getOwnerComponent(); // Current app UI5 component.

			// the component *must* be passed, this allows to associate the stored data with an application. 
			var appState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(appComponent);

			// appState has same interface as PersonalizationContaier

			appState.setData(initialContent);

			// updates local session context (not URL/hash) as application state changes and asynchronously mirror it to backend 
			var that = this;
			appState.save().done(function() {
				that.navToExternal(oParams, appState.getKey());
			}); // immediate save

		},

		navigateToAppUsingWrongAppStateContent: function(oEvent) {

			var oParams = {
				BkAcctInternalID: "9D503919F9841ED5B4968CDCD4B1A21C"
			};

			var initialContent = {
				dummy1: "1111",
				dummy2: "2222"
			};

			var appComponent = this.getOwnerComponent(); // Current app UI5 component.

			// the component *must* be passed, this allows to associate the stored data with an application. 
			var appState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(appComponent);

			// appState has same interface as PersonalizationContaier

			appState.setData(initialContent);

			// updates local session context (not URL/hash) as application state changes and asynchronously mirror it to backend 
			var that = this;
			appState.save().done(function() {
				that.navToExternal(oParams, appState.getKey());
			}); // immediate save

		},

		navigateToAppUsingWrongAppStateKey: function(oEvent) {

			var oParams = {
				BkAcctInternalID: "9D503919F9841ED5B4968CDCD4B1A21C"
			};
			var sAppStateKey = "111AAAA000J4COHZE89PJPS5OSEDGLPKQGIU1VM";

			this.navToExternal(oParams, sAppStateKey);

		},

		navigateToAppUsingWrongInternalIdAndAppState: function(oEvent) {

			var oParams = {
				CustomerUUID: "88888888-A21C-1ED5-A7D1-8B305EA24F55"
			};
			var sAppStateKey = "1112222000J4COHZE89PJPS5OSEDGLPKQGIU1VM";

			this.navToExternal(oParams, sAppStateKey);

		},

		navigateToAppUsingAppStateWithoutInternalId: function(oEvent) {

			var initialContent = {
				AcctHldrPartyInternalID: "TD4",
				OplBkContrMgmtUnitID: "50000607",
				TimeDepositBkAcctID: "0010002379",
				TimeDepositBusinessSystemID: "F6D_100",
				TimeDepositID: "DE18900000010010002379",
				TimeDepositIDSchemeAgencyID: "310",
				TimeDepositIDSchemeID: "BAC.001",
				TimeDepositStandardID: "DE18900000010010002379"
			};

			var appComponent = this.getOwnerComponent(); // Current app UI5 component.

			// the component *must* be passed, this allows to associate the stored data with an application. 
			var appState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(appComponent);

			// appState has same interface as PersonalizationContaier

			appState.setData(initialContent);

			// updates local session context (not URL/hash) as application state changes and asynchronously mirror it to backend 
			var that = this;
			appState.save().done(function() {
				that.navToExternal(null, appState.getKey());
			}); // immediate save

		}

	});

});