sap.ui.define([], function() {
	"use strict";

	return {
		getPersonalizationService: function() {
			return sap.ushell.Container.getService("Personalization");
		},

		getGeneratedKey: function() {
			return this.getPersonalizationService().getGeneratedKey();
		},

		storeInnerAppState: function(oComponent, oParamValues) {
			var oPersonalizationService = this.getPersonalizationService();

			var oScope = {
				validity: 0,
				keyCategory: oPersonalizationService.constants.keyCategory.GENERATED_KEY
			};

			var sKey = oPersonalizationService.getGeneratedKey();

			return oPersonalizationService.getContainer(sKey, oScope, oComponent)
				.fail(function() {
					jQuery.sap.log.error("Loading personalization data failed.");
				})
				.done(function(oContainer) {
					oComponent.oCallContainer = oContainer;
					oComponent.oCallContainer.clear();
					oComponent.oCallContainer.setItemValue("params", oParamValues);
					return oComponent.oCallContainer.save(); // validity = 0 = transient, no roundtrip
				});
		},

		getInnerAppState: function(sContainerId) {
			var oPersonalizationService = this.getPersonalizationService();

			return oPersonalizationService.getContainer(sContainerId)
				.fail(function() {
					jQuery.sap.log.error("Loading personalization data failed.");
				})
				.done(function(oContainer) {
					return this;
				});
		}
	};

});