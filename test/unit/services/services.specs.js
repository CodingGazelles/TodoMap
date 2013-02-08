//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing utils ", function() {

    beforeEach(angular.mock.module('App'));

    /* $eventManager Services */

    describe(": $debounce ", function() {

        it('should contain a $debounce service', inject(function($debounce) {
            expect($debounce).to.ok;
        }));

        // todo : complete tests on $eventManager
    });

});