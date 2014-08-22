define([
    'bootstrap-datetime/base-view',
], function (
    BaseView
) {
    'use strict';

    describe('BaseView', function () {
        var baseView;

        beforeEach(function () {
            baseView = new BaseView();
        });

        it('should have body contents', function () {
            expect(baseView.bodyContents).not.toBeUndefined();
        });

        it('should have a footer button', function () {
            expect(baseView.footerButton).not.toBeUndefined();
        });

        it('should have an icon', function () {
            expect(baseView.icon).not.toBeUndefined();
        });

        it('should have title contents', function () {
            expect(baseView.titleContents).not.toBeUndefined();
        });

        it('should have a public update method', function () {
            expect(baseView.update).not.toBeUndefined();
        });
    });
});
