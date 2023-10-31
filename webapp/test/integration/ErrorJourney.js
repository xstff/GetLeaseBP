sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Errors");

	opaTest("Start the App and simulate metadata error for all services: 2 MessageBox's should be shown", function(Given, When, Then) {
		//Arrangement
		Given.iStartMyAppOnADesktopToTestErrorHandler("metadataError=true"); // both services

		//Assertions
		Then.onTheAppPage.iShouldSeeTheMessageBox("mainServiceMetadataErrorMessageBox");
		Then.onTheAppPage.iShouldSeeTheMessageBox("searchServiceMetadataErrorMessageBox");

		Then.onTheAppPage.iShouldSeeTheBusyIndicatorForTheWholeApp().
		and.iTeardownMyAppFrame();

	});

	opaTest("Start the App and simulate metadata error for main service: MessageBox should be shown", function(Given, When, Then) {
		//Arrangement
		Given.iStartMyAppOnADesktopToTestErrorHandler("mainService_metadataError=true"); // only time deposit service

		//Assertions
		Then.onTheAppPage.iShouldSeeTheMessageBox("mainServiceMetadataErrorMessageBox");
		Then.onTheAppPage.iShouldSeeTheBusyIndicatorForTheWholeApp().
		and.iTeardownMyAppFrame();

	});

	opaTest("Start the App and simulate metadata error for search service: MessageBox should be shown", function(Given, When, Then) {
		//Arrangement
		Given.iStartMyAppOnADesktopToTestErrorHandler("searchService_metadataError=true"); // only search service

		//Assertions
		Then.onTheAppPage.iShouldSeeTheMessageBox("searchServiceMetadataErrorMessageBox");

		Then.onTheAppPage.iShouldSeeTheBusyIndicatorForTheWholeApp().
		and.iTeardownMyAppFrame();

	});

	opaTest("Start the App and simulate server error for main service: Error Message Page should be shown", function(Given, When, Then) {
		//Arrangement
		Given.iStartMyAppOnADesktopToTestErrorHandler("mainService_errorType=serverError");

		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheStartPage.iShouldSeeTheInitialPage();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

		//Assertions

		Then.onTheErrorPage.iShouldSeeErrorPage();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ").
		and.iTeardownMyAppFrame();

	});

	opaTest("Start the App and simulate bad request error for main service: Error Message Page should be shown",
		function(Given, When, Then) {
			//Arrangement
			Given.iStartMyAppOnADesktopToTestErrorHandler("mainService_errorType=badRequest");

			Then.onTheSearchPage.iShouldSeeTheSearchField();
			Then.onTheStartPage.iShouldSeeTheInitialPage();

			//Actions
			Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

			//Assertions
			Then.onTheErrorPage.iShouldSeeErrorPage();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ").
			and.iTeardownMyAppFrame();

		});

	opaTest("Start the App and simulate server error for main service and entity set BkCustomer: Error Message Page should be shown",
		function(Given, When, Then) {
			//Arrangement
			Given.iStartMyAppOnADesktopToTestErrorHandler("mainService_errorType=serverError&entitySet=BkCustomer");

			Then.onTheSearchPage.iShouldSeeTheSearchField();
			Then.onTheStartPage.iShouldSeeTheInitialPage();

			//Actions
			Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

			//Assertions
			Then.onTheErrorPage.iShouldSeeErrorPage();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ").
			and.iTeardownMyAppFrame();

		});

	opaTest(
		"Start the App and simulate server error for for main service and entity set BkAcctContrs: Error Message Page should be shown",
		function(Given, When, Then) {
			//Arrangement
			Given.iStartMyAppOnADesktopToTestErrorHandler("mainService_errorType=serverError&entitySet=BkAcctContrs");

			Then.onTheSearchPage.iShouldSeeTheSearchField();
			Then.onTheStartPage.iShouldSeeTheInitialPage();

			//Actions
			Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

			//Assertions
			Then.onTheErrorPage.iShouldSeeErrorPage();
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ").
			and.iTeardownMyAppFrame();

		});

	opaTest("Start the App and simulate server error for search service: Error Message Page should be shown", function(Given, When, Then) {
		//Arrangement
		Given.iStartMyAppOnADesktopToTestErrorHandler("searchService_errorType=serverError");

		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheStartPage.iShouldSeeTheInitialPage();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

		//Assertions

		Then.onTheErrorPage.iShouldSeeErrorPage();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ").
		and.iTeardownMyAppFrame();

	});

	opaTest("Start the App and simulate bad Request for search service: Error Message Page should be shown", function(Given, When, Then) {
		//Arrangement
		Given.iStartMyAppOnADesktopToTestErrorHandler("searchService_errorType=badRequest");

		Then.onTheSearchPage.iShouldSeeTheSearchField();
		Then.onTheStartPage.iShouldSeeTheInitialPage();

		//Actions
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

		//Assertions

		Then.onTheErrorPage.iShouldSeeErrorPage();
		Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ").
		and.iTeardownMyAppFrame();

	});

	opaTest(
		"Start the App and simulate specific server error: Error Message Page with correct error text should be shown",
		function(Given, When, Then) {
			//Arrangement
			Given.iStartMyAppOnADesktopToTestErrorHandler("errorType=NotViaUI");

			Then.onTheSearchPage.iShouldSeeTheSearchField();
			Then.onTheStartPage.iShouldSeeTheInitialPage();

			//Actions
			Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

			//Assertions
			Then.onTheErrorPage.iShouldSeeErrorPage("Error from Backend");
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ANJAZ");
			
			Then.onTheSearchPage.iEnterBPSearch("ATOS");
			Then.onTheSearchPage.iShouldSeeTheBPNumberInSearchField("ATOS");
			// now 2 messages are in the message model -> generic error message
			Then.onTheErrorPage.iShouldSeeErrorPage("").
			and.iTeardownMyAppFrame();

		}); 
		
});