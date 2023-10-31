sap.ui.define([
	"fs/cb/bankcustomer/displays1/model/formatter",
	"sap/ui/thirdparty/sinon",
	"sap/ui/core/Locale"
], function(formatter, sinon, Locale) {
	"use strict";

	QUnit.module("getStateBasedOnRating", {});

	function getStateBasedOnRatingTestCase(assert, sValue, sExpectedtext) {
		// Act
		var sText = formatter.getStateBasedOnRating(sValue);

		// Assert
		assert.strictEqual(sText, sExpectedtext, "The formatting was correct");
	}

	QUnit.test("Should return Success for A", function(assert) {
		getStateBasedOnRatingTestCase.call(this, assert, "A", "Success");
	});

	QUnit.test("Should return Warning for B", function(assert) {
		getStateBasedOnRatingTestCase.call(this, assert, "B", "Warning");
	});

	QUnit.test("Should return Error for C", function(assert) {
		getStateBasedOnRatingTestCase.call(this, assert, "C", "Error");
	});

	QUnit.test("Should return None for ", function(assert) {
		getStateBasedOnRatingTestCase.call(this, assert, "", "None");
	});

	QUnit.module("replaceAddrSlashByNewLine", {
		setup: function() {
			var oControllerStub = {
				formatter: formatter
			};
			this.isolatedReplaceAddrSlashByNewLine = formatter.replaceAddrSlashByNewLine.bind(oControllerStub);
		},
		teardown: function() {}
	});

	function replaceAddrSlashByNewLineTestCase(assert, sValue, sExpectedtext) {
		// Act
		var sText = this.isolatedReplaceAddrSlashByNewLine(sValue);

		// Assert
		assert.strictEqual(sText, sExpectedtext, "The formatting was correct");
	}

	QUnit.test("Should replace / bei new Line", function(assert) {
		replaceAddrSlashByNewLineTestCase.call(this, assert, "Teststreet 7, Add / E-77777 Testcity-Mallorca",
			"Teststreet 7, Add\nE-77777 Testcity-Mallorca");
	});

	QUnit.test("Should replace / bei new Line - no /", function(assert) {
		replaceAddrSlashByNewLineTestCase.call(this, assert, "E-77777 Testcity-Mallorca",
			"E-77777 Testcity-Mallorca");
	});

	QUnit.module("replaceAddrSlashByComma", {
		setup: function() {
			var oControllerStub = {
				formatter: formatter
			};
			this.isolatedReplaceAddrSlashByComma = formatter.replaceAddrSlashByComma.bind(oControllerStub);
		},
		teardown: function() {}
	});

	function replaceAddrSlashByCommaTestCase(assert, sValue, sExpectedtext) {
		// Act
		var sText = this.isolatedReplaceAddrSlashByComma(sValue);

		// Assert
		assert.strictEqual(sText, sExpectedtext, "The formatting was correct");
	}

	QUnit.test("Should replace / bei new Line", function(assert) {
		replaceAddrSlashByCommaTestCase.call(this, assert, "Teststreet 7, Add / E-77777 Testcity-Mallorca",
			"Teststreet 7, Add, E-77777 Testcity-Mallorca");
	});

	QUnit.test("Should replace / bei new Line - no /", function(assert) {
		replaceAddrSlashByCommaTestCase.call(this, assert, "E-77777 Testcity-Mallorca",
			"E-77777 Testcity-Mallorca");
	});

	QUnit.module("appendLines", {
		setup: function() {
			var oControllerStub = {
				formatter: formatter
			};
			this.isolatedAppendLines = formatter.appendLines.bind(oControllerStub);
		},
		teardown: function() {}
	});

	function appendLinesTestCase(assert, sArg1, sArg2, sArg3, sArg4, sExpectedtext) {
		// Act
		var sText = this.isolatedAppendLines(sArg1, sArg2, sArg3, sArg4);

		// Assert
		assert.strictEqual(sText, sExpectedtext, "The formatting was correct");
	}

	QUnit.test("Append Lines - 4 entries", function(assert) {
		appendLinesTestCase.call(this, assert, "A", "B", "C", "D",
			"A\nB\nC\nD");
	});

	QUnit.test("Append Lines - empty entry", function(assert) {
		appendLinesTestCase.call(this, assert, "A", "", "C", "D",
			"A\n\nC\nD");
	});

	QUnit.test("Append Lines - 2 empty entries", function(assert) {
		appendLinesTestCase.call(this, assert, "A", "B", "", "",
			"A\nB");
	});
	
	QUnit.test("Append Lines - 3 empty entries", function(assert) {
		appendLinesTestCase.call(this, assert, "", "", "", "D",
			"\n\n\nD");
	});

});