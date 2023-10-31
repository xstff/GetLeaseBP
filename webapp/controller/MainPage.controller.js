/*global location*/
sap.ui.define([
	"fs/cb/bankcustomer/displays1/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/ui/core/format/DateFormat",
	"fs/cb/bankcustomer/displays1/model/genericNavigationHandler",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, MessagePopover, MessagePopoverItem, DateFormat, genericNavigationHandler,
			Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("fs.cb.bankcustomer.displays1.controller.MainPage", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
					isObjectPage: false,
					//					isEditPage: false,
					isSearchSupported: true,
					busy: false,
					delay: 0,
					personVisible: false,
					organisationVisible: false,
					groupVisible: false,

					BUSINESS_SYSTEM_ID: "F6D_100"

				});
			this.setModel(oViewModel, "mainview");

			this._initRouting();
			this._initMessagePopover();

			var oModel = this.getOwnerComponent().getModel();

			// Store original busy indicator delay, so it can be restored later on
			oModel.metadataLoaded().then(function() {
				oViewModel.setProperty("/delay", 100);
			});

		},


		/**
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler  for navigating back.
		 * @public
		 */
		onNavBack: function() {

			this.navigateBack();

		},


		/**
		 * Event handler to open the message popover to display the messages in the message model
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		 * @public
		 */
		onMessagesButtonPress: function(oEvent) {

			var oMessagesButton = oEvent.getSource();
			this._oMessagePopover.toggle(oMessagesButton);

		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Replace value in the search field
		 * @function
		 * @param {string} sValue	value to be placed
		 * @private
		 */
		_setSearchValue: function(sValue) {
			
			var oSearchView = this.getView().byId("searchView");

			if (oSearchView && oSearchView.getController()) {
				oSearchView.getController().setSearchFieldValue(sValue);
			}
/*			
			var sId = sap.ui.core.Fragment.createId("fragmentSearchPanel", "searchInput");
			this.byId(sId).setValue(sValue);
*/
		},

		/** 
		 * Register event handler for all in-app route path and targets supporting by the application
		 * All routes to sub-pages are also caught in the mainpage, to steer the visibility of the
		 * two containers containing the sub-pages
		 * @function
		 * @private
		 */
		_initRouting: function() {

			var oViewModel = this.getModel("mainview");

			var route = this.getRouter().getRoute("init_start");
			route.attachPatternMatched(function() {

				this._unbindView();

				// because the start page is a message page, isObjectPage is set to false.
				oViewModel.setProperty("/isObjectPage", false);

				// the search field is not initialized when navigating back to initial page

			}, this);

			route = this.getRouter().getRoute("start");
			route.attachPatternMatched(function() {

				this._unbindView();

    			oViewModel.setProperty("/busy", false);

				// because the start page is a message page, isObjectPage is set to false.
				oViewModel.setProperty("/isObjectPage", false);

				// when starting fresh, e.g. by deleting the hash of a purchase order deep link, 
				// the input is set back to empty.
				this._setSearchValue("");

			}, this);

			route = this.getRouter().getTargets().getTarget("notFound");
			route.attachDisplay(function() {

				this._unbindView();

    			oViewModel.setProperty("/busy", false);

				//this.getRouter()

				// because the not found page is a message page, isObjectPage is set to false.
				oViewModel.setProperty("/isObjectPage", false);

				// enable user to search for business partner
				oViewModel.setProperty("/isSearchSupported", true);
			}, this);

			this.getRouter().getTargets().getTarget("error").attachDisplay(function() {

				jQuery.sap.log.info("Target 'error' to be displayd", this.getOwnerComponent().getComponentName());

				//this._unbindView();

				oViewModel.setProperty("/busy", false);
				// because the not found page is a message page, isObjectPage is set to false.
				oViewModel.setProperty("/isObjectPage", false);
				// enable user to search for business partner
				oViewModel.setProperty("/isSearchSupported", true);

			}, this);

			route = this.getRouter().getRoute("displayCustomer");
			route.attachPatternMatched(function(oEvent) {

				this._unbindView();

				var mParameters = oEvent.getParameter("arguments");
				var sCustomerUUID = mParameters.iCustomerUUID;

				if (sCustomerUUID) {
					// because the object page to be displayed, isObjectPage is set to true and isEditPage to false
					oViewModel.setProperty("/isObjectPage", true);
					this._bindView("/BkCustomerSet(UUID=guid'" + sCustomerUUID + "')");
				} else {
					// if there is no business partner id provided, a corresponding customer could not be retrieved,
					// instead the start page is displayed directly 
					this.getRouter().navTo("start");
				}

			}, this);

			// Route: displayAccount
			// Bind view to the respective object and enable the required UI elements
			this.getRouter().getRoute("displayCustomerWithAppState").attachPatternMatched(function(oEvent) {

				this._unbindView();
				var that = this;
				var mParameters = oEvent.getParameter("arguments");
				var sContainerId = mParameters.iAppState;
				var sCustomerUUID = mParameters.iCustomerUUID;

				genericNavigationHandler.getInnerAppState(sContainerId).then(function(oContainer) {

					// because the object page to be displayed, isObjectPage is set to true and isEditPage to false
					oViewModel.setProperty("/isObjectPage", true);
					oViewModel.setProperty("/isEditPage", false);
					// show data of the business partner

					var oItem = oContainer.getItemValue("params");
					if (oItem) {
						// trigger oData
						that._triggerBinding(oItem);

					} else {
						if (sCustomerUUID) {
						    sCustomerUUID = sCustomerUUID.trim();
						    if (sCustomerUUID.indexOf("-") < 0 && (sCustomerUUID.length === 32)) {
						        var str = sCustomerUUID.substr(0,8) + "-" + sCustomerUUID.substr(8,4) 
						                    + "-" + sCustomerUUID.substr(12,4) + "-" + sCustomerUUID.substr(16,4) 
						                    + "-" + sCustomerUUID.substr(20,12);
						        sCustomerUUID = str;
						    }
							var oSearchModel = that.getView().getModel("search");
			                oViewModel.setProperty("/busy", true);							
			                
							var sPath = "/Fs_C_Bps_Accthldr_Search_V1"; //(UUID=guid'" + sCustomerUUID + "')";
							var aFilters = [];
							aFilters.push(new Filter("UUID", FilterOperator.EQ, sCustomerUUID));
							oSearchModel.read(sPath, {
								filters: aFilters,
								success: function(oData, oResponse) { // onSuccess
									// trigger oData
									if (oData.results) {
										if (oData.results.length > 0) { 
											that._triggerBinding(oData.results[0]);
										} else {
											that.getRouter().getTargets().display("notFound");
										}
									} else {
										that._triggerBinding(oData);
									}
								},
								error: function(oError) {
									that.getRouter().getTargets().display("error");
								} // onError
							});
							// End read
						} else {
							that.navTo("notFound");
						}
					}
				}, function(oError) {
					jQuery.sap.log.error("error on navigation to customer");
				});

			}, this);
			
		},
		
		_triggerBinding: function(oData) {
//			var oEventBus = sap.ui.getCore().getEventBus();

			var oViewModel = this.getModel("mainview");
			oViewModel.setProperty("/busy", false);

			this._bindView("/BkCustomerSet(UUID=guid'" +
				oData.UUID + "',BusinessSystemID='" + oData.BusinessSystemID + "')");

		},

		/**
		 * Create and bind the message popover to show error messages e.g. in case of backend availability issues
		 * or UI validation
		 * @function
		 * @private
		 */
		_initMessagePopover: function() {

			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);

			this._oMessagePopover = new sap.m.MessagePopover({
				items: {
					path: "message>/",
					template: new sap.m.MessagePopoverItem({
						description: "{message>description}",
						type: "{message>type}",
						title: "{message>message}"
					})
				}
			});

			this._oMessagePopover.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

		},

		/**
		 * Unbind the view to remove all the date
		 * @function
		 * @private
		 */
		_unbindView: function() {
			this.getView().unbindElement();
		},
		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {

			var oViewModel = this.getModel("mainview"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					//					expand: "AdvsrPty"					
					expand: "Addresses,AdvsrPty"
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		/**
		 * Event handler to element bidning change event
		 * check if binding context is set:
		 *		yes -> replace text's for links and action
		 *		no -> display not faund message page
		 * @function
		 * @param {sap.ui.base.Event} [oEvent] Event object to get reference to the source control
		 * @private
		 */
		_onBindingChange: function(oEvent) {

			var oView = this.getView(),
				oViewModel = this.getModel("mainview"),
				oDataModel = this.getModel(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("notFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectInternalId = oObject.InternalID,
				sObjectName = oObject.BusinessPartnerFormattedName;

			this._setSearchValue(sObjectInternalId);

			var oEventBus = sap.ui.getCore().getEventBus();
			var sPath = this.getView().getBindingContext().getPath();
			oEventBus.publish("fs.cb.bankcustomer.displays1", "bindingChanged", {
				oEvent: oEvent
			});

			var bp = oDataModel.getProperty(sPath);
			var personVisible = false;
			var organisationVisible = false;
			var groupVisible = false;
			//			var icon;
			//			var id = sap.ui.core.Fragment.createId("fragmentObjectHeaderTitle", "iconObjectHeader");
			var navContainer = oView.byId("ObjectPageContainer");
			var currPage = navContainer.getCurrentPage();
			var viewHeaderContent = currPage.byId("viewObjectHeaderContent");
			var iconCtrl = viewHeaderContent.byId("iconObjectHeaderContent");

			var sIcon;
			if (bp) {
				switch (bp.CategoryCode) {
					case "1":
						personVisible = true;
						sIcon = "sap-icon://customer";
						break;
					case "2":
						organisationVisible = true;
						sIcon = "sap-icon://factory";
						break;
					case "3":
						groupVisible = true;
						sIcon = "sap-icon://group";
						break;
				}
			}

			var txt = " ";
			if (personVisible) {
				// Person
				var birthDate = bp.Person.BirthDate;
				var sBirthDate;
				var sBirthPlace = bp.Person.BirthPlace;
				if (birthDate) {
					var dateFormatter = DateFormat.getDateInstance({
						style: "medium"
					});
					sBirthDate = dateFormatter.format(birthDate);
				}
				var i18nModel = this.getView().getModel("i18n");
				if (sBirthDate && sBirthPlace) {
					txt = jQuery.sap.formatMessage(i18nModel.getProperty("xtit.subtitlePersonBirthDateAndPlace"), [sBirthDate, sBirthPlace]);
				} else if (sBirthDate && !sBirthPlace) {
					txt = jQuery.sap.formatMessage(i18nModel.getProperty("xtit.subtitlePersonBirthDate"), [sBirthDate]);
				} else if (!sBirthDate && sBirthPlace) {
					txt = jQuery.sap.formatMessage(i18nModel.getProperty("xtit.subtitlePersonBirthPlace"), [sBirthPlace]);
				}
			}

			if (iconCtrl) {
				iconCtrl.setSrc(sIcon);
			}

			var bNoPreferredContactData = false;
			if (!this.isPropertyFilled(bp.DefaultPhoneFormattedNumber) &&
				!this.isPropertyFilled(bp.DefaultEmailURI)) {
				bNoPreferredContactData = true;
			}
			
			var bNoContactDetails = false;
			if (!this.isPropertyFilled(bp.FormattedLandlineNumber) &&
				!this.isPropertyFilled(bp.FormattedCellPhoneNumber)   &&
				!this.isPropertyFilled(bp.DefaultEmailURI)) {
				bNoContactDetails = true;
			}

			var addresses = oDataModel.getProperty(sPath + "/Addresses");
			this._updateStdAddress(addresses);

			oViewModel.setProperty("/NoPreferredContactData", bNoPreferredContactData);
			oViewModel.setProperty("/NoContactDetails", bNoContactDetails);
			oViewModel.setProperty("/ObjectPageHeaderSubTitle", txt);

			oViewModel.setProperty("/personVisible", personVisible);
			oViewModel.setProperty("/organisationVisible", organisationVisible);
			oViewModel.setProperty("/groupVisible", groupVisible);

			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectInternalId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectInternalId]));
				
			var sSemanticObject = "BankCustomer";
			var sAction = "displayMoreDetails";
			var params = {
				InternalID: bp.InternalID
			};

		    this.callbackIsCrossAppNavigationSupported(function(enable) {
    		        var id = sap.ui.core.Fragment.createId("fragmentObjectHeaderTitle", "buttonFurther");
    		        var ctrl = currPage.byId(id);
    		        if (ctrl) {
    		            ctrl.setEnabled(enable);
    		            ctrl.setVisible(enable);
    		        }
		        }, sSemanticObject, sAction, params);
		},
		
		_updateStdAddress: function(addresses) {
			var oViewModel = this.getModel("mainview"),
				oDataModel = this.getModel();
		    
			// get standard address and store it in mainview JSON-Model to show it
			var addr = null;
			var STD_USAGE_ID = "XXDEFAULT";
			var jsonAddresses = [];
			for (var i = 0; addresses && i < addresses.length; i++) {
				var sAddrPath = "/" + addresses[i];
				var obj = oDataModel.getProperty(sAddrPath);
				if (obj && obj.AddrUsageCode === STD_USAGE_ID) {
					addr = obj;
					//					break;
				}
				jsonAddresses.push(obj);
			}

			var bNoPostalAddress = false;
			if (!this.isPropertyFilled(addr)) {
				bNoPostalAddress = true;
			}
			
			oViewModel.setProperty("/NoPostalAddress", bNoPostalAddress);
			oViewModel.setProperty("/StandardAddress", addr);
		}

	});

});