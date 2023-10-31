sap.ui.define([
	"sap/ui/test/opaQunit",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Common"
], function(opaTest, Common) {
	"use strict";

	QUnit.module("In App Navigation");

	opaTest("I start my app and see initial page", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		//Actions

		// Assertions
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		// Search field is empty
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");
		// // I should see correct URL
		Then.onTheBrowser.iSeeTheEmptyHash();
		Then.iTeardownMyAppFrame();
	});

	opaTest("I start my app and search for business partner", function(Given, When, Then) {

		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

		// Assertions
		// Search field contains bp number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["email", "anjaz_addrindep@hollywood.com", "sap.m.Link", "Text"],
			["phone", "+49 (6133) 33331", "sap.m.Link", "Text"],
			["sinceDate", "Jan 1, 2000", "sap.m.Text", "Text"],
			["rating", "Very Good", "sap.m.ObjectStatus", "Text"],
			["advsrptyName", "Sebastian Winter", "sap.m.Link", "Text"]
		]);
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55", "");
		Then.iTeardownMyAppFrame();

	});

	opaTest("I start my app, search for BusinessPartner and navigate back", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["email", "anjaz_addrindep@hollywood.com", "sap.m.Link", "Text"],
			["phone", "+49 (6133) 33331", "sap.m.Link", "Text"],
			["sinceDate", "Jan 1, 2000", "sap.m.Text", "Text"],
			["rating", "Very Good", "sap.m.ObjectStatus", "Text"],
			["advsrptyName", "Sebastian Winter", "sap.m.Link", "Text"]
		]);

		//Actions
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions
		// Search field is empty
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheEmptyHash();
		Then.iTeardownMyAppFrame();

	});

	opaTest("I start my app and swith between BusinessPartnern", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		// 1st BusinessPartner
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["email", "anjaz_addrindep@hollywood.com", "sap.m.Link", "Text"],
			["phone", "+49 (6133) 33331", "sap.m.Link", "Text"],
			["sinceDate", "Jan 1, 2000", "sap.m.Text", "Text"],
			["rating", "Very Good", "sap.m.ObjectStatus", "Text"],
			["advsrptyName", "Sebastian Winter", "sap.m.Link", "Text"]
		]);

		//Actions
		// 2nd BusinessPartner
		Then.onTheSearchPage.iEnterBPSearch("ATOS");

		// Assertions
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ATOS");
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("info@atos.de");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("0050568F-0843-1ED1-9D9E-CAC1D3F3C68D", "");
		Then.iTeardownMyAppFrame();

	});

	opaTest("I start my app and swith between business partners and back", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		// 1st account
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// 2nd account
		Then.onTheSearchPage.iEnterBPSearch("ATOS");
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("info@atos.de");
		//Actions
		// 1st time back
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55", "");

		//Actions
		// 2nd time back
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions

		// I should see empty hashL
		Then.onTheBrowser.iSeeTheEmptyHash();
		Then.iTeardownMyAppFrame();

	});

	opaTest("I start my app and swith between business partners using back and forward", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		// 1st account
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// 2nd account
		Then.onTheSearchPage.iEnterBPSearch("ATOS");
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("info@atos.de");

		//Actions
		// 1st time back
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55", "");

		//Actions
		// Now forward
		When.onTheBrowser.iPressOnTheForwardsButton();

		// Assertions
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("info@atos.de");
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ATOS");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("0050568F-0843-1ED1-9D9E-CAC1D3F3C68D", "");
		Then.iTeardownMyAppFrame();

	});

	opaTest("I start my app and navigate back to FLP", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheStartPage.iShouldSeeTheInitialPage();

		//Actions
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions
		Then.onTheBrowser.iSeeShellHash();
		Then.iTeardownMyAppFrame();
	});

	opaTest("I start app using the valid internal id as inner-app parameter", function(Given, When, Then) {
		// Arrangements
		var oOptions = {
			hash: "Customer(sap-iapp-state=DUMMY,%20UUID=8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55)"
		};
		Given.iStartMyApp(oOptions);

		//Actions

		// Assertions
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Then.onTheTimeDepositPage.iShouldSeeTheAccountNumber("0010002379");
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// Then.onTheSearchPage.iShouldSeeTheAccountNumberInSearchField("0010002379");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");
		Then.iTeardownMyAppFrame();

	});

	opaTest("I start app using not valid internal id as inner-app parameter", function(Given, When, Then) {
		// Arrangements
		var oOptions = {
			hash: "Customer(sap-iapp-state=DUMMY,%20UUID=88888888-A21C-1ED5-A7D1-8B305EA24F55)"
		};
		Given.iStartMyApp(oOptions);

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");
		Then.onTheBrowser.iSeeTheHashContainingHashPart("88888888-A21C-1ED5-A7D1-8B305EA24F55");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I start app, navigate to the Business Partner and refresh", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// Wait for Object Page Check Values of Object Page
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");

		//Actions
		When.onTheBrowser.iRestartTheAppWithTheSameHash();

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55", "");
		Then.iTeardownMyAppFrame();
	});

});