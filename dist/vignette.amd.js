/**
 * Helper module to generate the URL to a thumbnail of specific size from JS
 */
'use strict';
define(["require", "exports"], function (require, exports) {
    var Vignette = (function () {
        function Vignette() {
        }
        /**
         * Converts the URL of a full size image or of a thumbnail into one of a thumbnail of
         * the specified size and returns it
         *
         * @public
         *
         * @param {String} url The URL to the full size image or a thumbnail
         * @param {Object} options Parameters used for sizing the thumbnail and specifying mode
         * @param {String} options.mode The thumbnailer mode, one from Vignette.mode
         * @param {Number} options.width The width of the thumbnail to fetch
         * @param {Number} options.height The height of the thumbnail to fetch
         * @param {Number} options.xOffset1 Optional x-offset for some modes
         * @param {Number} options.xOffset2 Optional x-offset for some modes
         * @param {Number} options.yOffset1 Optional y-offset for some modes
         * @param {Number} options.yOffset2 Optional y-offset for some modes
         *
         * @return {String}
         */
        Vignette.getThumbURL = function (url, options) {
            var urlParameters;
            this.verifyThumbnailOptions(options);
            if (this.isLegacyUrl(url)) {
                urlParameters = this.getParametersFromLegacyUrl(url);
                url = this.createThumbnailUrl(urlParameters, options);
            }
            else if (this.isThumbnailerUrl(url)) {
                // Accept Vignette URL in order to convert thumbnail to a different mode
                url = this.addThumbnailMode(url, options);
            }
            return url;
        };
        /**
         * Verifies required and mode-specific thumbnail options
         *
         * @private
         *
         * @param {options} options
         *
         * @return {void}
         */
        Vignette.verifyThumbnailOptions = function (options) {
            if (!options.hasOwnProperty('mode')) {
                throw new Error('Required parameter `mode` not specified for method getThumbUrl');
            }
            if (!options.hasOwnProperty('width')) {
                throw new Error('Required parameter `width` not specified for method getThumbUrl');
            }
            if (!options.hasOwnProperty('height') && options.mode !== Vignette.mode.scaleToWidth && options.mode !== Vignette.mode.windowCrop) {
                throw new Error('Thumbnailer mode `' + options.mode + '` requires height');
            }
            if (options.mode === Vignette.mode.windowCrop || options.mode === Vignette.mode.windowCropFixed) {
                if (!options.hasOwnProperty('xOffset1') || !options.hasOwnProperty('yOffset1') || !options.hasOwnProperty('xOffset2') || !options.hasOwnProperty('yOffset2')) {
                    throw new Error('Thumbnailer mode `' + options.mode + '` requires x and y offsets');
                }
            }
        };
        /**
         * Checks if url points to thumbnailer
         *
         * @public
         *
         * @param {String} url
         *
         * @return {Boolean}
         */
        Vignette.isThumbnailerUrl = function (url) {
            return url && this.imagePathRegExp.test(url);
        };
        /**
         * Checks if url points to legacy thumbnailer
         *
         * @private
         *
         * @param {String} url
         *
         * @return {Boolean}
         */
        Vignette.isLegacyThumbnailerUrl = function (url) {
            return url && this.legacyThumbPathRegExp.test(url);
        };
        /**
         * Checks if url points to legacy image URL
         *
         * @private
         *
         * @param {String} url
         *
         * @return {Boolean}
         */
        Vignette.isLegacyUrl = function (url) {
            return url && this.legacyPathRegExp.test(url);
        };
        /**
         * Gets base domain from url's domain
         *
         * @param {String} fullLegacyDomain
         *
         * @returns {String}
         */
        Vignette.getBaseDomain = function (fullLegacyDomain) {
            return fullLegacyDomain.match(this.getDomainRegExt)[1];
        };
        /**
         * Clear thumb segments from legacy url segments
         *
         * @param {String[]} urlSegments
         *
         * @returns {String[]}
         */
        Vignette.clearLegacyThumbSegments = function (urlSegments) {
            if (urlSegments.indexOf('thumb') > -1) {
                // remove `thumb` and the last segment from the array
                return urlSegments.filter(function (segment) { return segment != 'thumb'; }).slice(0, -1);
            }
            return urlSegments;
        };
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
         * @return {object}
         */
        Vignette.getParametersFromLegacyUrl = function (url) {
            var segments = url.split('/'), result = {};
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
        };
        /**
         * Constructs complete thumbnailer url
         *
         * @private
         *
         * @param {object} urlParameters
         * @param {object} options
         *
         * @return {String}
         */
        Vignette.createThumbnailUrl = function (urlParameters, options) {
            var url = [
                'http://vignette.' + urlParameters.domain,
                urlParameters.wikiaBucket,
                urlParameters.imagePath,
                'revision/latest',
                this.getModeParameters(options)
            ].join('/'), query = [
                'cb=' + urlParameters.cacheBuster
            ];
            if (this.hasWebPSupport) {
                query.push('format=webp');
            }
            if (urlParameters.pathPrefix) {
                query.push('path-prefix=' + urlParameters.pathPrefix);
            }
            return url + '?' + query.join('&');
        };
        /**
         * Adds thumbnail mode parameters to a Vignette URL
         *
         * @private
         *
         * @param {String} url
         * @param {object} options
         *
         * @returns {String}
         */
        Vignette.addThumbnailMode = function (url, options) {
            var currentUrl = url.substring(0, (url.indexOf('revision/latest') + 15)), queryIndex = url.indexOf('?'), queryString = '';
            if (queryIndex > -1) {
                queryString = url.substring(queryIndex);
            }
            return currentUrl + '/' + this.getModeParameters(options) + queryString;
        };
        /**
         * Gets thumbnail mode parameters as an appendable string
         *
         * @private
         *
         * @param {object} options
         *
         * @returns {String}
         */
        Vignette.getModeParameters = function (options) {
            var modeParameters = [
                options.mode
            ];
            if (options.mode === Vignette.mode.scaleToWidth) {
                modeParameters.push(String(options.width));
            }
            else if (options.mode === Vignette.mode.windowCrop || options.mode === Vignette.mode.windowCropFixed) {
                modeParameters.push('width/' + options.width);
                if (options.mode === Vignette.mode.windowCropFixed) {
                    modeParameters.push('height/' + options.height);
                }
                modeParameters.push('x-offset/' + options.xOffset1, 'y-offset/' + options.yOffset1, 'window-width/' + (options.xOffset2 - options.xOffset1), 'window-height/' + (options.yOffset2 - options.yOffset1));
            }
            else {
                modeParameters.push('width/' + options.width, 'height/' + options.height);
            }
            return modeParameters.join('/');
        };
        Vignette.imagePathRegExp = /\/\/vignette\d?\.wikia/;
        Vignette.legacyThumbPathRegExp = /\/\w+\/thumb\//;
        Vignette.getDomainRegExt = /(wikia-dev.com|wikia.nocookie.net)/;
        Vignette.legacyPathRegExp = /(wikia-dev.com|wikia.nocookie.net)\/__cb[\d]+\/.*$/;
        Vignette.mode = {
            fixedAspectRatio: 'fixed-aspect-ratio',
            fixedAspectRatioDown: 'fixed-aspect-ratio-down',
            scaleToWidth: 'scale-to-width',
            thumbnail: 'thumbnail',
            thumbnailDown: 'thumbnail-down',
            topCrop: 'top-crop',
            topCropDown: 'top-crop-down',
            windowCrop: 'window-crop',
            windowCropFixed: 'window-crop-fixed',
            zoomCrop: 'zoom-crop',
            zoomCropDown: 'zoom-crop-down'
        };
        Vignette.hasWebPSupport = (function () {
            // Image is not defined in node.js
            if (typeof Image === 'undefined') {
                return false;
            }
            // @see http://stackoverflow.com/a/5573422
            var webP = new Image();
            webP.src = 'data:image/webp;' + 'base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
            webP.onload = webP.onerror = function () {
                Vignette.hasWebPSupport = (webP.height === 2);
            };
            return false;
        })();
        return Vignette;
    })();
    return Vignette;
});
