//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing utils ", function() {

    beforeEach(angular.mock.module('App'));

    /* $eventManager Services */

    describe(": $debounce ", function() {

        it('should contain a $debounce service', inject(function($debounce) {
            expect($debounce).toBeTruthy();
        }));

        var fn, spy;

        beforeEach(inject(function($debounce) {
            spy = jasmine.createSpy('debounceSpy');
            fn = function() {
                $debounce(spy(), 5000, false);
            };

            fn();
            fn();
            fn();
            fn();
            fn();
            fn();
        }));

        it("tracks that the spy was called", function() {
            expect(spy).toHaveBeenCalled();
        });

        it("tracks its number of calls", function() {
            expect(spy.calls.length).toEqual(1);
        });

        // todo : complete tests on $eventManager
    });

});