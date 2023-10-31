sap.ui.define(["sap/uxap/BlockBase"],
	function(BlockBase) {
		"use strict";

		var oBlockEvents = BlockBase.extend("fs.cb.bankcustomer.displays1.view.blocks.BlockCustomerDetails", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "fs.cb.bankcustomer.displays1.view.blocks.BlockCustomerDetails",
						type: "XML"
					},
					Expanded: {
						viewName: "fs.cb.bankcustomer.displays1.view.blocks.BlockCustomerDetails",
						type: "XML"
					}
				}
			}
		});

		return oBlockEvents;

	});