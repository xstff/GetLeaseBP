sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Cross App Navigation");

	opaTest("I navigate to app from FLP home", function(Given, When, Then) {

		// Arrangements
		Given.iStartFLP();

		//Actions
		Then.onTheFLPPage.iSeeAppTile("Get Bank Customer Overview");
		When.onTheFLPPage.iPressOnAppTile("Get Bank Customer Overview");

		// Assertions
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheEmptyHash();

		Then.iTeardownMyAppFrame();
	});

	opaTest("I navigate to app from FLP home, navigate back to FLP Home", function(Given, When, Then) {

		// Arrangements
		Given.iStartFLP();

		//Actions
		Then.onTheFLPPage.iSeeAppTile("Get Bank Customer Overview");
		When.onTheFLPPage.iPressOnAppTile("Get Bank Customer Overview");
		Then.onTheStartPage.iShouldSeeTheInitialPage();

		// Action 2
		When.onTheBrowser.iPressOnTheBackwardsButton();
		Then.onTheFLPPage.iLookAtTheScreen();

		Then.iTeardownMyAppFrame();
	});

	opaTest("I navigate to app from FLP home, navigate back to FLP Home by press on the page back button", function(Given, When, Then) {

		// Arrangements
		Given.iStartFLP();

		//Actions
		Then.onTheFLPPage.iSeeAppTile("Get Bank Customer Overview");
		When.onTheFLPPage.iPressOnAppTile("Get Bank Customer Overview");
		Then.onTheStartPage.iShouldSeeTheInitialPage();

		// Action 2
		When.onTheBrowser.iPressOnTheBackwardsButton();
		Then.onTheFLPPage.iLookAtTheScreen();

		Then.iTeardownMyAppFrame();
	});

	opaTest("I start app using the valid BP UUID as cross-app parameter", function(Given, When, Then) {

		// Arrangements
		Given.iStartMyAppWithURLParameters("CustomerUUID=8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");
		//Actions

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains business partner number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");

		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I start app using not valid BP UUID as cross-app parameter and I see search page", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppWithURLParameters("CustomerUUID=88888888-A21C-1ED5-A7D1-8B305EA24F55");

		//Actions

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I start app using the valid BP UUID and not valid sap-xapp-state as cross-app parameter and see bp details", function(Given,
		When, Then) {

		// Arrangements
		Given.iStartMyAppWithURLParameters(
			"CustomerUUID=8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55&sap-xapp-state=111111ODMIAM328K7BM0FIV15RPF2Q5DA30IQME");

		//Actions

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I start app using non valid BP UUID and not valid sap-xapp-state as cross-app parameter and I see search page", function(Given,
		When, Then) {

		// Arrangements
		Given.iStartMyAppWithURLParameters(
			"CustomerUUID=88888888-A21C-1ED5-A7D1-8B305EA24F55&sap-xapp-state=111111ODMIAM328K7BM0FIV15RPF2Q5DA30IQME");

		//Actions

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I navigate to app using cross-app navigation without parameters and test back navigation", function(Given, When, Then) {

		// Arrangements
		Given.iStartCrossAppTestApp();

		//Actions 1
		When.onTheCrossAppTestPage.iPressLink("link1");

		// Assertions
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheEmptyHash();

		// Action 2 - navigate back using page nav back button
		When.onTheBrowser.iPressOnTheBackwardsButton();
		Then.onTheCrossAppTestPage.iLookAtTheScreen();

		//Actions 3 - navigate again to the app
		When.onTheCrossAppTestPage.iPressLink("link1");

		// Assertions
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheEmptyHash();

		// Action 4 - navigate back using brwser back button
		When.onTheBrowser.iPressOnTheBackwardsButton();
		Then.onTheCrossAppTestPage.iLookAtTheScreen();

		//Actions 3 - navigate again to the app
		When.onTheCrossAppTestPage.iPressLink("link1");

		// Assertions
		Then.onTheStartPage.iShouldSeeTheInitialPage();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheEmptyHash();

		Then.iTeardownMyAppFrame();
	});

	opaTest("I navigate to app using cross-app navigation with BP UUID as cross app parameter and test back navigation", function(Given,
		When, Then) {

		// Arrangements
		Given.iStartCrossAppTestApp();

		//Actions 1
		When.onTheCrossAppTestPage.iPressLink("link2");

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");

		// Action 2 - navigate back using page nav back button
		When.onTheBrowser.iPressOnTheBackwardsButton();
		Then.onTheCrossAppTestPage.iLookAtTheScreen();

		//Actions 3 - navigate again to the app
		When.onTheCrossAppTestPage.iPressLink("link2");

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");

		// Action 4 - navigate back using brwser back button
		When.onTheBrowser.iPressOnTheBackwardsButton();
		Then.onTheCrossAppTestPage.iLookAtTheScreen();

		//Actions 3 - navigate again to the app
		When.onTheCrossAppTestPage.iPressLink("link2");

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");

		Then.iTeardownMyAppFrame();
	});

	opaTest("I navigate to app using cross-app navigation with non valid BP UUID and should see not found page and I test back navigation",
		function(Given, When, Then) {

			// Arrangements
			Given.iStartCrossAppTestApp();

			//Actions 1
			When.onTheCrossAppTestPage.iPressLink("link4");

			// Assertions
			Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");

			// Action 2 - navigate back using page nav back button
			When.onTheBrowser.iPressOnTheBackwardsButton();
			Then.onTheCrossAppTestPage.iLookAtTheScreen();

			//Actions 3 - navigate again to the app
			When.onTheCrossAppTestPage.iPressLink("link4");

			// Assertions
			Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");

			// Action 4 - navigate back using brwser back button
			When.onTheBrowser.iPressOnTheBackwardsButton();
			Then.onTheCrossAppTestPage.iLookAtTheScreen();

			//Actions 3 - navigate again to the app
			When.onTheCrossAppTestPage.iPressLink("link4");

			// Assertions
			Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");

			Then.iTeardownMyAppFrame();
		});

	opaTest("I navigate to app using cross-app navigation with non valid paramters and should see not found page and I test back navigation",
		function(Given, When, Then) {

			// Arrangements
			Given.iStartCrossAppTestApp();

			//Actions 1
			When.onTheCrossAppTestPage.iPressLink("link7");

			// Assertions
			Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");

			// Action 2 - navigate back using page nav back button
			When.onTheBrowser.iPressOnTheBackwardsButton();
			Then.onTheCrossAppTestPage.iLookAtTheScreen();

			//Actions 3 - navigate again to the app
			When.onTheCrossAppTestPage.iPressLink("link7");

			// Assertions
			Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");

			// Action 4 - navigate back using brwser back button
			When.onTheBrowser.iPressOnTheBackwardsButton();
			Then.onTheCrossAppTestPage.iLookAtTheScreen();

			//Actions 3 - navigate again to the app
			When.onTheCrossAppTestPage.iPressLink("link7");

			// Assertions
			Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("");

			Then.iTeardownMyAppFrame();
		});

	opaTest("I start app using the valid BP UUID as cross-app parameter, navigate to ManageTimeDeposit and navigate back", function(Given,
		When, Then) {

		// Arrangements
		Given.iStartMyAppWithURLParameters("CustomerUUID=8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");
		//Actions

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains business partner number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");

		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");
		Then.onTheBusinessPartnerOverviewPage.iNavigateToAccount("0010006388");
		Then.onTheCrossAppTestPage.iLookAtTheScreen();

		//Actions
		// I navigate again to the app with the Business Partner ID
		When.onTheCrossAppTestPage.iPressLink("link2");

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");

		//navigate to account and back
		Then.onTheBusinessPartnerOverviewPage.iNavigateToAccount("0010006388");
		Then.onTheCrossAppTestPage.iLookAtTheScreen();

		// Actions
		// I navigate back using browser back button
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");

		Then.iTeardownMyAppFrame();
	});

	opaTest("I start app using the valid BP UUID as cross-app parameter, navigate to ManageSavingsAccount and navigate back", function(Given,
		When, Then) {

		// Arrangements
		Given.iStartMyAppWithURLParameters("CustomerUUID=8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");
		//Actions

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains business partner number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");

		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");
		Then.onTheBusinessPartnerOverviewPage.iNavigateToAccount("0010013638");
		Then.onTheCrossAppTestPage.iLookAtTheScreen();

		//Actions
		// I navigate again to the app with the Business Partner ID
		When.onTheCrossAppTestPage.iPressLink("link2");

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");

		//navigate to account and back
		Then.onTheBusinessPartnerOverviewPage.iNavigateToAccount("0010013638");
		Then.onTheCrossAppTestPage.iLookAtTheScreen();

		// Actions
		// I navigate back using browser back button
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions
		// I should see data
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmail("anjaz_addrindep@hollywood.com");
		// Search field contains account number
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		// I should see correct URL
		Then.onTheBrowser.iSeeTheHashContainingHashPart("8CDCD4B1-A21C-1ED5-A7D1-8B305EA24F55");

		Then.iTeardownMyAppFrame();
	});


});