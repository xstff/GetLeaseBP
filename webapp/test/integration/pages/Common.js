/*eslint-disable valid-jsdoc */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/test/matchers/Properties",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Locale",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText"
], function(Opa5, ResourceModel, Properties, DateFormat, Locale, NumberFormat, Press, EnterText) {
	"use strict";

	function getFrameUrl(sHash, sUrlParameters) {
		var sUrl = jQuery.sap.getResourcePath("fs/cb/bankcustomer/displays1/app", ".html");
		var sUrlParam = sUrlParameters ? "?" + sUrlParameters : "";
		var sHashReturn = sHash;

		if (sHashReturn) {
			sHashReturn = "#BankCustomer-display&/" + (sHashReturn.indexOf("/") === 0 ? sHashReturn.substring(1) : sHashReturn);
		} else {
			sHashReturn = "#BankCustomer-display";
		}

		return sUrl + sUrlParam + sHashReturn;
	}

	function getShellHomeUrl(sInHash, sInUrlParameter) {

		var sUrl = jQuery.sap.getResourcePath("fs/cb/bankcustomer/displays1/app", ".html");
		var sUrlParameters = sInUrlParameter ? "?" + sInUrlParameter : "";

		var sHash = "#Shell-home";
		if (sInHash) {
			sHash = "#Shell-home&/" + (sInHash.indexOf("/") === 0 ? sInHash.substring(1) : sInHash);
		}

		return sUrl + sUrlParameters + sHash;
	}

	function getCrossAppTestUrl(sInHash, sInUrlParameter) {

		var sUrl = jQuery.sap.getResourcePath("fs/cb/bankcustomer/displays1/app", ".html");
		var sUrlParameters = sInUrlParameter ? "?" + sInUrlParameter : "";

		var sHash = "#CrossAppNavigation-test";
		if (sInHash) {
			sHash = "#CrossAppNavigation-test&/" + (sInHash.indexOf("/") === 0 ? sInHash.substring(1) : sInHash);
		}

		return sUrl + sUrlParameters + sHash;
	}

	return Opa5.extend("fs.cb.bankcustomer.displays1.test.integration.pages.Common", {

		iStartMyApp: function(oOptions) {
			var sUrlParameters;
			var oAppOptions = oOptions || {};

			// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
			var iDelay = oAppOptions.delay || 50;

			sUrlParameters = "serverDelay=" + iDelay;

			this.iStartMyAppInAFrame(getFrameUrl(oAppOptions.hash, sUrlParameters));
		},

		iStartMyAppWithURLParameters: function(sUrlParameters) {

			var sUrl = getFrameUrl(undefined, "");

			sUrl = sUrl + "?" + sUrlParameters;

			this.iStartMyAppInAFrame(sUrl);
		},

		iStartFLP: function(oInOptions) {
			var sUrlParameters;
			var oOptions = oInOptions || {};

			// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
			var iDelay = oOptions.delay || 50;

			sUrlParameters = "serverDelay=" + iDelay;

			this.iStartMyAppInAFrame(getShellHomeUrl(oOptions.hash, sUrlParameters));
		},

		iStartCrossAppTestApp: function(oInOptions) {
			var sUrlParameters;
			var oOptions = oInOptions || {};

			// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
			var iDelay = oOptions.delay || 50;

			sUrlParameters = "serverDelay=" + iDelay;

			this.iStartMyAppInAFrame(getCrossAppTestUrl(oOptions.hash, sUrlParameters));
		},

		iLookAtTheScreen: function() {
			return this;
		},

		createAWaitForAnEntitySet: function(oOptions) {
			return {
				success: function() {
					var bMockServerAvailable = false,
						aEntitySet;

					this.getMockServer().then(function(oMockServer) {
						aEntitySet = oMockServer.getEntitySetData(oOptions.entitySet);
						bMockServerAvailable = true;
					});

					return this.waitFor({
						check: function() {
							return bMockServerAvailable;
						},
						success: function() {
							oOptions.success.call(this, aEntitySet);
						},
						errorMessage: "was not able to retireve the entity set " + oOptions.entitySet
					});
				}
			};
		},

		getMockServer: function() {
			return new Promise(function(success) {
				Opa5.getWindow().sap.ui.require(["fs/cb/bankcustomer/displays1/localService/mockserver"], function(mockserver) {
					success(mockserver.getMockServer());
				});
			});
		},

		iStartMyAppOnADesktopToTestErrorHandler: function(sParam) {
			this.iStartMyAppInAFrame(getFrameUrl("", sParam));
		},

		getI18nText: function(sI18nKey) {
			var oResourceModel = new ResourceModel({
				bundleUrl: jQuery.sap.getModulePath("fs.cb.bankcustomer.displays1", "/i18n/i18n.properties")
			});
			return oResourceModel.getResourceBundle().getText(sI18nKey);
		},

		getDateFormatter: function() {
			return DateFormat.getDateInstance({
				style: "medium"
			});
		},

		getAmountFormatter: function() {
			return NumberFormat.getCurrencyInstance({
				showMeasure: false
			});
		},

		// getPercentageFormatter: function() {
		// 	return new PercentageType({
		// 		decimals: 2
		// 	});
		// },

		theUnitNumbersShouldHaveTwoDecimals: function(sControlType, sViewName, sSuccessMsg, sErrMsg) {
			var rTwoDecimalPlaces = /^-?\d+\.\d{2}$/;

			return this.waitFor({
				controlType: sControlType,
				viewName: sViewName,
				success: function(aNumberControls) {
					Opa5.assert.ok(aNumberControls.every(function(oNumberControl) {
							return rTwoDecimalPlaces.test(oNumberControl.getNumber());
						}),
						sSuccessMsg);
				},
				errorMessage: sErrMsg
			});
		},

		/**
		 * Checks if the given Texts are written in the given UI Elements
		 * Parameters:	aData	- Array IDs combined with texts
		 *
		 * Pattern:		[ 	["ID1", "VALUE1", "TYPE1"],
		 *					["ID2", "VALUE2", "TYPE2"],
		 *					["ID3", "VALUE3", "TYPE3"]
		 * 				]
		 */

		iSeeCorrectValues: function(aData) {
			for (var k = 0; k < aData.length; k++) {
				var myId = aData[k][0];
				var myValue = aData[k][1];
				var type = aData[k][2];
				var property = aData[k][3];

				this.iSeeCorrectValue(myId, myValue, type, property);
			}
			return this;
		},

		/**
		 * Checks if the given Text is shown in the given UI Element
		 * @param {string} [id] Element ID 
		 * @param {string} [value] The value to be checked
		 * @param {string} [type] The type of Element
		 * @param {string} [property] : Value, Text, Title
		 * @returns {string} Success or Error Message 
		 */
		iSeeCorrectValue: function(id, value, type, property) {
			var controlType;
			if (typeof type === "undefined") {
				controlType = "sap.ui.core.Control";
			} else {
				controlType = type;
			}

			this.waitFor({
				controlType: controlType,
				success: function(aElements) {
					var regExp = new RegExp("(--){1,}" + id + "(?=-|$){0,1}");
					var bFound = false;
					for (var i = 0; i < aElements.length; i++) {
						if (regExp.test(aElements[i].getId()) === true) {
							var val = "";
							if (property === "Text" && typeof(aElements[i].getSelectedItem) !== "undefined") {
								val = aElements[i].getSelectedItem().getText();
							} else if (property === "Value" && typeof(aElements[i].getValue) !== "undefined") {
								val = aElements[i].getValue();
							} else if (property === "Text" && typeof(aElements[i].getText) !== "undefined") {
								val = aElements[i].getText();
							} else if (property === "Title" && typeof(aElements[i].getTitle) !== "undefined") {
								val = aElements[i].getTitle();
							} else if (property === "Boolean" && typeof(aElements[i].getSelected) !== "undefined") {
								val = aElements[i].getSelected();
							} else if (property === "selectedKey" && typeof(aElements[i].getSelectedKey) !== "undefined") {
								val = aElements[i].getSelectedKey();
							} else if (property === "Icon" && typeof(aElements[i].getTooltip) !== "undefined") {
								val = aElements[i].getTooltip();
							}
							if (String(val) === value) {
								bFound = true;
								break;
							}
						}
					}
					if (!bFound) {
						ok(bFound, id + " is incorrect (" + val + " !== " + value + ")");
					} else {
						ok(String(val) === value, id + " is correct (" + val + " === " + value + ")");
					}
				},
				timeout: 30,
				pollingInterval: 50
			});
			return this;
		},

		/**
		 * Checks if the given Texts are not shown on the UI
		 * @public
		 * @param {object} [aData] Array IDs combined with texts
		 * Pattern:		[ 	["ID1", "VALUE1", "TYPE1"],
		 *					["ID2", "VALUE2", "TYPE2"],
		 *					["ID3", "VALUE3", "TYPE3"]
		 * 				]
		 * @returns {string} Success or Error Message 
		 */
		iDoNotSeeValues: function(aData) {
			for (var k = 0; k < aData.length; k++) {
				var myId = aData[k][0];
				var myValue = aData[k][1];
				var type = aData[k][2];
				var property = aData[k][3];

				this.iDoNotSeeValue(myId, myValue, type, property);
			}
			return this;
		},

		/**
		 * Checks if the given Text is not shown on the UI
		 * @public
		 * @param {string} [id] The Id of the control
		 * @param {string} [value] The expected value 
		 * @param {string} [type] The type of Element
		 * @param {string} [property] Value, Text, Title
		 * @returns {string} Success or Error Message
		 */
		iDoNotSeeValue: function(id, value, type, property) {
			var controlType;
			if (typeof type === "undefined") {
				controlType = "sap.ui.core.Control";
			} else {
				controlType = type;
			}

			this.waitFor({
				controlType: controlType,
				success: function(aElements) {
					var regExp = new RegExp("(--){1,}" + id + "(?=-|$){0,1}");
					var bFound = false;
					for (var i = 0; i < aElements.length; i++) {
						if (regExp.test(aElements[i].getId()) === true) {
							var val = "";
							if (property === "Text" && typeof(aElements[i].getSelectedItem) !== "undefined") {
								val = aElements[i].getSelectedItem().getText();
							} else if (property === "Value" && typeof(aElements[i].getValue) !== "undefined") {
								val = aElements[i].getValue();
							} else if (property === "Text" && typeof(aElements[i].getText) !== "undefined") {
								val = aElements[i].getText();
							} else if (property === "Title" && typeof(aElements[i].getTitle) !== "undefined") {
								val = aElements[i].getTitle();
							}
							if (String(val) === value) {
								bFound = true;
								break;
							}
						}
					}
					if (bFound) {
						ok(!bFound, "Control with id " + id + " found (" + val + " === " + value + ")");
					} else {
						ok(true, "Control with id " + id + " and value " + value + " not found");
					}
				},
				timeout: 30,
				pollingInterval: 50
			});
			return this;
		},

		iSeeObjectNumber: function(sNumber, sState) {
			this.waitFor({
				controlType: "sap.m.ObjectNumber",
				matchers: new Properties({
					number: sNumber,
					state: sState
				}),
				success: function(oObjectNumber) {
					ok(true, " ObjectNumber with Number " + sNumber + " and State " + sState + " found.");
				},
				errorMessage: "No ObjectNumber with Number " + sNumber + " and State " + sState + " found."
			});
		},

		iSeeValueStateTextDialog: function(sInputId, sMessage) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Input",
				matchers: new Properties({
					id: sInputId,
					valueStateText: sMessage
				}),
				success: function(aInput) {

					Opa5.assert.ok(true, "Error " + sMessage + " displayed ");
				},
				errorMessage: "Did not find input with id: " + sInputId
			});
		},

		/**
		 * Press Button that is placed on a view
		 * @public
		 * @param {string} [sButtonId] The Id of the button
		 * @param {string} [sView] The Name of the view 
		 * @returns {string} Success or Error Message
		 */
		iPressButton: function(sButtonId, sView) {
			return this.waitFor({
				id: sButtonId,
				viewName: sView,
				actions: new Press(),
				success: function(oButton) {
					Opa5.assert.ok(true, "button " + sButtonId + " pressed");
				},
				errorMessage: "Did not find button with id: " + sButtonId
			});
		},

		/**
		 * Check if Button is visible that is placed on a view
		 * @public
		 * @param {string} [sButtonId] The Id of the button
		 * @param {string} [sView] The Name of the view 
		 * @returns {string} Success or Error Message
		 */
		iSeeButton: function(sButtonId, sView) {
			return this.waitFor({
				id: sButtonId,
				viewName: sView,
				success: function(oButton) {
					Opa5.assert.ok(true, "button " + sButtonId + " found");
					Opa5.assert.strictEqual(true, oButton.getVisible(), "button " + sButtonId + " visible");
				},
				errorMessage: "Did not find button with id: " + sButtonId
			});
		},

		/**
		 * Press Button that is placed on a dialog
		 * @public
		 * @param {string} [sButtonId] The Id of the button
		 * @returns {string} Success or Error Message
		 */
		iPressDialogButton: function(sButtonId) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				matchers: new Properties({
					id: sButtonId
				}),
				actions: new Press(),
				success: function(oButton) {
					Opa5.assert.ok(true, "button " + sButtonId + " pressed");
				},
				errorMessage: "Did not find button with id: " + sButtonId
			});
		},

		/**
		 * Press Button that is placed on a dialog
		 * @public
		 * @param {string} [sButtonText] The text of the button
		 * @returns {string} Success or Error Message
		 */
		iPressDialogButtonByText: function(sButtonText) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				matchers: new Properties({
					text: sButtonText
				}),
				actions: new Press(),
				success: function(oButton) {
					Opa5.assert.ok(true, "button " + sButtonText + " pressed");
				},
				errorMessage: "Did not find button with text: " + sButtonText
			});
		},

		/**
		 * Press Button with an icon
		 * @public
		 * @param {string} [sIcon] The icon of the button
		 * @returns {string} Success or Error Message
		 */
		iPressButtonByIcon: function(sIcon) {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new Properties({
					icon: sIcon
				}),
				actions: new Press(),
				success: function(oButton) {
					Opa5.assert.ok(true, "button " + sIcon + " pressed");
				},
				errorMessage: "Did not find button with icon: " + sIcon
			});
		},

