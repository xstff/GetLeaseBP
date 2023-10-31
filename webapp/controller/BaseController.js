sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"fs/cb/bankcustomer/displays1/model/formatter",
	"fs/cb/bankcustomer/displays1/model/utilities"
], function(Controller, formatter, utilities) {
	"use strict";

	return Controller.extend("fs.cb.bankcustomer.displays1.controller.BaseController", {

		formatter: formatter,

		getEitherValueOrFallback: function(obj) {
			if (obj) {
				var str = obj.toString();
				if (str !== null && str !== undefined && str.length > 0) {
					return obj;
				}
			}
			var oI18nModel = this.getView().getModel("i18n");
			var fallback = oI18nModel.getProperty("ymsg.NoValueFallback");
			return fallback;
		},

		isPropertyFilled: function(obj) {
			if (obj !== undefined && obj !== null) {
				var str = obj.toString();
				if (str !== null && str !== undefined && str.length > 0) {
					return true;
				}
			}
			return false;
		},

		isNotPropertyFilled: function(obj) {
			return !this.isPropertyFilled(obj);
		},

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			if (this.getOwnerComponent()) {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			}
		},

		/**
		 * If there are changes in main OData model  show data loss confirmation dialog
		 * If no changes or data loss confirmed, execute callback function
		 * @param {function} fCallback call back after check for changes
		 * @public
		 */
		checkForChangesAndExecute: function(fCallback) {

			var oModel = this.getView().getModel();

			if (oModel.hasPendingChanges()) {
				sap.m.MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("ymsg.data_loss"),
					jQuery.proxy(function(confirmed) {
						if (confirmed === "OK") {
							oModel.resetChanges();
							fCallback();
						}
					}, this),
					this.getView().getModel("i18n").getResourceBundle().getText("xtit.confirmation"));
			} else {
				fCallback();
			}

		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		handleAdvsrPtyPress: function(oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("fs.cb.bankcustomer.displays1.view.fragments.AdvsrPtyPopover", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(oEvent.getSource());
		},

		handleAdvsrPtyEmailPress: function(oEvent) {
			sap.m.URLHelper.triggerEmail(oEvent.getSource().getText());
		},

		handleAdvsrPtyPhonePress: function(oEvent) {
			sap.m.URLHelper.triggerTel(oEvent.getSource().getText());
		},

		handleEmailPress: function(oEvent) {
			sap.m.URLHelper.triggerEmail(oEvent.getSource().getText());
		},

		handleTelPress: function(oEvent) {
			sap.m.URLHelper.triggerTel(oEvent.getSource().getText());
		},

		/**
		 * Called when open further button in object header pressed
		 * open business partner data in sapgui
		 * @public
		 * @param {boolean} oEvent	event of button
		 */
		onOpenFurther: function(oEvent) {
			var sSemanticObject = "BankCustomer";
			var sAction = "displayMoreDetails";

			var oView = this.getView();
			var oModel = oView.getModel();
			var sPath = oView.getBindingContext().getPath();
			var sInternalID = oModel.getProperty(sPath + "/InternalID");
			/*			
						var oCrossAppNav = this.getCrossAppNav();
						if (oCrossAppNav) {
							oCrossAppNav.toExternal({
								target: {
									semanticObject: sSemanticObject,
									action: sAction
								},
								params: {
									InternalID: sInternalID
								}
							});
						}
			*/
			var params = {
				InternalID: sInternalID
			};

			this.navToExternal(sSemanticObject, sAction, params);
		},

		/**
		 * Convenience method to navigate to the corresponding route after check if there are any unsaved changes
		 * @public
		 * @param {string} sRouteName	Route Name
		 * @param {string} mParameters	Route Parameters
		 * @param {boolean} bReplace	Controls browser history:
		 *								true -> replace hash without adding to browser history
		 *								false -> replace hash with adding to browser history
		 */
		navTo: function(sRouteName, mParameters, bReplace) {

			// Callback function to be executed in case there are no unsaved changes
			var fnCallback = function() {
				if (sRouteName) {
					this.getRouter().navTo(sRouteName, mParameters, bReplace);
				} else {
					// if there is no value in the input, a corresponding ftd is not searched,
					// instead the start page is displayed directly 
					this.getRouter().navTo("start");
				}
			};

			this.checkForChangesAndExecute(fnCallback.bind(this));

		},

		getCrossAppNav: function() {
			if (!this.oCrossAppNav) {
				this.oCrossAppNav = sap.ushell && sap.ushell.Container &&
					sap.ushell.Container.getService &&
					sap.ushell.Container.getService("CrossApplicationNavigation");
			}
			return this.oCrossAppNav;
		},

		/**
		 * Navigate using external navigation
		 * check first if any changes on ui
		 * @function
		 * @param {string} [sSemanticObject] 	Name of the Semantic object
		 * @param {string} [sAction]	Name of the action
		 * @param {string} [oParams]	Parameter map to be passed through
		 * @public
		 */
		navToExternal: function(sSemanticObject, sAction, oParams) {

			var fnCallback = function() {
				var oCrossAppNav = this.getCrossAppNav();

				if (oCrossAppNav) {
					var nav = {
						target: {
							semanticObject: sSemanticObject,
							action: sAction
						},
						params: oParams
					};
					/*                    
					     				var str = sSemanticObject + "-" + sAction;
					    				if (oParams) {
					                        str = str + "?InternalID=" + oParams.InternalID;
					    				}
					    				oCrossAppNav.isIntentSupported([str])
					    					.done(function(aResponses) {
					    						if (aResponses[str].supported === true) {
					    							// enable link
					    						} else {
					    							// disable link
					    						}
					    					})
					    					.fail(function() {
					    						// disable link
					    					});
					*/
					oCrossAppNav.isNavigationSupported([nav]).done(function(aResponses) {
							if (aResponses && aResponses.length > 0 && aResponses[0].supported === true) {
								oCrossAppNav.toExternal(nav);
							}
						})
						.fail(function(o) {

						});
				}
			};

			this.checkForChangesAndExecute(fnCallback.bind(this));
		},

		callbackIsCrossAppNavigationSupported: function(fnCallback, sSemanticObject, sAction, oParams) {
			if (!fnCallback || !sSemanticObject || !sAction) {
				return;
			}
			var oCrossAppNav = this.getCrossAppNav();

			if (oCrossAppNav) {
				var nav = {
					target: {
						semanticObject: sSemanticObject,
						action: sAction
					},
					params: oParams
				};
				oCrossAppNav.isNavigationSupported([nav]).done(function(aResponses) {
						if (aResponses && aResponses.length > 0 && aResponses[0].supported === true) {
							fnCallback(true, sSemanticObject, sAction, oParams);
						} else {
							fnCallback(false, sSemanticObject, sAction, oParams);
						}
					})
					.fail(function(o) {
						fnCallback(false, sSemanticObject, sAction, oParams);
					});
			} else {
				fnCallback(false, sSemanticObject, sAction, oParams);
			}
		},

		/**
		 * checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		navigateBack: function() {

			var fnCallback = function() {

				var oHistory = sap.ui.core.routing.History.getInstance(),
					sPreviousHash = oHistory.getPreviousHash(),
					oCrossAppNavigator = this.getCrossAppNav();

				if (sPreviousHash !== undefined || !oCrossAppNavigator) {
					// The history contains a previous entry
					/*eslint-disable*/
					history.go(-1);
					/*eslint-enable*/
				} else if (oCrossAppNavigator) {
					// Navigate back to FLP home
					oCrossAppNavigator.toExternal({
						target: {
							shellHash: "#"
						}
					});
				}
			};

			this.checkForChangesAndExecute(fnCallback.bind(this));
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = this.getModel("mainview");
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("mainview"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		}

	});

});