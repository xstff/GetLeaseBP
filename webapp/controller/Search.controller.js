sap.ui.define([
	"fs/cb/bankcustomer/displays1/controller/BaseController",
	"fs/cb/bankcustomer/displays1/model/genericNavigationHandler",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, genericNavigationHandler, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("fs.cb.bankcustomer.displays1.controller.Search", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when controller is instantiated.
		 * @public
		 */
		onInit: function () {

			var oSearchModel = this.getOwnerComponent().getModel("search");

			var oSmartField = this.getView().byId("searchField");
			oSmartField.setModel(oSearchModel); // set as domain/not-named model as Smart controls are working only with domain model
			this.getView().attachBrowserEvent("keypress", this.handleKeypress); // required to check the user input

			// create context with dummy/empty values 
			var mParameters = {};
			mParameters.properties = {};
			mParameters.properties.InternalID = "";
			mParameters.groupId = "search";

			oSearchModel.setDeferredGroups(["search"]);
			oSearchModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			oSearchModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);

			oSearchModel.metadataLoaded().then(function () {
				var oContext = oSearchModel.createEntry("/Fs_C_Bps_Accthldr_Search_V1", mParameters);
				oSmartField.setBindingContext(oContext);
			});

		},
		/**
		 * Event handler for Change event on search field 
		 * after user changes the value and the focus leaves the field, or after the Enter key has been pressed
		 * check the value of search field 
		 * Navigate to details or to initial page for empty search field
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		 */
		onChange: function (oEvent) {

			var oParameters = oEvent.getParameters();
			// Validate means entered via value help
			if (oParameters.validated !== true) {
				this._checkEnteredValueAndBP();
			} else {
				this._navigate(oParameters.newValue);
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for initialization event on smart field
		 * Create context and bind on smart control allowing smart control to identify 
		 * the respective metadata/annoptations
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		 */
		onSmartFieldInitialise: function (oEvent) {

			var oSource = oEvent.getSource();

			var oModel = oSource.getModel();

			oModel.metadataLoaded().then(function () {
				var oInput = oSource.getInnerControls()[0];
				oInput.setProperty("startSuggestion", 5);
				oInput.setProperty("maxSuggestionWidth", "50em");
			});

			this.setFocusOnSearchField();
		},

		onAfterRendering: function (oEvent) {
			this.setFocusOnSearchField();
		},

		/**
		 * Event handler for key press event
		 * For ENTER key press event check the value of search field 
		 * Navigate to details
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		 */
		handleKeypress: function (oEvent) {

			// process only if ENTER pressed
			if (oEvent.keyCode === jQuery.sap.KeyCodes.ENTER) {
				this.getController()._checkEnteredValueAndBP();
			}

		},

		/**
		 * Event handler for innerControlsCreated event
		 * @public
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		 */
		onInnerControlsCreated: function (oEvent) {

			// Busy indicator of the App to be removed first if the smart field inner controls are created
			var oAppView = this.getView().getModel("appView");
			//oAppView.setProperty("/busy", false);
			oAppView.setProperty("/busyOnSearchComponent", false);
			this.setFocusOnSearchField();
		},

		/* =========================================================== */
		/* Public methods                                              */
		/* =========================================================== */

		/**
		 * 
		 * @public
		 * @param {string} [sValue] value to be set
		 */
		setSearchFieldValue: function (sValue) {

			var oSearchControl = this.getView().byId("searchField");
			oSearchControl.setValue(sValue);

			// workaorund for the smart field
			if (oSearchControl.getValue() !== sValue && oSearchControl.getInnerControls()[0]) {
				oSearchControl.getInnerControls()[0].setValue(sValue);
			}
		},

		/**
		 * 
		 * @public
		 */
		setFocusOnSearchField: function () {

			var oSearchControl = this.getView().byId("searchField");
			//oSearchControl.focus(); //TODO Internal Incident: 1680123992
			oSearchControl.addStyleClass("sapMInputFocused");
		},

		/* =========================================================== */
		/* Private methods                                             */
		/* =========================================================== */

		/**
		 * @private
		 */
		_checkEnteredValueAndBP: function () {

			// Callback function to be executed in case there are no unsaved changes
			var fnCallback = function () {
				var oSearchControl = this.getView().byId("searchField");
				var oSearchTerm = oSearchControl.getValue();

				// if search value is empty -> UI error
				if (!oSearchTerm && oSearchTerm === "") {
					// if there is no business partner id provided, a corresponding customer could not be retrieved,
					// instead the start page is displayed directly 
					this.getRouter().navTo("start");
					return;
					// if search value longer than 10 -> UI error	
				} else if (oSearchTerm.length > 10) {
					oSearchControl.setValueState(sap.ui.core.ValueState.Error);
					oSearchControl.setValueStateText(this.getResourceBundle().getText("ymsg.bankCustomerIDGreater10"));
					this.setFocusOnSearchField();
					return;
				} else {
					this._navigate(oSearchTerm);
					oSearchControl.setValueState(sap.ui.core.ValueState.None);
				}
			};

			this.checkForChangesAndExecute(fnCallback.bind(this));

		},

		_navigate: function (sInternalID) {
			if (!sInternalID) {
				return;
			}

			var oViewModel = this.getModel("mainview");
			oViewModel.setProperty("/busy", true);

			var oSearchModel = this.getView().getModel("search");
			var sPath = "/Fs_C_Bps_Accthldr_Search_V1";
			var oFilter = new Filter({
				path: "InternalID",
				operator: FilterOperator.EQ,
				value1: sInternalID
			});

			var that = this;

			if (sInternalID) {
				oSearchModel.read(sPath, {
					filters: [oFilter],
					success: function (oData, oResponse) { // onSuccess
						if (oData.results.length === 1) {
							if (oData.results[0]) {
								var sUUID = oData.results[0].UUID;
								var oParamValues = {
									UUID: oData.results[0].UUID,
									InternalID: oData.results[0].InternalID,
									BusinessSystemID: oData.results[0].BusinessSystemID
								};
							}
							// save the InnerAppState and navigate 
							genericNavigationHandler.storeInnerAppState(that.getOwnerComponent(), oParamValues).then(function (oContainer) {
								that.navTo("displayCustomerWithAppState", {
									iAppState: oContainer.getKey(),
									iCustomerUUID: sUUID
								});
							}, function (oError) {
								jQuery.sap.log.error("error on navigation to account");
							});
						} else if (oData.results.length === 0) {
							that.getRouter().getTargets().display("notFound");
						} else if (oData.results.length > 1) { // if more results -> not found
							that.getRouter().getTargets().display("notFound");
						}
					},
					error: function (oError) {
							jQuery.sap.log.error("Error backend call of the search service usings search term " + sInternalID);
							if (oError && oError.statusCode === "404") {
								that.getRouter().getTargets().display("notFound");
							} else {
								that.getRouter().getTargets().display("error");
							}
						} // onError
				});
				// End read
			}
		}
	});

});