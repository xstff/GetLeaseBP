sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";
	var oMockServer,
		_sAppModulePath = "fs/cb/bankcustomer/displays1/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/ZBKCUSTOVW_SRV/mockdata";

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */
		init: function() {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
				sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				oMainDataSource = oManifest["sap.app"].dataSources.mainService,
				sMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/",
				sErrorParam = "", //oUriParameters.get("errorType"),
				iErrorCode = 0, //sErrorParam === "badRequest" ? 400 : 500,
				sEntity = "BkCustomerSet";
				
			oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 500)
			});

			// load local mock data
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});

			var aRequests = oMockServer.getRequests(),
				fnResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				},
				fnJSONResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "application/json;charset=utf-8"
						}, sMessage);
					};
				};

			// handling the metadata error test
			if (oUriParameters.get("metadataError") || oUriParameters.get("mainService_metadataError")) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf("$metadata") > -1) {
						fnResponse(500, "metadata Error", aEntry);
					}
				});
			}

			// Handling request errors
			if (oUriParameters.get("mainService_errorType")) {

				sErrorParam = oUriParameters.get("mainService_errorType");
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

				if (oUriParameters.get("entitySet")) {
					sEntity = oUriParameters.get("entitySet");
				}

				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}

			if (oUriParameters.get("errorType")) {

				sErrorParam = oUriParameters.get("errorType");
				iErrorCode = 400; // bad request
				var sMessage = "";

				if (sErrorParam === "NotViaUI") {
					iErrorCode = 400;
					sMessage =
						'{"error":{"code":"FS_ODATA_DPS_TDM/001","message":{"lang":"en","value":"Error from Backend"}}}';

					aRequests.forEach(function(aEntry) {
						if (aEntry.path.toString().indexOf(sEntity) > -1) {
							fnJSONResponse(iErrorCode, sMessage, aEntry);
						}
					});
				}
			}

			oMockServer.setRequests(aRequests);
			
			oMockServer.start();

			jQuery.sap.log.info("Running the app with mock data");
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 */
		getMockServer: function() {
			return oMockServer;
		}
	};

});