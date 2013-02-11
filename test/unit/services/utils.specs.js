//
// test/unit/services/servicesSpec.js
//
describe("Unit : ", function() {

    beforeEach(angular.mock.module('App'));

    describe("Testing $debounce : ", function() {

        it('should contain a $debounce service', inject(function($debounce) {
            expect($debounce).toBeTruthy();
        }));

        var fn, ddfn, ddfn, spy, wait;
        var pause = function(ms) {
            console.log("Start pause " + ms + " ms");
            ms += new Date().getTime();
            while(new Date() < ms) {}
            console.log("End pause ");
        };

        beforeEach(inject(function($debounce) {
            wait = 500;
            spy = jasmine.createSpy('debounceSpy');
            fn = function() {
                console.log("Call fn");
                spy();
            };
            dfn = $debounce(fn, wait, false);
            ddfn = function() {
                console.log("Call dfn");
                dfn();
            };

            ddfn();
            ddfn();
            ddfn();
            ddfn();
            ddfn();
            ddfn();

            pause(wait*2);    // pause to let the debounce enought time to trigger fn
        }));

        it("tracks that the spy was called", inject(function($timeout) {
            expect(spy).toHaveBeenCalled();
        }));

        it("tracks its number of calls", inject(function($timeout) {
            expect(spy.calls.length).toEqual(1);
        }));

        // todo : complete tests on $eventManager
    });

});