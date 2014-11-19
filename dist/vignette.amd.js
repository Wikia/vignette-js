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
         * @param {String} mode The thumbnailer mode, one from Vignette.mode
         * @param {Number} width The width of the thumbnail to fetch
         * @param {Number} height The height of the thumbnail to fetch
         *
         * @return {String}
         */
        Vignette.getThumbURL = function (url, mode, width, height) {
            var urlParameters;
            // for now we handle only legacy urls as input
            if (this.isLegacyUrl(url)) {
                urlParameters = this.getParametersFromLegacyUrl(url);
                url = this.createThumbnailUrl(urlParameters, mode, width, height);
            }
            return url;
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
         * Removes the thumbnail options part from a thumbnail URL
         *
         * @private
         *
         * @param {String} url The URL of a thumbnail
         *
         * @return {String} The URL without the thumbnail options
         */
        Vignette.clearThumbOptions = function (url) {
            var clearedOptionsUrl;
            if (this.isThumbnailerUrl(url)) {
                clearedOptionsUrl = url.replace(this.thumbBasePathRegExp, '$1');
            }
            else {
                //The URL of a legacy thumbnail is in the following format:
                //http://domain/image_path/image.ext/thumbnail_options.ext
                //so return the URL till the last / to remove the options
                clearedOptionsUrl = url.substring(0, url.lastIndexOf('/'));
            }
            return clearedOptionsUrl;
        };
        /**
         * Checks if a string is bucket prefix
         *
         * @param {String} segment
         * @returns {boolean}
         */
        Vignette.isPrefix = function (segment) {
            return ['images', 'avatars'].indexOf(segment) === -1;
        };
        Vignette.getDomain = function (fullLegacyDomain) {
            return fullLegacyDomain.match(/(wikia-dev.com|wikia.nocookie.net)/)[1];
        };
        /**
         * Parses legacy image URL and returns object with URL parameters
         *
         * @private
         *
         * @param {String} url
         *
         * @return {ImageUrlParameters}
         */
        Vignette.getParametersFromLegacyUrl = function (url) {
            var segments = url.split('/'), prefix = [], bucket = [], result = {}, nextSegment;
            // Remove protocol
            segments.splice(0, 2);
            result.domain = this.getDomain(segments.shift());
            result.cacheBuster = segments.shift().substr(4);
            if (segments.indexOf('thumb') > -1) {
                segments = segments.filter(function (segment) {
                    return segment !== 'thumb';
                });
                segments.pop();
            }
            // Last three segments are the image path
            result.imagePath = segments.splice(-3, 3).join('/');
            // First and last segments form the bucket name
            result.wikiaBucket = [segments.shift(), segments.pop()].join('/');
            // The remaining segments are prefix
            result.pathPrefix = segments.join('/');
            return result;
        };
        /*
            Idea:
            - check for thumb if present remove the last param and thumb;
            -
         */
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
        Vignette.createThumbnailUrl = function (urlParameters, mode, width, height) {
            var url;
            url = [
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
        };
        Vignette.imagePathRegExp = /\/\/vignette\d?\.wikia/;
        Vignette.thumbBasePathRegExp = /(.*\/revision\/\w+).*/;
        Vignette.legacyThumbPathRegExp = /\/\w+\/thumb\//;
        Vignette.legacyPathRegExp = /(wikia-dev.com|wikia.nocookie.net)\/__cb[\d]+\/.*$/;
        Vignette.mode = {
            fixedAspectRatio: 'fixed-aspect-ratio',
            fixedAspectRatioDown: 'fixed-aspect-ratio-down',
            thumbnail: 'thumbnail',
            thumbnailDown: 'thumbnail-down',
            topCrop: 'top-crop',
            topCropDown: 'top-crop-down',
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
