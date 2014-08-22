define([
    'bootstrap-datetime/time-view',
], function (
    TimeView
) {
    'use strict';

    describe('TimeView', function () {
        var timeView;

        beforeEach(function () {
            timeView = new TimeView();
        });

        it('should have body contents', function () {
            expect(timeView.bodyContents).not.toBeUndefined();
        });

        it('should have a footer button', function () {
            expect(timeView.footerButton).not.toBeUndefined();
        });

        it('should have an icon', function () {
            expect(timeView.icon).not.toBeUndefined();
        });

        it('should have title contents', function () {
            expect(timeView.titleContents).not.toBeUndefined();
        });

        it('should have a public update method', function () {
            expect(timeView.update).not.toBeUndefined();
        });
    });
});
