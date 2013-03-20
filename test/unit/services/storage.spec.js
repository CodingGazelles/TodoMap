//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing service $storage, ", function() {

    beforeEach(angular.mock.module('App'));

    it('should contain a $storage service', inject(function($storage) {
        expect($storage).toBeTruthy();
    }));

    it('should have functions to load a tree', inject(function($storage) {
        expect($storage.loadTree).toBeTruthy();
    }));

    it('should have functions to save a tree', inject(function($storage) {
        expect($storage.saveTree).toBeTruthy();
    }));

    it('should have a working $storage service that get the maps', inject(function($storage, $httpBackend) {
        var mapId = "510bf39e5ba1aa4c95000001";
        $httpBackend.expectGET('/api/maps/' + mapId).respond({});

        $storage.loadTree({
            id: mapId
        });
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    if('should have a working $storage service that saves the maps', inject(function($storage, $httpBackend) {
        var mapId = "510bf39e5ba1aa4c95000001";
        var map = {
            "_id": mapId
        };
        $httpBackend.expectPUT('/api/maps/' + mapId);

        $storage.saveMap(map);

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();

    }));

});