jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Browser",
	"fs/cb/bankcustomer/displays1/test/integration/pages/BusinessPartnerOverview",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Search",
	"fs/cb/bankcustomer/displays1/test/integration/pages/NotFound",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Error",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Start",
	"fs/cb/bankcustomer/displays1/test/integration/pages/FLP",
	"fs/cb/bankcustomer/displays1/test/integration/pages/CrossAppTest",
	"fs/cb/bankcustomer/displays1/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		autoWait: true,
		arrangements: new Common(),
		viewNamespace: "fs.cb.bankcustomer.displays1.view."
	});

	sap.ui.require([
		"fs/cb/bankcustomer/displays1/test/integration/DisplayJourney",
		"fs/cb/bankcustomer/displays1/test/integration/InAppNavigationJourney",
		"fs/cb/bankcustomer/displays1/test/integration/CrossAppNavigationJourney",
		"fs/cb/bankcustomer/displays1/test/integration/ErrorJourney",
		"fs/cb/bankcustomer/displays1/test/integration/SearchJourney"
	], function () {
		QUnit.start();
	});
});