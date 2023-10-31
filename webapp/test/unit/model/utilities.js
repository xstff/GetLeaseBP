sap.ui.define([
	"fs/cb/bankcustomer/displays1/model/utilities",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(utilities) {
	"use strict";

	QUnit.module("utilities");
	
		function isCozyClassTestCase(assert, sStyle) {
			// Arrange
			this.stub(utilities, "getContentDensityClass").returns("sapUiSizeCozy");

			// System under test
			this.oContentDensityClass = utilities.getContentDensityClass();

			// Assert
			assert.strictEqual(this.oContentDensityClass, sStyle, "Style is sapUiSizeCozy");
		}
		
		QUnit.test("getContentDensityClass", function (assert) {
			isCozyClassTestCase.call(this, assert, "sapUiSizeCozy");
		});
		
		function isCompactClassTestCase(assert, sStyle) {
			// Arrange
			this.stub(utilities, "getContentDensityClass").returns("sapUiSizeCompact");

			// System under test
			this.oContentDensityClass = utilities.getContentDensityClass();

			// Assert
			assert.strictEqual(this.oContentDensityClass, sStyle, "Style is sapUiSizeCompact");
		}
		
		QUnit.test("getContentDensityClass", function (assert) {
			isCompactClassTestCase.call(this, assert, "sapUiSizeCompact");
		});

});