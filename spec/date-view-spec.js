define([
    'bootstrap-datetime/date-view',
], function (
    DateView
) {
    'use strict';

    describe('DateView', function () {
        var dateView;

        beforeEach(function () {
            dateView = new DateView();
        });

        it('should have body contents', function () {
            expect(dateView.bodyContents).not.toBeUndefined();
        });

        it('should have a footer button', function () {
            expect(dateView.footerButton).not.toBeUndefined();
        });

        it('should have an icon', function () {
            expect(dateView.icon).not.toBeUndefined();
        });

        it('should have title contents', function () {
            expect(dateView.titleContents).not.toBeUndefined();
        });

        it('should have a public update method', function () {
            expect(dateView.update).not.toBeUndefined();
        });
    });
});
