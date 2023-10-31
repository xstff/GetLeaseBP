sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Search Customer");

	opaTest("I enter BP number into the search field and press Enter", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

		// Assertions
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheBPName("Anja Zeitler Gräfin da van");

		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I enter BP number into the search field for not existing BP and press Enter", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("ANJAZZ");

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZZ");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I enter any string into the search field and press Enter", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("BLABLA");

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("BLABLA");
		Then.iTeardownMyAppFrame();
	});

	opaTest("I search for BP via empty string and see initial Page", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("");

		// Assertions
		Then.onTheStartPage.iShouldSeeTheInitialPage();
	 
		Then.iTeardownMyAppFrame();
	});

	opaTest(
		"I enter first empty string stay on initial page and if I enter valid BP the error state is removed and object is displayed",
		function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();
			Then.onTheSearchPage.iShouldSeeTheSearchField();

			//Actions
			Then.onTheSearchPage.iEnterBPSearch("");

			// Assertions
			Then.onTheStartPage.iShouldSeeTheInitialPage();

			//Actions 2
			Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

			// Assertions 2
			Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheBPName("Anja Zeitler Gräfin da van");
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
			Then.onTheSearchPage.iShouldSeeValueStateOfTheSearchField("None");
			Then.iTeardownMyAppFrame();
		});

	opaTest(
		"I enter first empty string stay on initial page and if I enter not valid BP number the error state is removed and I see not found page",
		function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();
			Then.onTheSearchPage.iShouldSeeTheSearchField();

			//Actions
			Then.onTheSearchPage.iEnterBPSearch("");

			// Assertions
			Then.onTheStartPage.iShouldSeeTheInitialPage();

			//Actions
			Then.onTheSearchPage.iEnterBPSearch("BLABLA");

			// Assertions
			Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("BLABLA");
			Then.onTheSearchPage.iShouldSeeValueStateOfTheSearchField("None");

			Then.iTeardownMyAppFrame();
		});

	opaTest("I enter not valid BP number (12 characters) the error state is set", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("123456789012");
		// max length 10
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("123456789012");

		// Assertions
		
		Then.onTheSearchPage.iShouldSeeValueStateOfTheSearchField("Error");
		Then.onTheStartPage.iShouldSeeTheInitialPage();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("BLABLA");

		// Assertions
		Then.onTheNotFoundPage.iShouldSeeObjectNotFound();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("BLABLA");
		Then.onTheSearchPage.iShouldSeeValueStateOfTheSearchField("None");

		Then.iTeardownMyAppFrame();
	});

	opaTest("I search for BP via F4", function(Given, When, Then) {

		// Arrangements
		Given.iStartMyApp({
			delay: 0 // required to display suggestion list as soon as posisble
		});
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		//Actions
		Then.onTheSearchPage.iPressIcon("sap-icon://value-help");
		Then.onTheSearchPage.iPressDialogButtonByText("Go");
		Then.onTheSearchPage.iPressValueListEntry("12020");

		// Assertions
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheBPName("Schmidt-Meyer Meyer-Schmidt");
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("12020");

		//Actions
		Then.onTheSearchPage.iPressIcon("sap-icon://value-help");
		Then.onTheSearchPage.iPressDialogButtonByText("Go");
		Then.onTheSearchPage.iPressValueListEntry("ANJAZ");

		// Assertions
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheBPName("Anja Zeitler Gräfin da van");
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
		
		//Actions
		Then.onTheSearchPage.iPressIcon("sap-icon://value-help");
		Then.onTheSearchPage.iPressDialogButtonByText("Go");
		Then.onTheSearchPage.iPressValueListEntry("12020");

		// Assertions
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheBPName("Schmidt-Meyer Meyer-Schmidt");
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("12020");
		Then.iTeardownMyAppFrame();

	});

	// opaTest("I search for BP via suggestion for entered BP number", function(Given, When, Then) {

	// 	// Arrangements
	// 	Given.iStartMyApp({
	// 		delay: 0 // required to display suggestion list as soon as posisble
	// 	});
	// 	Then.onTheSearchPage.iShouldSeeTheSearchField();

	// 	//Actions
	// 	Then.onTheSearchPage.iWriteInSearchFieldAndSuggest("ANJAZ");
	// 	Then.onTheSearchPage.iSelectInSuggestionListItemContaining("ANJAZ");

	// 	// Assertions
	// 	Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheBPName("Anja Zeitler Gräfin da van");
	// 	Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
	// 	Then.iTeardownMyAppFrame();
	// });
});