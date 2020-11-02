export interface ImageUrlParameters {
    domain: string;
    cacheBuster: string;
    wikiaBucket: string;
    pathPrefix: string;
    imagePath: string;
}
export interface ThumbnailOptions {
    frame?: number;
    height?: number;
    mode?: string;
    width?: number;
    xOffset1?: number;
    xOffset2?: number;
    yOffset1?: number;
    yOffset2?: number;
}
export default class Vignette {
    private static imagePathRegExp;
    private static domainRegExp;
    private static legacyPathRegExp;
    private static onlyUUIDRegExp;
    static mode: any;
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
     * @param {Number} options.height (Optional) The height of the thumbnail to fetch
     * @param {Number} options.xOffset1 (Optional) x-offset for some modes
     * @param {Number} options.xOffset2 (Optional) x-offset for some modes
     * @param {Number} options.yOffset1 (Optional) y-offset for some modes
     * @param {Number} options.yOffset2 (Optional) y-offset for some modes
     * @param {Number} options.frame (Optional) Frame number for an animated GIF
     *
     * @return {String}
     */
    static getThumbURL(url: string, options: ThumbnailOptions): string;
    /**
     * Verifies required and mode-specific thumbnail options
     *
     * @private
     *
     * @param {object} options
     * @throws {Error} when a required parameter is missing
     *
     * @return {void}
     */
    private static verifyThumbnailOptions(options);
    /**
     * Checks if url points to thumbnailer
     *
     * @public
     *
     * @param {String} url
     *
     * @return {Boolean}
     */
    private static isThumbnailerUrl(url?);
    /**
     * Checks if url points to new Vignette
     *
     * @private
     *
     * @param {String} url
     *
     * @return {Boolean}
     */
    private static isUUIDOnlyUrl(url?);
    /**
     * Checks if url points to legacy image URL
     *
     * @private
     *
     * @param {String} url
     *
     * @return {Boolean}
     */
    private static isLegacyUrl(url?);
    /**
     * Gets base domain from url's domain
     *
     * @param {String} fullLegacyDomain
     *
     * @returns {String}
     */
    private static getBaseDomain(fullLegacyDomain?);
    /**
     * Clear thumb segments from legacy url segments
     *
     * @param {String[]} urlSegments
     *
     * @returns {String[]}
     */
    private static clearLegacyThumbSegments(urlSegments);
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
    private static getParametersFromLegacyUrl(url);
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
    private static createThumbnailUrl(urlParameters, options);
    /**
     * Constructs complete thumbnailer url for UUID based links
     *
     * @private
     *
     * @param {string} baseUrl
     * @param {object} options
     *
     * @return {String}
     */
    private static createUUIDBasedThumbnailUrl(baseUrl, options);
    /**
     * Updates a Vignette URL with the given options. May be used to strip all options
     * from a URL and return the full-size image, if no options are passed in.
     *
     * @private
     *
     * @param {String} currentUrl
     * @param {object} options
     *
     * @returns {String}
     */
    private static updateThumbnailUrl(currentUrl, options);
    /**
     * Gets thumbnail mode parameters as an appendable string
     *
     * @private
     *
     * @param {object} options
     *
     * @returns {String}
     */
    private static getModeParameters(options);
}