/**
		 * Press icon
		 * @public
		 * @param {string} [sIcon] The icon 
		 * @returns {string} Success or Error Message
		 */
		iPressIcon: function(sIcon) {
			return this.waitFor({
				controlType: "sap.ui.core.Icon",
				matchers: new Properties({
					src: sIcon
				}),
				actions: new Press(),
				success: function(oButton) {
					Opa5.assert.ok(true, "icon " + sIcon + " pressed");
				},
				errorMessage: "Did not find icon: " + sIcon
			});
		},



		/**
		 * Toggle checkbox that is placed on a dialog
		 * @public
		 * @param {string} [sCheckBoxId] The Id of the check box
		 * @returns {string} Success or Error Message
		 */
		iToggleCheckBoxDialog: function(sCheckBoxId) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.CheckBox",
				matchers: new Properties({
					id: sCheckBoxId
				}),
				success: function(aCheckBoxes) {
					var oFirstCheckBox = aCheckBoxes[0];
					var bNewCheckBoxValue = !oFirstCheckBox.getSelected();
					oFirstCheckBox.setSelected(bNewCheckBoxValue);
					oFirstCheckBox.fireSelect({
						selected: bNewCheckBoxValue
					});
					Opa5.assert.ok(true, "Checkbox " + sCheckBoxId + " set to " + !oFirstCheckBox.getSelected());
				},
				errorMessage: "Did not find checkbox with id: " + sCheckBoxId
			});
		},

		/**
		 * Enter Text in input field placed on a dialog
		 * @public
		 * @param {string} [sInputId] The Id of the input field
		 * @param {string} [sInput] The text that is entered into the field
		 * @returns {string} Success or Error Message
		 */
		iEnterDataInputDialog: function(sInputId, sInput) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Input",
				matchers: new Properties({
					id: sInputId
				}),
				actions: [new EnterText({
					text: sInput
				})],
				success: function(aInput) {
					Opa5.assert.ok(true, "Text " + sInput + " entered into " + sInputId);
				},
				errorMessage: "Did not find input with id: " + sInputId
			});
		},

		/**
		 * Select via Key
		 * @public
		 * @param {string} [sSelectId] The Id of the select field
		 * @param {string} [sViewName] The view of the select field
		 * @param {string} [sSelectedKey] The Id of the select field
		 * @returns {string} Success or Error Message
		 */
		iSelectData: function(sSelectId, sViewName, sSelectedKey) {
			return this.waitFor({
				id: sSelectId,
				viewName: sViewName,
				actions: new Press(),
				success: function(aSelect) {
					Opa5.assert.ok(true, sSelectedKey + " selected");
				},
				errorMessage: "Did not find select with id: " + sSelectId,
				timeout: 30,
				pollingInterval: 500
			});
		},

		/**
		 * Press Select Item via Key
		 * @public
		 * @param {string} [sSelectedKey] The Id of the select field
		 * @returns {string} Success or Error Message
		 */
		iPressSelectItem: function(sSelectedKey) {
			return this.waitFor({
				searchOpenDialogs: true,
				matchers: new Properties({
					key: sSelectedKey
				}),
				controlType: "sap.ui.core.Item",
				actions: new Press(),
				success: function(aSelect) {
					Opa5.assert.ok(true, sSelectedKey + " pressed");
				},
				errorMessage: "Did not find item with key: " + sSelectedKey,
				timeout: 30,
				pollingInterval: 500
			});
		},
	
		iShouldSeeTheControlWithId: function(sId, sViewName, sText) {
			return this.waitFor({
				id: sId,
				viewName: sViewName,
				success: function(oControl) {
					ok(oControl.getVisible(), sText + " was visible");
				}
			});
		}

	});
});