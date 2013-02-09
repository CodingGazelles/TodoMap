//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing service $storage ", function() {

    beforeEach(angular.mock.module('App'));

    it('should contain a $storage service', inject(function($storage) {
        expect($storage).toBeTruthy();
    }));

    it('should have functions to load a tree', inject(function($storage) {
        expect($storage.loadTree).toBeTruthy();
        expect($storage._onLoadSucceed).toBeTruthy();
        expect($storage._onLoadFailed).toBeTruthy();
        expect($storage._extendTree).toBeTruthy();
    }));

    it('should have functions to save a tree', inject(function($storage) {
        expect($storage.saveTree).toBeTruthy();
        expect($storage._saveTree).toBeTruthy();
        expect($storage._flattenTree).toBeTruthy();
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

    describe(": extend: ", function() {

        var root, city, people, food, paris;

        beforeEach(inject(function($storage) {
            var jsonObj = {
                "label": "root",
                "weight": 100,
                "opened": true,
                "index": 0,
                "childNodes": [{
                    "label": "City",
                    "weight": 32.778,
                    "opened": true,
                    "index": 0,
                    "childNodes": [{
                        "label": "Paris",
                        "weight": 32.778,
                        "opened": true,
                        "index": 0,
                        "childNodes": []
                    }]
                }, {
                    "label": "People",
                    "weight": 38.889,
                    "opened": true,
                    "index": 1,
                    "childNodes": []
                }, {
                    "label": "Food",
                    "weight": 38.889,
                    "opened": true,
                    "index": 2,
                    "childNodes": []
                }]
            };

            root = $storage._extendTree(jsonObj);
        }));

        it('should have a root', function() {
            expect(root).toBeTruthy();
            expect(root).toEqual(jasmine.any(Object));
            expect(root.nodes.length).toEqual(3);
        });

        it('should have a city', function() {
            city = root.node(0);
            expect(city).toBeTruthy();
            expect(city).toEqual(jasmine.any(Object));
            expect(city.nodes.length).toEqual(1);
        });

        it('should have a people', function() {
            people = root.node(1);
            expect(people).toBeTruthy();
            expect(people).toEqual(jasmine.any(Object));
        });

        it('should have a food', function() {
            food = root.node(2);
            expect(food).toBeTruthy();
            expect(food).toEqual(jasmine.any(Object));
        });

        it('should have a paris', function() {
            paris = city.node(0);
            expect(paris).toBeTruthy();
            expect(paris).toEqual(jasmine.any(Object));
        });

        it('expects root to be complete', function() {
            expect("parent" in root).toBe(true);
            expect("label" in root).toBe(true);
            expect("weight" in root).toBe(true);
            expect("opened" in root).toBe(true);
            expect("index" in root).toBe(true);
            expect("bgcolor" in root).toBe(true);
            expect("hueRange" in root).toBe(true);
            expect("labelElement" in root).toBe(true);
        });

        it('expects city to be complete', function() {
            expect("parent" in city).toBe(true);
            expect("label" in city).toBe(true);
            expect("weight" in city).toBe(true);
            expect("opened" in city).toBe(true);
            expect("index" in city).toBe(true);
            expect("bgcolor" in city).toBe(true);
            expect("hueRange" in city).toBe(true);
            expect("labelElement" in city).toBe(true);
        });

        it('expects paris to be complete', function() {
            expect("parent" in paris).toBe(true);
            expect("label" in paris).toBe(true);
            expect("weight" in paris).toBe(true);
            expect("opened" in paris).toBe(true);
            expect("index" in paris).toBe(true);
            expect("bgcolor" in paris).toBe(true);
            expect("hueRange" in paris).toBe(true);
            expect("labelElement" in paris).toBe(true);
        });

        it('expects people to be complete', function() {
            expect("parent" in people).toBe(true);
            expect("label" in people).toBe(true);
            expect("weight" in people).toBe(true);
            expect("opened" in people).toBe(true);
            expect("index" in people).toBe(true);
            expect("bgcolor" in people).toBe(true);
            expect("hueRange" in people).toBe(true);
            expect("labelElement" in people).toBe(true);
        });

        it('expects food to be complete', function() {
            expect("parent" in food).toBe(true);
            expect("label" in food).toBe(true);
            expect("weight" in food).toBe(true);
            expect("opened" in food).toBe(true);
            expect("index" in food).toBe(true);
            expect("bgcolor" in food).toBe(true);
            expect("hueRange" in food).toBe(true);
            expect("labelElement" in food).toBe(true);
        });

        if('expects root values to be ok ', function() {
            // static tests
            // expect the copy to be OK
            // test root
            expect(root.parent).toEqual(null);
            expect(root.label).toEqual(jsonObj.label);
            expect(root.weight).toEqual(jsonObj.weight);
            expect(root.opened).toEqual(jsonObj.opened);
            expect(root.index).toEqual(jsonObj.index);
        });

        if('expects city values to be ok ', function() {
            // test City
            expect(city.parent).toEqual(root);
            expect(city.label).toEqual(jsonObj.childNodes[0].label);
            expect(city.weight).toEqual(jsonObj.childNodes[0].weight);
            expect(city.opened).toEqual(jsonObj.childNodes[0].opened);
            expect(city.index).toEqual(jsonObj.index);
        });

        if('expects paris values to be ok ', function() {
            // test Paris
            expect(paris.parent).toEqual(root);
            expect(paris.label).toEqual(jsonObj.childNodes[0].label);
            expect(paris.weight).toEqual(jsonObj.childNodes[0].weight);
            expect(paris.opened).toEqual(jsonObj.childNodes[0].opened);
            expect(paris.index).toEqual(jsonObj.index);
        });

        if('expects people values to be ok ', function() {
            // test People
            expect(people.parent).toEqual(root);
            expect(people.label).toEqual(jsonObj.childNodes[1].label);
            expect(people.weight).toEqual(jsonObj.childNodes[1].weight);
            expect(people.opened).toEqual(jsonObj.childNodes[1].opened);
            expect(people.index).toEqual(jsonObj.index);
        });

        // root & leaves
        it('expects root to be a root', function() {
            expect(root.isRoot()).toBe(true);
        });

        it('expects root not to be a leaf', function() {
            expect(root.isTerminal()).toBe(false);
        });

        it('expects City not to be a root', function() {
            expect(city.isRoot()).toBe(false);
        });

        it('expects City not to be a leaf', function() {
            expect(city.isTerminal()).toBe(false);
        });

        it('expects People not to be a root', function() {
            expect(people.isRoot()).toBe(false);
        });

        it('expects People to be a leaf', function() {
            expect(people.isTerminal()).toBe(true);
        });

        it('expects food not to be a root', function() {
            expect(food.isRoot()).toBe(false);
        });

        it('expects food to be a leaf', function() {
            expect(food.isTerminal()).toBe(true);
        });

        it('expects Paris not to be a root', function() {
            expect(paris.isRoot()).toBe(false);
        });

        it('expects Paris to be a leaf', function() {
            expect(paris.isTerminal()).toBe(true);
        });

        // paths
        it('expects the path of root to be ok', function() {
            expect(root.path()).toEqual('/0');
        });

        // it('expects city to be still ok', function(){
        //     expect(city).toBeTruthy();
        // });

        it('expects the path of City to be ok', function() {
            expect(city.path()).toEqual('/0/0');
        });

        it('expects the path of People to be ok', function() {
            expect(people.path()).toEqual('/0/1');
        });

        it('expects the path of Food to be ok', function() {
            expect(food.path()).toEqual('/0/2');
        });

        it('expects the path of Paris to be ok', function() {
            expect(paris.path()).toEqual('/0/0/0');
        });

        // head, tail, previous, next, parent 
        // root
        it("expects the parent of root to be null", function() {
            expect(root.parent).toBeNull();
        });

        it("expects the head of root to be City", function() {
            expect(root.head()).toEqual(city);
        });

        it("expects the tail of root to be Food", function() {
            expect(root.tail()).toEqual(food);
        });

        it("expects the next of root to be null", function() {
            expect(root.next()).toBeNull();
        });

        it("expects the previous of root to be null", function() {
            expect(root.previous()).toBeNull();
        });

        // city
        it("expects the parent of city to be root", function() {
            expect(city.parent).toEqual(root);
        });

        it("expects the head of city to be paris", function() {
            expect(city.head()).toEqual(paris);
        });

        it("expects the tail of city to be paris", function() {
            expect(city.tail()).toEqual(paris);
        });

        it("expects the next of city to be people", function() {
            expect(city.next()).toEqual(people);
        });

        it("expects the previous of city to be null", function() {
            expect(city.previous()).toBeNull();
        });

        // people
        it("expects the parent of people to be root", function() {
            expect(people.parent).toEqual(root);
        });

        it("expects the head of people to be null", function() {
            expect(people.head()).toEqual(null);
        });

        it("expects the tail of people to be null", function() {
            expect(people.tail()).toEqual(null);
        });

        it("expects the next of people to be food", function() {
            expect(people.next()).toEqual(food);
        });

        it("expects the previous of people to be city", function() {
            expect(people.previous()).toEqual(city);
        });

        // food
        it("expects the parent of food to be root", function() {
            expect(food.parent).toEqual(root);
        });

        it("expects the head of food to be null", function() {
            expect(food.head()).toEqual(null);
        });

        it("expects the tail of food to be null", function() {
            expect(food.tail()).toEqual(null);
        });

        it("expects the next of food to be null", function() {
            expect(food.next()).toEqual(null);
        });

        it("expects the previous of food to be people", function() {
            expect(food.previous()).toEqual(people);
        });

        // paris
        it("expects the parent of paris to be city", function() {
            expect(paris.parent).toEqual(city);
        });

        it("expects the head of paris to be null", function() {
            expect(paris.head()).toEqual(null);
        });

        it("expects the tail of paris to be null", function() {
            expect(paris.tail()).toEqual(null);
        });

        it("expects the next of paris to be null", function() {
            expect(paris.next()).toEqual(null);
        });

        it("expects the previous of paris to be null", function() {
            expect(paris.previous()).toEqual(null);
        });
    });
});