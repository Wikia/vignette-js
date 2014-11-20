/**
 * Helper module to generate the URL to a thumbnail of specific size from JS
 */
'use strict';

interface ImageUrlParameters {
	domain: string;
	cacheBuster: string;
	wikiaBucket: string;
	pathPrefix: string;
	imagePath: string;
}

class Vignette {
	private static isVignetteRegExp: RegExp = /\/\/vignette\d?\.wikia/;
	private static thumbBasePathRegExp: RegExp = /(.*\/revision\/\w+).*/;
	private static getDomainRegExt: RegExp = /(wikia-dev.com|wikia.nocookie.net)/;
	private static legacyPathRegExp: RegExp = /(wikia-dev.com|wikia.nocookie.net)\/__cb[\d]+\/.*$/;

	public static mode: any = {
		fixedAspectRatio: 'fixed-aspect-ratio',
		fixedAspectRatioDown: 'fixed-aspect-ratio-down',
		thumbnail: 'thumbnail',
		thumbnailDown: 'thumbnail-down',
		topCrop: 'top-crop',
		topCropDown: 'top-crop-down',
		zoomCrop: 'zoom-crop',
		zoomCropDown: 'zoom-crop-down'
	};

	static hasWebPSupport = (function () {
		// Image is not defined in node.js
		if (typeof Image === 'undefined') {
			return false
		}
		// @see http://stackoverflow.com/a/5573422
		var webP = new Image();
		webP.src = 'data:image/webp;' +
		'base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
		webP.onload = webP.onerror = () => {
			Vignette.hasWebPSupport = (webP.height === 2);
		};

		return false;
	})();

	/**
	 * Converts the URL of a full size image or of a thumbnail into one of a thumbnail of
	 * the specified size and returns it
	 *
	 * @public
	 *
	 * @param {String} url The URL to the full size image or a thumbnail
	 * @param {String} mode The thumbnailer mode, one from Vignette.mode
	 * @param {Number} width The width of the thumbnail to fetch
	 * @param {Number} height The height of the thumbnail to fetch
	 *
	 * @return {String}
	 */
	static getThumbURL(
		url: string,
		mode: string,
		width: number,
		height: number
		): string {
		var urlParameters: ImageUrlParameters;

		// for now we handle only legacy urls as input
		if (this.isLegacyUrl(url)) {
			urlParameters = this.getParametersFromLegacyUrl(url);
			url = this.createThumbnailUrl(urlParameters, mode, width, height);
		}

		return url;
	}

	/**
	 * Checks if url points to vignette
	 *
	 * @public
	 *
	 * @param {String} url
	 *
	 * @return {Boolean}
	 */
	static isVignetteUrl(url: string): boolean {
		return url && this.isVignetteRegExp.test(url);
	}

	/**
	 * Checks if url points to legacy image URL
	 *
	 * @private
	 *
	 * @param {String} url
	 *
	 * @return {Boolean}
	 */
	private static isLegacyUrl(url: string): boolean {
		return url && this.legacyPathRegExp.test(url);
	}

	/**
	 * Removes the thumbnail options part from a thumbnail URL
	 *
	 * @private
	 *
	 * @param {String} url The URL of a thumbnail
	 *
	 * @return {String} The URL without the thumbnail options
	 */
	public static clearThumbOptions(url: string): string {
		if (this.isVignetteUrl(url)) {
			return url.replace(this.thumbBasePathRegExp, '$1');
		}
		return this.clearLegacyThumbSegments(url.split('/')).join('/');
	}

	/**
	 * Gets base domain from url's domain
	 *
	 * @param {String} fullLegacyDomain
	 *
	 * @returns {String}
	 */
	private static getBaseDomain(fullLegacyDomain: string): string {
		return fullLegacyDomain.match(this.getDomainRegExt)[1];
	}

	/**
	 * Clear thumb segments from legacy url segments
	 *
	 * @param {String[]} urlSegments
	 *
	 * @returns {String[]}
	 */
	private static clearLegacyThumbSegments(urlSegments: string[]): string[] {
		if (urlSegments.indexOf('thumb') > -1) {
			// remove `thumb` and the last segment from the array
			return urlSegments.filter((segment) => segment != 'thumb' ).slice(0, -1);
		}
		return urlSegments;
	}

	/**
	 * Parses legacy image URL and returns object with URL parameters
	 *
	 * The logic behind handling the legacy URLs:
	 *   - the URL is split into segments by `/`;
	 *   - first two segments `http://` are removed;
	 *   - next segment is the domain name;
	 *   - next segment is the cachebuster value with `__cb` in front so we use `substr()`
	 *     to get rid of the prefix;
	 *   - clearLegacyThumbSegments is called which clears the `thumb` and last segment from
	 *     the URL if it is a thumbnail;
	 *   - the last three segments are the `imagePath` so we splice them from the array;
	 *   - what is left is the `wikiaBucket`, which is the first and the last element of
	 *     the array, these get removed from the array;
	 *   - what is left in `segments` (if any) are the prefix segments so they go to `pathPrefix`;
	 *
	 * @private
	 *
	 * @param {String} url
	 *
	 * @return {ImageUrlParameters}
	 */
	private static getParametersFromLegacyUrl(url: string): ImageUrlParameters {
		var segments = url.split('/'),
			result: any = {};

		// Remove protocol
		segments.splice(0, 2);
		result.domain = this.getBaseDomain(segments.shift());
		result.cacheBuster = segments.shift().substr(4);

		segments = this.clearLegacyThumbSegments(segments);

		// Last three segments are the image path
		result.imagePath = segments.splice(-3, 3).join('/');
		// First and last segments form the bucket name
		result.wikiaBucket = [segments.shift(), segments.pop()].join('/');
		// The remaining segments are prefix
		result.pathPrefix = segments.join('/');

		return result;
	}

	/**
	 * Constructs complete thumbnailer url
	 *
	 * @private
	 *
	 * @param {ImageUrlParameters} urlParameters
	 * @param {String} mode
	 * @param {Number} width
	 * @param {Number} height
	 *
	 * @return {String}
	 */
	private static createThumbnailUrl(
		urlParameters: ImageUrlParameters,
		mode: string,
		width: number,
		height: number
		): string {
		var url	= [
			'http://vignette.' + urlParameters.domain,
			'/' + urlParameters.wikiaBucket,
			'/' + urlParameters.imagePath,
			'/revision/latest',
			'/' + mode,
			'/width/' + width,
			'/height/' + height,
			'?cb=' + urlParameters.cacheBuster
		];

		if (this.hasWebPSupport) {
			url.push('&format=webp');
		}

		if (urlParameters.pathPrefix) {
			url.push('&path-prefix=' + urlParameters.pathPrefix);
		}

		return url.join('');
	}
}
