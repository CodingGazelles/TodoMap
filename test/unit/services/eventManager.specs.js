//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing service $eventManager ", function() {

    beforeEach(angular.mock.module('App'));

    /* $eventManager Services */

    it('should contain an $eventManager service', inject(function($eventManager) {
        expect($eventManager).not.toBeNull();
        expect($eventManager).not.toBeUndefined();
    }));

    // todo : complete tests on $eventManager
});