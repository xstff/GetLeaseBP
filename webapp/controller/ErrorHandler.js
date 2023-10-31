sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox"
], function(UI5Object, MessageBox, utilities) {
	"use strict";

	return UI5Object.extend("fs.cb.bankcustomer.displays1.controller.ErrorHandler", {

		
		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias fs.cb.bankcustomer.displays1.controller.ErrorHandler
		 */
		constructor: function(oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._oSearchModel = oComponent.getModel("search");
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");

			this._oModel.attachMetadataFailed(function(oEvent) {
				var oParams = oEvent.getParameters();
				this._showMainServiceMetadataError(oParams.response);
			}, this);

			this._oSearchModel.attachMetadataFailed(function(oEvent) {
				var oParams = oEvent.getParameters();
				this._showSearchServiceMetadataError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function(oEvent) {
				var oParams = oEvent.getParameters();

				// An entity that was not found in the service is also throwing a 404 error in oData.
				// We already cover this case with a notFound target so we skip it here.
				// A request that cannot be sent to the server is a technical error that we have to handle though
				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf(
					"Cannot POST") === 0)) {
					this._showServiceError(oParams.response);
				}
			}, this);

			this._oSearchModel.attachRequestFailed(function(oEvent) {
				var oParams = oEvent.getParameters();

				// An entity that was not found in the service is also throwing a 404 error in oData.
				// We already cover this case with a notFound target so we skip it here.
				// A request that cannot be sent to the server is a technical error that we have to handle though
				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf(
						"Cannot POST") === 0)) {
					this._showServiceError(oParams.response);
				}
			}, this);
		},

		/**
		 * Shows a {@link sap.m.MessageBox} when the metadata call has failed.
		 * The user can try to refresh the metadata.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showMainServiceMetadataError: function(sDetails) {
			MessageBox.error(
				this._sErrorText, {
					id: "mainServiceMetadataErrorMessageBox",
					details: sDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.RETRY, MessageBox.Action.CLOSE],
					onClose: function(sAction) {
						if (sAction === MessageBox.Action.RETRY) {
							this._oModel.refreshMetadata();
						}
					}.bind(this)
				}
			);
		},

		/**
		 * Shows a {@link sap.m.MessageBox} when the metadata call has failed.
		 * The user can try to refresh the metadata.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showSearchServiceMetadataError: function(sDetails) {
			MessageBox.error(
				this._sErrorText, {
					id: "searchServiceMetadataErrorMessageBox",
					details: sDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.RETRY, MessageBox.Action.CLOSE],
					onClose: function(sAction) {
						if (sAction === MessageBox.Action.RETRY) {
							this._oSearchModel.refreshMetadata();
						}
					}.bind(this)
				}
			);
		},

		/**
		 * Shows a {@link sap.m.MessageBox} when a service call has failed.
		 * Only the first error message will be display.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showServiceError: function(sDetails) {
/*			
			if (this._bMessageOpen) {
				return;
			}
			if (this._timer) {
				return;
			}
			this._timer = jQuery.sap.delayedCall(500, this, this._openMessageBox, 
				[{
					text: this._sErrorText,
					params: {
						id: "serviceErrorMessageBox",
						details: sDetails,
						styleClass: utilities.getContentDensityClass(),
						actions: [MessageBox.Action.CLOSE],
						onClose: function() {
							this._bMessageOpen = false;
						}.bind(this)
					}
				}]);
*/				
			var oViewModel = this._oComponent.getModel("mainview");
			if (oViewModel) {
    		    oViewModel.setProperty("/busy", false);
			}

			this._oComponent.getRouter().getTargets().display("error");
		}
		
/*		
		_openMessageBox: function(oParams) {
			jQuery.sap.clearDelayedCall(this._timer);
			this._timer = null;
			this._bMessageOpen = true;
			MessageBox.error(
				oParams.text, oParams.params
			);
		}
*/		
	});
	
	
});