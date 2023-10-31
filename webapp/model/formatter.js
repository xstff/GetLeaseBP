sap.ui.define([	
], function( ) {
	"use strict";

	return {

		appendLines: function(arg1, arg2, arg3, arg4) {
			var str = "";
			
			if (arg4 && arg4.length > 0) {
				str = arg4;
			}
			if (str.length > 0) {
				str = "\n" + str;
			}
			if (arg3 && arg3.length > 0) {
				str = arg3 + str;
			}
			if (str.length > 0) {
				str = "\n" + str;
			}
			if (arg2 && arg2.length > 0) {
				str = arg2 + str;
			} 
			if (str.length > 0) {
				str = "\n" + str;
			}
			if (arg1 && arg1.length > 0) {
				str = arg1 + str;
			}
			return str;
		},
		
		replaceAddrSlashByNewLine: function(sAddr) {
			return this.formatter._replaceAddrSlashBy(sAddr, "\n");
		},
		
		replaceAddrSlashByComma: function(sAddr) {
			return this.formatter._replaceAddrSlashBy(sAddr, ", ");
		},
		
		_replaceAddrSlashBy: function(sAddr, sReplace) {
			var str = "";
			if (sAddr) {
				var arr = sAddr.split(" / ");
				for (var i = 0; arr && i < arr.length; i++) {
					arr[i] = arr[i].trim();
				}
				if (arr && arr.length > 0) {
					str = arr[0];
				}
				for (i = 1; arr && i < arr.length; i++) {
					str += sReplace + arr[i];	
				}
			}
			return str;
		},
		
		/**
		 * Identify CSS Class based on the rating indicator
		 * A, B  - Success
		 * C     - Error
		 * else  - None
		 * @public
		 * @param {string} sValue the rating indicator
		 * @returns {string} sValue the CSS Class
		 */
		getStateBasedOnRating: function(sValue) {
			
			if (!sValue) {
				return "None";
			}
			
			if ( sValue.indexOf("A") > -1 ) {
				return "Success";
			}
			
			if ( sValue.indexOf("B") > -1 ) {
				return "Warning";
			}
			
			if ( sValue.indexOf("C") > -1 ) {
				return "Error";
			}
			
			return "None";
			
		}

	};

});