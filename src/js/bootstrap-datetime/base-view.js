/**
 * @module BaseView
 * @returns {BaseView} base view class that defines necessary view methods
 */
define([], function () {
    'use strict';

    function BaseView(updateCallback) {
        // Default icon should be a circle with a slash through it
        // Objects that extend this object should override the icon to something relevant
        this.icon = 'ban-circle';
        this.closeOnUpdate = true;
        this.updateCallback = updateCallback;

        // Objects that extend this object should implement the following:
        this.bodyContents = null;
        this.bodyDataId = null;
        this.footerButton = null;
        this.titleContents = null;
    }

    BaseView.prototype.update = function (datetime) {
        this.current = datetime;
    };

    return BaseView;
});
