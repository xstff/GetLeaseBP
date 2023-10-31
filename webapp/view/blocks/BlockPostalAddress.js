sap.ui.define(["sap/uxap/BlockBase"],
	function(BlockBase) {
		"use strict";

		var oBlockEvents = BlockBase.extend("fs.cb.bankcustomer.displays1.view.blocks.BlockPostalAddress", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "fs.cb.bankcustomer.displays1.view.blocks.BlockPostalAddress",
						type: "XML"
					},
					Expanded: {
						viewName: "fs.cb.bankcustomer.displays1.view.blocks.BlockPostalAddress",
						type: "XML"
					}
				}
			}
		});

		return oBlockEvents;

	});