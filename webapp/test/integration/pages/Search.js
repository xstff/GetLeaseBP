/*eslint-disable valid-jsdoc */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/EnterText",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Common",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/actions/Press"
], function(Opa5, EnterText, Common, Properties, Press) {
	"use strict";

	var sSearchControlId = "searchField";
	var oRefToSerachField;

	Opa5.createPageObjects({
		onTheSearchPage: {
			baseClass: Common,
			actions: jQuery.extend({
				/**
				 * Write value to input field and fired change/submit event
				 */
				iEnterBPSearch: function(sSearchTerm) {
					//var oFoundSearchField = {};
					return this.waitFor({
						controlType: "sap.ui.comp.smartfield.SmartField",
						check: function(aSearchFields) {
							var bReturn = false;
							var regExp1 = new RegExp(sSearchControlId);
							var regExp2 = new RegExp("(--){1,}" + sSearchControlId + "(?=-|$){0,1}");
							jQuery.each(aSearchFields, function(iIndex, oSearchField) {
								if (regExp1.test(oSearchField.getId()) === true || regExp2.test(oSearchField.getId()) === true) {
									if (oSearchField.getInnerControls().length > 0) {
										//oFoundSearchField = oSearchField;
										bReturn = true;
									}
								}
							});
							return bReturn;
						},
						actions: new EnterText({
							text: sSearchTerm
						}),
						success: function(oSearchField) {
							// var e = $.Event("keypress");
							// e.keyCode = jQuery.sap.KeyCodes.ENTER;
							// var oInput = oFoundSearchField.getInnerControls()[0];
							// oFoundSearchField.setValue(sSearchTerm);
							// oInput.setValue(sSearchTerm);
							// oFoundSearchField.$().trigger(e);
							Opa5.assert.ok(true, "Search field is pressed");
						},
						errorMessage: "Did not find search field"
					});
				},
				/**
				 * Write value to input field and fired suggest event to test the suggestion
				 */
				iWriteInSearchFieldAndSuggest: function(sSearchTerm) {

					this.waitFor({
						controlType: "sap.ui.comp.smartfield.SmartField",
						check: function(aSearchFields) {
							var bReturn = false;
							var regExp1 = new RegExp(sSearchControlId);
							var regExp2 = new RegExp("(--){1,}" + sSearchControlId + "(?=-|$){0,1}");
							jQuery.each(aSearchFields, function(iIndex, oSearchField) {
								if (regExp1.test(oSearchField.getId()) === true || regExp2.test(oSearchField.getId()) === true) {
									if (oSearchField.getInnerControls().length > 0) {
										bReturn = true;
									}
								}
							});
							return bReturn;
						},
						success: function(aSearchField) {
							var oSearchField = aSearchField[0];
							oSearchField.setValue(sSearchTerm);
							oRefToSerachField = oSearchField.getInnerControls()[0]; // store reference to the search field to use it later 
							oRefToSerachField.onfocusin(); // for some reason this is not triggered when calling focus via API
							oRefToSerachField._$input.focus().val(sSearchTerm).trigger("input");
							Opa5.assert.ok("Suggestion with the text '" + sSearchTerm + "' fired");
						},
						errorMessage: "Did not find the search field",
						timeout: 30,
						pollInterval: 50
					});
					return this;
				},

				/**
				 * Select from the suggestion List Item containing the given text
				 */
				iSelectInSuggestionListItemContaining: function(sSearchTerm) {

					function selectFirstItemInTheListContainTheSearchTerm(oTable, sTerm) {

						var aItems = oTable.getItems();

						// table need items
						if (aItems.length === 0) {
							return undefined;
						}

						var oItemRoReturn;
						jQuery.each(aItems, function(iItemIndex) {
							if (aItems[iItemIndex].getCells) { // processing only for ColumnListItems 
								var aCells = aItems[iItemIndex].getCells();
								jQuery.each(aCells, function(iCellIndex) {
									if (aCells[iCellIndex].getText().indexOf(sTerm) !== -1) {
										oItemRoReturn = aItems[iItemIndex];
										return oItemRoReturn;
									}
								});
							}
						});

						return oItemRoReturn;
					}

					this.waitFor({
						controlType: "sap.m.Table",
						success: function(aTables) {
							Opa5.assert.ok(true, "The table containing suggestion is found");
							var oSelectedItem = selectFirstItemInTheListContainTheSearchTerm(aTables[0], sSearchTerm);
							Opa5.assert.ok(oSelectedItem, "Item not found in the suggestion list for the given search term");
							if (oSelectedItem) {
								oRefToSerachField.fireSuggestionItemSelected({
									selectedRow: oSelectedItem
								});
							}
						},
						errorMessage: "Did not find the suggestion list"
					});

					return this;
				}

			}),
			assertions: jQuery.extend({

				iShouldSeeTheSearchField: function() {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfield.SmartField",
						check: function(aSearchFields) {
							var bReturn = false;
							var regExp = new RegExp(sSearchControlId);
							jQuery.each(aSearchFields, function(iIndex, oSearchField) {
								if (regExp.test(oSearchField.getId()) === true) {
									bReturn = true;
								}
							});
							return bReturn;
						},
						success: function(oSearchField) {
							Opa5.assert.ok(true, "The Busness Partner search field is visible");
						},
						errorMessage: "Did not find the search field"
					});
				},
				iShouldSeeTheBPNumberInSearchField: function(sBPNumber) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfield.SmartField",
						matchers: new Properties({
							value: sBPNumber
						}),
						success: function(oSearchField) {
							Opa5.assert.ok(true, "The BP search field is visible");
							Opa5.assert.strictEqual(oSearchField[0].getValue(), sBPNumber, " The BP search field contains correct value (" + sBPNumber +
								")");
						},
						errorMessage: "Did not find the search field"
					});
				},
				iShouldSeeValueStateOfTheSearchField: function(sValueState) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfield.SmartField",
						matchers: new Properties({
							valueState: sValueState
						}),
						success: function(aSearchField) {
							var oSearchField = aSearchField[0];
							Opa5.assert.ok(true, "The account search field is visible");
							Opa5.assert.strictEqual(oSearchField.getValueState(), sValueState, " The account search field state is " + sValueState);
						},
						errorMessage: "Did not find the search field"
					});
				},
				iPressValueListEntry: function(sText) {
					return this.waitFor({
						controlType: "sap.m.Text",
						searchOpenDialogs: true,
						matchers: new Properties({
							text: sText
						}),
						actions: new Press(),
						success: function(aText) {
							Opa5.assert.ok(true, "Value List Entry pressed");
						},
						errorMessage: "Did not find the search field"
					});
				}
			})
		}
	});
});