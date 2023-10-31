sap.ui.define([
	"fs/cb/bankcustomer/displays1/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("fs.cb.bankcustomer.displays1.controller.NotFound", {
		
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		onInit: function() {
            this.getView().setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
        },
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for press event on link on the message page
		 * Navigate to the start
		 * @public
		 */
		onLinkPressed: function() {
			this.navTo("start");
		},

		/* =========================================================== */
		/* Public methods                                              */
		/* =========================================================== */
		
        getErrorPageText: function(oMessageModel){
            
            var messages = oMessageModel;
            
            if (messages.length === 1) {
                return this.getResourceBundle().getText("errorPageTextPlaceholder", messages[0].getMessage());
            } else {
                 return this.getResourceBundle().getText("errorPageText");
            }
        }

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

	});

});