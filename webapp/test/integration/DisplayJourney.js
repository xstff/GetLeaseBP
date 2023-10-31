sap.ui.define([
	"sap/ui/test/opaQunit",
	"fs/cb/bankcustomer/displays1/test/integration/pages/Common"
], function(opaTest, Common) {
	"use strict";

	QUnit.module("Display");

	opaTest("I display BusinessPartner", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		// //Actions
		Then.onTheSearchPage.iEnterBPSearch("ANJAZ");

		// Object Header
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["email", "anjaz_addrindep@hollywood.com", "sap.m.Link", "Text"],
			["phone", "+49 (6133) 33331", "sap.m.Link", "Text"],
			["sinceDate", "Jan 1, 2000", "sap.m.Text", "Text"],
			["rating", "Very Good", "sap.m.ObjectStatus", "Text"],
			["advsrptyName", "Sebastian Winter", "sap.m.Link", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheIcon("sap-icon://customer");

		// Customer Information
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["personFirstName", "Anja", "sap.m.Text", "Text"],
			["personMiddleName", "ZweiterVorname", "sap.m.Text", "Text"],
			["personLastName", "Zeitler", "sap.m.Text", "Text"],
			["personBirthName", "Geburtsname", "sap.m.Text", "Text"],
			["personBirthday", "May 5, 1980", "sap.m.Text", "Text"]
		]);

		// Postal Address
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["stdAddrText", "Teststreet 7, Add\nE-77777 Testcity-Mallorca", "sap.m.Text", "Text"]
		]);

		// Contact Details
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["contactDetailsLandlineLink", "+49 (6122) 22222-123", "sap.m.Link", "Text"],
			["contactDetailsCellPhoneLink", "+49 (172) 11111", "sap.m.Link", "Text"],
			["contactDetailsEmailAddrLink", "anjaz_addrindep@hollywood.com", "sap.m.Link", "Text"]
		]);

		// Accounts
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["acctID", "0010001223", "sap.m.ObjectIdentifier", "Title"],
			["acctProdID", "GIRO MAX", "sap.m.Text", "Text"],
			["acctProdName", "Girokonto m. max. Funktionalität", "sap.m.Text", "Text"],
			["acctID", "0010006388", "sap.m.ObjectIdentifier", "Title"],
			["acctProdID", "FTD EWTD", "sap.m.Text", "Text"],
			["acctProdName", "Festgeld m. Ausstattung 'Vorzeitige Verfügung'", "sap.m.Text", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iSeeObjectNumber("1,000.00", "None");
		Then.onTheBusinessPartnerOverviewPage.iSeeObjectNumber("500.00", "None");
		Then.onTheBusinessPartnerOverviewPage.iSeeObjectNumber("1.00", "None");

		// ADDITIONAL ADDRESSES
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["addrUsageName", "Arbeitsadresse", "sap.m.ObjectIdentifier", "Title"],
			["addrAddress", "Arbeit 2, 44444 zuViel", "sap.m.Text", "Text"],
			["addrLandline", "+49 (4321) 44444", "sap.m.Link", "Text"],
			["addrCellPhone", "+49 (151) 4444", "sap.m.Link", "Text"],
			["addrEmail", "anjaz@work.com", "sap.m.Link", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["addrUsageName", "Kontoauszugsadresse", "sap.m.ObjectIdentifier", "Title"],
			["addrAddress", "Home, 22222 zuViel", "sap.m.Text", "Text"],
			["addrLandline", "+49 (4321) 22222", "sap.m.Link", "Text"],
			["addrCellPhone", "+49 (151) 2222", "sap.m.Link", "Text"],
			["addrEmail", "anjaz@home2.com", "sap.m.Link", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["addrUsageName", "Korrespondenzadresse", "sap.m.ObjectIdentifier", "Title"],
			["addrAddress", "Home 2, 33333 zuViel", "sap.m.Text", "Text"],
			["addrLandline", "+49 (4321) 33333", "sap.m.Link", "Text"],
			["addrCellPhone", "+49 (151) 3333", "sap.m.Link", "Text"],
			["addrEmail", "anjaz@home.com", "sap.m.Link", "Text"]
		]);

		// Quickviews
		Then.onTheBusinessPartnerOverviewPage.iPressAccountHolderQuickView();
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeThePopover();
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheNoDataText();
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmailDialog("seb.winter@euro.de");
		Then.onTheBusinessPartnerOverviewPage.iSeeNavigationOnAccountItem(0, false);
		Then.onTheBusinessPartnerOverviewPage.iSeeNavigationOnAccountItem(1, true);
		Then.onTheBusinessPartnerOverviewPage.iSeeNavigationOnAccountItem(2, false);
		Then.onTheBusinessPartnerOverviewPage.iSeeNavigationOnAccountItem(3, true);
		Then.iTeardownMyAppFrame();

	});

	opaTest("I display minimum BusinessPartner", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		// //Actions
		Then.onTheSearchPage.iEnterBPSearch("MINAMIN");

		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheIcon("sap-icon://customer");

		// Object Header
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["noContextText", "None", "sap.m.Text", "Text"],
			["sinceDate", "None", "sap.m.Text", "Text"],
			["rating", "None", "sap.m.ObjectStatus", "Text"],
			["noAdvisorText", "None", "sap.m.Text", "Text"]
		]);

		// Customer Information
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["personFirstName", "Mina", "sap.m.Text", "Text"],
			["personLastName", "Min", "sap.m.Text", "Text"]
		]);

		// Postal Address
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["noPostalAddressText", "No details available", "sap.m.Text", "Text"]
		]);

		// Contact Details
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["noContactDetails", "No details available", "sap.m.Text", "Text"]
		]);

		Then.iTeardownMyAppFrame();
	});

	opaTest("I display Company", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		// //Actions
		Then.onTheSearchPage.iEnterBPSearch("ATOS");

		// Object Header
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["email", "info@atos.de", "sap.m.Link", "Text"],
			["phone", "+49 (6227) 852145", "sap.m.Link", "Text"],
			["sinceDate", "Apr 8, 2016", "sap.m.Text", "Text"],
			["rating", "Very Good", "sap.m.ObjectStatus", "Text"],
			["advsrptyName", "Sebastian Winter", "sap.m.Link", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheIcon("sap-icon://factory");

		// Customer Information
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["orgName", "ATOS\nATOS2\nATOS3\nATOS4", "sap.m.Text", "Text"]
		]);

		// Postal Address
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["stdAddrText", "Botoxstraße 1\n69190 Walldorf", "sap.m.Text", "Text"]
		]);

		// Contact Details
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["contactDetailsLandlineLink", "+49 (6221 1234567) 0-987", "sap.m.Link", "Text"],
			["contactDetailsCellPhoneLink", "+49 (171) 3325200", "sap.m.Link", "Text"],
			["contactDetailsEmailAddrLink", "info@atos.de", "sap.m.Link", "Text"]
		]);

		// Accounts
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["acctID", "0010001223", "sap.m.ObjectIdentifier", "Title"],
			["acctProdID", "GIRO MAX", "sap.m.Text", "Text"],
			["acctProdName", "Girokonto m. max. Funktionalität", "sap.m.Text", "Text"],
			["acctID", "0010006388", "sap.m.ObjectIdentifier", "Title"],
			["acctProdID", "FTD EWTD", "sap.m.Text", "Text"],
			["acctProdName", "Festgeld m. Ausstattung 'Vorzeitige Verfügung'", "sap.m.Text", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iSeeObjectNumber("1,000.00", "None");
		Then.onTheBusinessPartnerOverviewPage.iSeeObjectNumber("500.00", "None");
		Then.onTheBusinessPartnerOverviewPage.iSeeObjectNumber("1.00", "None");

		// ADDITIONAL ADDRESSES
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["addrUsageName", "Arbeitsadresse", "sap.m.ObjectIdentifier", "Title"],
			["addrAddress", "Arbeit 2, 44444 zuViel", "sap.m.Text", "Text"],
			["addrLandline", "+49 (4321) 44444", "sap.m.Link", "Text"],
			["addrCellPhone", "+49 (151) 4444", "sap.m.Link", "Text"],
			["addrEmail", "anjaz@work.com", "sap.m.Link", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["addrUsageName", "Kontoauszugsadresse", "sap.m.ObjectIdentifier", "Title"],
			["addrAddress", "Home, 22222 zuViel", "sap.m.Text", "Text"],
			["addrLandline", "+49 (4321) 22222", "sap.m.Link", "Text"],
			["addrCellPhone", "+49 (151) 2222", "sap.m.Link", "Text"],
			["addrEmail", "anjaz@home2.com", "sap.m.Link", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["addrUsageName", "Korrespondenzadresse", "sap.m.ObjectIdentifier", "Title"],
			["addrAddress", "Home 2, 33333 zuViel", "sap.m.Text", "Text"],
			["addrLandline", "+49 (4321) 33333", "sap.m.Link", "Text"],
			["addrCellPhone", "+49 (151) 3333", "sap.m.Link", "Text"],
			["addrEmail", "anjaz@home.com", "sap.m.Link", "Text"]
		]);

		// Quickviews
		Then.onTheBusinessPartnerOverviewPage.iPressAccountHolderQuickView();
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeThePopover();
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheNoDataText();
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmailDialog("seb.winter@euro.de");
		Then.iTeardownMyAppFrame();

	});

	opaTest("I display minimum Company", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		// //Actions
		Then.onTheSearchPage.iEnterBPSearch("ATOSMIN");

		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheIcon("sap-icon://factory");

		// Object Header
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["noContextText", "None", "sap.m.Text", "Text"],
			["sinceDate", "None", "sap.m.Text", "Text"],
			["rating", "None", "sap.m.ObjectStatus", "Text"],
			["noAdvisorText", "None", "sap.m.Text", "Text"]
		]);
		
		// Customer Information
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["orgName", "ATOS", "sap.m.Text", "Text"]
		]);

		// Postal Address
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["noPostalAddressText", "No details available", "sap.m.Text", "Text"]
		]);

		// Contact Details
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["noContactDetails", "No details available", "sap.m.Text", "Text"]
		]);

		Then.iTeardownMyAppFrame();
	});

	opaTest("I display Group", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		// //Actions
		Then.onTheSearchPage.iEnterBPSearch("12020");

		// Object Header
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["email", "a@b.com", "sap.m.Link", "Text"],
			["phone", "0190-000", "sap.m.Link", "Text"],
			["sinceDate", "Apr 8, 2016", "sap.m.Text", "Text"],
			["rating", "Poor", "sap.m.ObjectStatus", "Text"],
			["advsrptyName", "Sebastian Winter", "sap.m.Link", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheIcon("sap-icon://group");

		// Customer Information
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["grpName", "Schmidt-Meyer\nMeyer-Schmidt", "sap.m.Text", "Text"]
		]);

		// Postal Address
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["stdAddrText", "Botoxstraße 1\n69190 Walldorf", "sap.m.Text", "Text"]
		]);

		// Contact Details
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["contactDetailsLandlineLink", "0190-888", "sap.m.Link", "Text"],
			["contactDetailsCellPhoneLink", "0190-999", "sap.m.Link", "Text"],
			["contactDetailsEmailAddrLink", "a@b.com", "sap.m.Link", "Text"]
		]);

		// Accounts
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["acctID", "0010001223", "sap.m.ObjectIdentifier", "Title"],
			["acctProdID", "GIRO MAX", "sap.m.Text", "Text"],
			["acctProdName", "Girokonto m. max. Funktionalität", "sap.m.Text", "Text"],
			["acctID", "0010006388", "sap.m.ObjectIdentifier", "Title"],
			["acctProdID", "FTD EWTD", "sap.m.Text", "Text"],
			["acctProdName", "Festgeld m. Ausstattung 'Vorzeitige Verfügung'", "sap.m.Text", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iSeeObjectNumber("1,000.00", "None");
		Then.onTheBusinessPartnerOverviewPage.iSeeObjectNumber("500.00", "None");
		Then.onTheBusinessPartnerOverviewPage.iSeeObjectNumber("1.00", "None");

		// ADDITIONAL ADDRESSES
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["addrUsageName", "Arbeitsadresse", "sap.m.ObjectIdentifier", "Title"],
			["addrAddress", "Arbeit 2, 44444 zuViel", "sap.m.Text", "Text"],
			["addrLandline", "+49 (4321) 44444", "sap.m.Link", "Text"],
			["addrCellPhone", "+49 (151) 4444", "sap.m.Link", "Text"],
			["addrEmail", "anjaz@work.com", "sap.m.Link", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["addrUsageName", "Kontoauszugsadresse", "sap.m.ObjectIdentifier", "Title"],
			["addrAddress", "Home, 22222 zuViel", "sap.m.Text", "Text"],
			["addrLandline", "+49 (4321) 22222", "sap.m.Link", "Text"],
			["addrCellPhone", "+49 (151) 2222", "sap.m.Link", "Text"],
			["addrEmail", "anjaz@home2.com", "sap.m.Link", "Text"]
		]);
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["addrUsageName", "Korrespondenzadresse", "sap.m.ObjectIdentifier", "Title"],
			["addrAddress", "Home 2, 33333 zuViel", "sap.m.Text", "Text"],
			["addrLandline", "+49 (4321) 33333", "sap.m.Link", "Text"],
			["addrCellPhone", "+49 (151) 3333", "sap.m.Link", "Text"],
			["addrEmail", "anjaz@home.com", "sap.m.Link", "Text"]
		]);

		// Quickviews
		Then.onTheBusinessPartnerOverviewPage.iPressAccountHolderQuickView();
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeThePopover();
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheNoDataText();
		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheEmailDialog("seb.winter@euro.de");
		Then.iTeardownMyAppFrame();

	});

	opaTest("I display minimum Group", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		Then.onTheSearchPage.iShouldSeeTheSearchField();

		// //Actions
		Then.onTheSearchPage.iEnterBPSearch("GROUPMIN");

		Then.onTheBusinessPartnerOverviewPage.iShouldSeeTheIcon("sap-icon://group");

		// Object Header
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["noContextText", "None", "sap.m.Text", "Text"],
			["sinceDate", "None", "sap.m.Text", "Text"],
			["rating", "None", "sap.m.ObjectStatus", "Text"],
			["noAdvisorText", "None", "sap.m.Text", "Text"]
		]);

		// Customer Information
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["grpName", "Schmidt-Meyer", "sap.m.Text", "Text"]
		]);

		// Postal Address
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["noPostalAddressText", "No details available", "sap.m.Text", "Text"]
		]);

		// Contact Details
		Then.onTheBusinessPartnerOverviewPage.iSeeCorrectValues([
			["noContactDetails", "No details available", "sap.m.Text", "Text"]
		]);

		Then.iTeardownMyAppFrame();
	});

});