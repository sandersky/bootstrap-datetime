define([
    'bootstrap-datetime/main',
], function (
    Picker
) {
    'use strict';

    describe('bootstrap-datetime', function () {
        var picker;

        beforeEach(function () {
            picker = new Picker();
        });

        it('should have public auto method', function () {
            expect(picker.auto).not.toBeUndefined();
        });

        it('should have public bind method', function () {
            expect(picker.bind).not.toBeUndefined();
        });
    });
});
