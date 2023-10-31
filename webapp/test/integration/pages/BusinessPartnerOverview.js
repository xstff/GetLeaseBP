/*eslint-disable valid-jsdoc */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Common",
	"sap/ui/core/Fragment",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/actions/Press"
], function(Opa5, PropertyStrictEquals, Common, Fragment, Properties, EnterText, Press) {
	"use strict";

	var sViewName = "Object";

	Opa5.createPageObjects({
		onTheBusinessPartnerOverviewPage: {
			baseClass: Common,

			actions: jQuery.extend({

				iPressEdit: function() {
					var sId = Fragment.createId("fragmentObjectHeaderTitle", "buttonEdit");
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						success: function(oButton) {
							oButton.$().trigger("tap");
							Opa5.assert.ok(true, "Swiched to edit mode");
						},
						errorMessage: "Did not find edit button"
					});
				},

				iPressAccountHolderQuickView: function() {
					return this.waitFor({
						controlType: "sap.m.Link",
						id: new RegExp("advsrptyName"),
						actions: new Press(),
						success: function(oLink) {
							Opa5.assert.ok(true, "click on account holder name");
						},
						errorMessage: "Did not find the quicklink for Account Holder"
					});
				},

				iPressContractManagerQuickView: function() {
					return this.waitFor({
						controlType: "sap.m.Link",
						id: new RegExp("contractManagerLink"),
						actions: new Press(),
						success: function(oLink) {
							Opa5.assert.ok(true, "click on contract manager name");
						},
						errorMessage: "Did not find the quicklink for Contract Manager"
					});
				},

				iPressDifferentConditionsLink: function() {
					return this.waitFor({
						id: "differentConditionsLink",
						viewName: "CurrentAgreementEdit",
						success: function(oLink) {
							oLink.firePress();
							Opa5.assert.ok(true, "click on different conditions link");
						},
						errorMessage: "Did not find different conditions link"
					});
				},

				iPressAnchor: function(sI18nKey) {
					var sAnchorText = this.getI18nText(sI18nKey);
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new Properties({
							text: sAnchorText
						}),
						success: function(oButton) {
							oButton[0].$().trigger("tap");
							Opa5.assert.ok(true, "click on anchor " + sAnchorText);
						},
						errorMessage: "Did not find the anchor"
					});
				},

				iDeleteRefAccount: function(Item) {
					return this.waitFor({
						id: "tableRefAccounts",
						viewName: "RefAccounts",
						success: function(oTable) {
							var oItem = oTable.getItems()[Item];
							oTable.fireDelete({
								listItem: oItem
							});
							Opa5.assert.ok(true, "press delete on ref account " + Item);
						},
						errorMessage: "Did not find the ref accounts table"
					});
				},

				iEditRefAccount: function(Item) {
					return this.waitFor({
						id: "tableRefAccounts",
						viewName: "RefAccounts",
						success: function(oTable) {
							oTable.getItems()[Item].fireDetailPress();
							Opa5.assert.ok(true, "press edit on ref account " + Item);
						},
						errorMessage: "Did not find the ref accounts table"
					});
				},

				iToggleOnRefAccountList: function(Item, bCapital, bInterest) {
					return this.waitFor({
						id: "tableRefAccounts",
						viewName: "RefAccounts",
						success: function(oTable) {
							var oItem = oTable.getItems()[Item];
							var oCheckBox;
							if (bCapital) {
								oCheckBox = oItem.getCells()[4];
								oCheckBox.setSelected(!oCheckBox.getSelected());
								Opa5.assert.ok(true, "Capital check box set to " + oCheckBox.getSelected());
							}
							if (bInterest) {
								oCheckBox = oItem.getCells()[5];
								oCheckBox.setSelected(!oCheckBox.getSelected());
								Opa5.assert.ok(true, "Interest check box set to " + oCheckBox.getSelected());
							}
						},
						errorMessage: "Did not find the capital checkbox"
					});
				},

				iEnterBankSearch: function(sSearchTerm) {
					return this.waitFor({
						id: "BankSmartField",
						fragment: "RefAccountDialog",
						actions: [new EnterText({
							text: sSearchTerm
						})],
						success: function(oSearchField) {
							oSearchField.setValue(sSearchTerm);
							var e = $.Event("keypress");
							e.keyCode = jQuery.sap.KeyCodes.ENTER;
							oSearchField.$().trigger(e);
							var oRefToSerachField = oSearchField.getInnerControls()[0]; // store reference to the search field to use it later 
							oRefToSerachField.onfocusin(); // for some reason this is not triggered when calling focus via API
							oRefToSerachField._$input.focus();
							oRefToSerachField._$input.focus().val(sSearchTerm).trigger("input");
							oRefToSerachField._$input.focus();
							oSearchField.setValue(sSearchTerm);
							oRefToSerachField._$input.focus().val(sSearchTerm).trigger("change");
							oRefToSerachField._$input.focus().val(sSearchTerm).trigger("enter");
							Opa5.assert.ok("Suggestion with the text '" + sSearchTerm + "' fired");
						},
						errorMessage: "Did not find the search field",
						timeout: 30,
						pollInterval: 50
					});
				},

				iShouldSeeTheNameOfBankRoutingID: function(sBankText) {
					var sObjectText = " ";
					return this.waitFor({
						id: "BankDescriptionText",
						fragment: "RefAccountDialog",
						check: function(object) {
							sObjectText = object.getText();
							if (sObjectText === sBankText) {
								return true;
							} else {
								return false;
							}
						},
						success: function(oTextField) {
							Opa5.assert.ok(true, "The BankName is visible");
							Opa5.assert.strictEqual(oTextField.getText(), sBankText, " The Text of BankRoutingId contains correct value");
						},
						errorMessage: "Did not find the bank name",
						timeout: 30,
						pollInterval: 50
					});
				},

				iShouldSeeTheBankRoutingId: function(bBankRoutingIDVisible) {
					return this.waitFor({
						id: "BankSmartField",
						fragment: "RefAccountDialog",
						success: function(sBankRoutingID) {
							Opa5.assert.ok(true, "The BankName is visible");
							Opa5.assert.strictEqual(sBankRoutingID.getEnabled(), bBankRoutingIDVisible, " BankRoutingId is enabled");
						},
						errorMessage: "BankRoutingID is not enabled",
						timeout: 30,
						pollInterval: 50
					});
				}

			}),

			assertions: jQuery.extend({

				iShouldSeeTheBPName: function(sBPName) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeader",
						matchers: new Properties({
							objectTitle: sBPName
						}),
						success: function(object) {
							Opa5.assert.ok(true, "BP Name " + object[0].getObjectTitle() + " found");
						},
						errorMessage: "BP Name " + sBPName + " not found"
					});
				},

				iShouldSeeTheEmail: function(sEmail) {
					return this.waitFor({
						controlType: "sap.m.Link",
						matchers: new Properties({
							text: sEmail
						}),
						success: function(aLink) {
							Opa5.assert.ok(true, "Email " + sEmail + " is shown");
						},
						errorMessage: "No link with email found"
					});
				},
				
				iShouldSeeTheNoDataText: function() {
					return this.waitFor({
						controlType: "sap.m.Text",
						matchers: new Properties({
							text: this.getI18nText("ymsg.quickviewNoData")
						}),
						success: function(aLink) {
							Opa5.assert.ok(true, "Text 'no data' is shown");
						},
						errorMessage: "No No Data Text found"
					});
				},

				iShouldSeeTheEmailDialog: function(sEmail) {
					return this.waitFor({
						controlType: "sap.m.Link",
						searchOpenDialogs: true,
						matchers: new Properties({
							text: sEmail
						}),
						success: function(aLink) {
							Opa5.assert.ok(true, "Email " + sEmail + " is shown");
						},
						errorMessage: "No link with email found"
					});
				},

				iShouldSeeThePopover: function() {
					return this.waitFor({
						controlType: "sap.m.Popover",
						searchOpenDialogs: true,
						success: function(aResponsivePopover) {
							Opa5.assert.ok(true, "Popover is shown");
						},
						errorMessage: "No Popover found"
					});
				},

				iShouldSeeTheIcon: function(sIcon) {
					return this.waitFor({
						controlType: "sap.ui.core.Icon",
						matchers: new Properties({
							src: sIcon
						}),
						success: function(object) {
							Opa5.assert.ok(true, "Icon " + object[0].getSrc() + " found");
						},
						errorMessage: sIcon + " not found"
					});
				},

				iShouldSeeThebutton: function(sButton) {
					return this.waitFor({
						id: new RegExp(sButton),
						success: function(aButtons) {
							Opa5.assert.ok(true, "Found the button: " + aButtons[0]);
						},
						errorMessage: "Did not find the button with corresponding id"
					});
				},

				iShouldSeeTheEnabledButton: function(sButton) {
					return this.waitFor({
						id: new RegExp(sButton),
						matchers: new Properties({
							enabled: true
						}),
						success: function(aButtons) {
							Opa5.assert.ok(true, "Found the enabled button: " + aButtons[0]);
						},
						errorMessage: "Did not find the enabled button with corresponding id"
					});
				},
				
				iShouldSeeTheDisabledButton: function(sButton) {
					return this.waitFor({
						id: new RegExp(sButton),
						matchers: new Properties({
							enabled: false
						}),
						success: function(aButtons) {
							Opa5.assert.ok(true, "Found the disabled button: " + aButtons[0]);
						},
						errorMessage: "Did not find the disabled button with corresponding id"
					});
				},

				iShouldNotSeeThebutton: function(sButton) {
					return this.waitFor({
						id: new RegExp(sButton),
						matchers: new sap.ui.test.matchers.Properties({
							visible: false
						}),
						visible: false,
						success: function(aButtons) {
							Opa5.assert.ok(true, "Did not find the button: " + aButtons[0]);
						},
						errorMessage: "Found the button with corresponding id " + sButton
					});
				},
				iShouldSeeTheLink: function(sLink) {
					return this.waitFor({
						id: new RegExp(sLink),
						visible: true,
						success: function() {
							Opa5.assert.ok(true, "found the link: " + sLink);
						},
						errorMessage: "Dis not find the link with corresponding id"
					});
				},
				iShouldNotSeeTheLink: function(sLink) {
					return this.waitFor({
						id: new RegExp(sLink),
						visible: false,
						success: function() {
							Opa5.assert.ok(true, "Did not find the link: " + sLink);
						},
						errorMessage: "Found the link with corresponding id"
					});
				},
				iShouldNotSeeTheSection: function(sSection) {
					return this.waitFor({
						id: new RegExp(sSection),
						visible: false,
						success: function(aSections) {
							Opa5.assert.ok(true, "Did not find the section: " + aSections[0]);
						},
						errorMessage: "Found the section with corresponding id"
					});
				},

				iShouldSeeTheElementWithId: function(sId, sType) {
					return this.waitFor({
						controlType: sType,
						visible: false,
						matchers: new Properties({
							id: sId
						}),
						success: function() {
							Opa5.assert.ok(true, "Element with id " + sId + " is shown");
						},
						errorMessage: "No Element with id " + sId + " found"
					});
				},

				/**
				 * Check that message popover is not visible
				 * Perform another check before because the popover 
				 * does not come up immediately 
				 * @public
				 * @returns {string} Success or Error Message
				 */
				iShouldNotSeeTheMessagePopover: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: "MainPage",
						matchers: new sap.ui.test.matchers.Properties({
							visible: false,
							icon: "sap-icon://message-popup"
						}),
						visible: false,
						success: function(aButtons) {
							Opa5.assert.ok(true, "Did not find the Message Popover");
						},
						errorMessage: "Found the Message Popover"
					});
				},

				iShouldSeeTheMessagePopover: function(iMessageCount) {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: "MainPage",
						matchers: new Properties({
							icon: "sap-icon://message-popup",
							text: String(iMessageCount)
						}),
						success: function(aButtons) {
							var iMessages = aButtons[0].getText();
							Opa5.assert.ok(parseInt(iMessages, 10) === iMessageCount, "Message Popover with " + iMessages + " messages is shown");
						},
						errorMessage: "Message Popover not found"
					});
				},

				iShouldSeeTheMessageBox: function(sText) {
					return this.waitFor({
						controlType: "sap.m.Text",
						searchOpenDialogs: true,
						matchers: new Properties({
							text: sText
						}),
						success: function(oText) {
							Opa5.assert.ok(true, "Message Box with text '" + oText[0].getText() + "' shown");
						},
						errorMessage: "Message Box with text '" + sText + " not found"
					});
				},

				iSeeDisabledCheckboxesOnRefAccountList: function() {
					return this.waitFor({
						id: "tableRefAccounts",
						viewName: "RefAccounts",
						success: function(oTable) {
							var bEnabled = false;
							jQuery.each(oTable.getItems(), function(iIndex, oItem) {
								var oCheckBox = oItem.getCells()[4];
								if (oCheckBox.getEnabled()) {
									bEnabled = true;
								}

							});
							if (bEnabled) {
								Opa5.assert.ok(false, "checkboxes on ref account are enabled");
							} else {
								Opa5.assert.ok(true, "checkboxes on ref account are disabled");
							}
						},
						errorMessage: "Did not find the table ref accounts"
					});
				},

				iSeeEnabledCheckboxesOnRefAccountList: function() {
					return this.waitFor({
						id: "tableRefAccounts",
						viewName: "RefAccounts",
						success: function(oTable) {
							var bEnabled = false;
							jQuery.each(oTable.getItems(), function(iIndex, oItem) {
								var oCheckBox = oItem.getCells()[4];
								if (oCheckBox.getEnabled()) {
									bEnabled = true;
								}
							});
							if (bEnabled) {
								Opa5.assert.ok(true, "checkboxes on ref account are enabled");
							} else {
								Opa5.assert.ok(false, "checkboxes on ref account are disabled");
							}
						},
						errorMessage: "Did not find the table ref accounts"
					});
				},

				iSeeDeleteRefAccountButton: function() {
					return this.waitFor({
						id: "tableRefAccounts",
						viewName: "RefAccounts",
						success: function(oTable) {
							var sMode = "Delete";
							var sModeCheck = oTable.getProperty("mode");
							if (sModeCheck === sMode) {
								Opa5.assert.ok(true, "delete button ref account is enabled");
							} else {
								Opa5.assert.ok(false, "delete button ref account is disabled");
							}
						},
						errorMessage: "Did not find the table ref accounts"
					});
				},

				iSeeChangeRefAccountButton: function() {
					return this.waitFor({
						id: "tableRefAccounts",
						viewName: "RefAccounts",
						success: function(oTable) {
							var sType = "Detail";
							jQuery.each(oTable.getItems(), function(iIndex, oItem) {
								var sTypeCheck = oItem.getType();
								if (sTypeCheck === sType) {
									Opa5.assert.ok(true, "change button ref account is enabled for item: " + iIndex);
								} else {
									Opa5.assert.ok(false, "change button ref account is disabled for item: " + iIndex);
								}
							});
						},
						errorMessage: "Did not find the table ref accounts"
					});
				},
				
				iNavigateToAccount: function (sTitle) {
					return this.waitFor({
						controlType: "sap.m.ObjectIdentifier",
					//	viewName: "Accounts",
						matchers: new Properties({
							title: new RegExp(sTitle)
						}),
						success: function(aObjectIdentifier) {
							aObjectIdentifier[0].getParent().firePress();
							Opa5.assert.ok(true, "Account " + sTitle + " found and pressed");
						},
						errorMessage: "Did not find account"
					});
				},
				
				iSeeNavigationOnAccountItem: function(itemNumber, bNavigation){
					return this.waitFor({
						id: "accountTable",
						viewName: "Accounts",
						check: function(oTable) {
							var oItem = oTable.getItems()[itemNumber];
							if ((oItem && oItem.getProperty("type") === "Navigation" && bNavigation) ||
							    (oItem && oItem.getProperty("type") !== "Navigation" && !bNavigation)){
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Item found");
						},
						errorMessage: "Did not find account"
					});
				}
			})
		}
	});
});