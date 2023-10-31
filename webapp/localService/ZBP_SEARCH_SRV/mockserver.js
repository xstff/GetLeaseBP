sap.ui.define([
	"sap/ui/core/util/MockServer"
], function (MockServer) {
	"use strict";
	var oMockServer,
		_sAppModulePath = "fs/cb/bankcustomer/displays1/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/ZBP_SEARCH_SRV/mockdata";

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */
		init: function () {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
				sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
				sEntity = "BusinessPartnerSet",
				sErrorParam = oUriParameters.get("errorType");
			var iErrorCode = sErrorParam === "badRequest" ? 400 : 500;
			var oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data;
			var oDataSource = oManifest["sap.app"].dataSources;
			var oMainDataSource = oDataSource.searchService;
			var sMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/";
			var aAnnotations = oMainDataSource.settings.annotations;

			oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 1000)
			});

			// load local mock data
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});

			var aRequests = oMockServer.getRequests(),
				fnResponse = function (iErrCode, sMessage, aRequest) {
					aRequest.response = function (oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

			// handling the metadata error test
			if (oUriParameters.get("metadataError") || oUriParameters.get("searchService_metadataError")) {
				aRequests.forEach(function (aEntry) {
					if (aEntry.path.toString().indexOf("$metadata") > -1) {
						fnResponse(500, "metadata Error", aEntry);
					}
				});
			}

			// Handling request errors
			if (oUriParameters.get("searchService_errorType")) {

				sErrorParam = oUriParameters.get("searchService_errorType");
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

				sEntity = "Fs_C_Bps_Account_Holder_Search";

				aRequests.forEach(function (aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}

			// Handling request errors
			if (sErrorParam) {
				aRequests.forEach(function (aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}
			oMockServer.start();

			jQuery.sap.log.info("Running the app with mock data");

			// Add annotations
			if (aAnnotations && aAnnotations.length > 0) {
				aAnnotations.forEach(function (sAnnotationName) {
					var oAnnotation = oDataSource[sAnnotationName],
						sUri = oAnnotation.uri,
						sLocalUri = jQuery.sap.getModulePath(_sAppModulePath + oAnnotation.settings.localUri.replace(".xml", ""), ".xml");

					var _getMockAnnotation = function () {
						return jQuery.sap.sjax({
							url: sLocalUri,
							dataType: "xml"
						}).data;
					};
					///annotations
					new MockServer({
						rootUri: sUri,
						requests: [{
							method: "GET",
							path: new RegExp(""),
							response: function (oXhr) {
								jQuery.sap.require("jquery.sap.xml");
								oXhr.respondXML(200, {}, jQuery.sap.serializeXML(_getMockAnnotation()));
								return true;
							}
						}, {
							method: "GET",
							path: new RegExp("(.*)\?(.*)$"),
							response: function (oXhr) {
								jQuery.sap.require("jquery.sap.xml");
								oXhr.respondXML(200, {}, jQuery.sap.serializeXML(_getMockAnnotation()));
								return true;
							}
						}]
					}).start();
				});
			}
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 */
		getMockServer: function () {
			return oMockServer;
		}
	};

});