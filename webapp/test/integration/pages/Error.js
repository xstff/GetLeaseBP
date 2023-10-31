/*eslint-disable valid-jsdoc */
sap.ui.require([
	"sap/ui/test/Opa5",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Common"
], function (Opa5, Common) {
	"use strict";

	Opa5.createPageObjects({
		onTheErrorPage: {
			baseClass: Common,

			actions: {

				iWaitUntilISeeErrorPage: function () {
					return this.waitFor({
						id: "errorPage",
						viewName: "ErrorPage",
						success: function (oPage) {
							Opa5.assert.strictEqual(oPage.getTitle(), oPage.getModel("i18n").getProperty("errroPageTitle"),
								"The title of the error page is show");
							Opa5.assert.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("errorPageText"),
								"The standard message text of the error page is shown");
						},
						errorMessage: "Did not display the error page"
					});
				}

			},

			assertions: {
				iShouldSeeErrorPage: function (sMessage) {
					return this.waitFor({
						autoWait: false,
						controlType: "sap.m.MessagePage",
						id: new RegExp("errorPage"),
						check: function (aPage) {
							var oPage = aPage[0];
							var sText = oPage.getText();
							var sPlaceholder = oPage.getModel("i18n").getProperty("errorPageTextPlaceholder");
							sPlaceholder = sPlaceholder.substring(0, sPlaceholder.length - 3);
							if (sMessage) {
								if (sText.indexOf(sMessage) > -1) {
									Opa5.assert.ok(true, "The message text '" + sMessage + "' of the error page is shown");
									return true;
								} else {
									return false;
								}
							} else if (sText.indexOf(sPlaceholder) > -1) {
								return true;
							} else {
								if (oPage.getText() === oPage.getModel("i18n").getProperty("errorPageText")) {
									Opa5.assert.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("errorPageText"),
										"The standard message text of the error page is shown");
									return true;
								} else {
									return false;
								}
							}
						},
						success: function (aPage) {
							var oPage = aPage[0];
							Opa5.assert.strictEqual(oPage.getTitle(), oPage.getModel("i18n").getProperty("errroPageTitle"),
								"The title of the error page is shown");
						},
						errorMessage: "Did not display the error page"
						//timeout: 30,
						//pollingInterval: 50
					});
				}
			}

		}

	});

});