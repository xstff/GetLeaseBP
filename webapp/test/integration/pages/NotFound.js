/*eslint-disable valid-jsdoc */
sap.ui.require([
	"sap/ui/test/Opa5",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Common",
	"sap/ui/test/matchers/Properties"
], function(Opa5, Common, Properties) {
	"use strict";

	Opa5.createPageObjects({
		onTheNotFoundPage: {
			baseClass: Common,

			actions: {

				iWaitUntilISeeObjectNotFoundPage: function() {
					return this.waitFor({
						id: "objectNotFoundPage",
						viewName: "ObjectNotFound",
						success: function(oPage) {
							Opa5.assert.strictEqual(oPage.getTitle(), oPage.getModel("i18n").getProperty("notFoundTitle"),
								"The title of the not found page is shown");
							Opa5.assert.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("noObjectFoundText"),
								"The text of the not found text is shown");
						},
						errorMessage: "Did not display the object not found page"
					});
				}

			},

			assertions: {
				iShouldSeeObjectNotFound: function() {
					var sText = this.getI18nText("ymsg.objectNotFound");
					return this.waitFor({
						controlType: "sap.m.MessagePage",
						matchers: new Properties({
							text: sText
						}),
						success: function(aPage) {
							var oPage = aPage[0];
							Opa5.assert.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("ymsg.objectNotFound"),
								"The text of the not found text is shown");
						},
						errorMessage: "Did not display the object not found page"
					});
				}

			}

		}

	});

});