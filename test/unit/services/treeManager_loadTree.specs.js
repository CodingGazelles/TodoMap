//
// test/unit/services/servicesSpec.js
//
describe("Unit Testing/ $treeManager/", function() {

    beforeEach(angular.mock.module('App'));

    it('should contain a $treeManager service', inject(function($treeManager) {
        expect($treeManager).toBeTruthy();
    }));

    describe("load tree/", function(){
        it('should have functions to load a tree', inject(function($treeManager) {
            expect($treeManager.loadTree).toBeTruthy();
        }));

        it('should have a working $treeManager service that get the maps', inject(function($treeManager, $httpBackend) {
            var mapId = "510bf39e5ba1aa4c95000001";
            $httpBackend.expectGET('/api/maps/' + mapId).respond({});

            $treeManager.loadTree({
                id: mapId
            });
            $httpBackend.flush();

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));
    });

    describe("save tree/", function(){
        it('should have functions to save a tree', inject(function($treeManager) {
            expect($treeManager.saveTree).toBeTruthy();
        }));

        if('should have a working $treeManager service that saves the maps', inject(function($treeManager, $httpBackend) {
            var mapId = "510bf39e5ba1aa4c95000001";
            var map = {
                "_id": mapId
            };
            $httpBackend.expectPUT('/api/maps/' + mapId);

            $treeManager.saveMap(map);

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();

        }));
    });

    describe("init tree/", function() {

        var root, city, people, food, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "header": "root",
                "weight": 100,
                "index": 0,
                "nodes": [{
                    "header": "City",
                    "weight": 32.778,
                    "index": 0,
                    "nodes": [{
                        "header": "Paris",
                        "weight": 100,
                        "index": 0,
                        "nodes": []
                    }]
                }, {
                    "header": "People",
                    "weight": 38.889,
                    "index": 1,
                    "nodes": []
                }, {
                    "header": "Food",
                    "weight": 28.333,
                    "index": 2,
                    "nodes": []
                }]
            };

            $treeManager.initTree(jsonObj);
        }));

        it('expects $treeManager to have a _tree property', inject(function($treeManager){
            expect($treeManager._tree).toBeTruthy();
            expect($treeManager._tree).toEqual(jasmine.any(Object));
        }));

        it('should have a root', inject(function($treeManager) {
            root = $treeManager._tree;
            expect(root.nodes.length).toEqual(3);
        }));

        it('should have a city', inject(function($treeManager) {
            root = $treeManager._tree;
            city = root.node(0);
            expect(city).toBeTruthy();
            expect(city).toEqual(jasmine.any(Object));
            expect(city.nodes.length).toEqual(1);
        }));

        it('should have a people', inject(function($treeManager) {
            root = $treeManager._tree;
            people = root.node(1);
            expect(people).toBeTruthy();
            expect(people).toEqual(jasmine.any(Object));
        }));

        it('should have a food', inject(function($treeManager) {
            root = $treeManager._tree;
            food = root.node(2);
            expect(food).toBeTruthy();
            expect(food).toEqual(jasmine.any(Object));
        }));

        it('should have a paris', inject(function($treeManager) {
            root = $treeManager._tree;
            city = root.node(0);
            paris = city.node(0);
            expect(paris).toBeTruthy();
            expect(paris).toEqual(jasmine.any(Object));
        })); 
    });

    describe("change prototype/", function(){

        // need to complete this set of tests: test persistant and extended properties
        // also test removal of superfluous properties

        var root, city, people, food, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "header": "root",
                "weight": 100,
                "index": 0,
                "nodes": [{
                    "header": "City",
                    "weight": 32.778,
                    "index": 0,
                    "nodes": [{
                        "header": "Paris",
                        "weight": 100,
                        "index": 0,
                        "nodes": []
                    }]
                }, {
                    "header": "People",
                    "weight": 38.889,
                    "index": 1,
                    "nodes": []
                }, {
                    "header": "Food",
                    "weight": 28.333,
                    "index": 2,
                    "nodes": []
                }]
            };

            $treeManager.initTree(jsonObj);
            root = $treeManager._tree;
        }));

        it('expects root to be complete', function() {
            expect("parent" in root).toBe(true);
            expect("header" in root).toBe(true);
            expect("weight" in root).toBe(true);
            expect("index" in root).toBe(true);
            expect("bgcolor" in root).toBe(true);
            expect("hueRange" in root).toBe(true);
            expect("labelElement" in root).toBe(true);
        });

        it('expects city to be complete', function() {
            city = root.node(0);
            expect("parent" in city).toBe(true);
            expect("header" in city).toBe(true);
            expect("weight" in city).toBe(true);
            expect("index" in city).toBe(true);
            expect("bgcolor" in city).toBe(true);
            expect("hueRange" in city).toBe(true);
            expect("labelElement" in city).toBe(true);
        });

        it('expects paris to be complete', function() {
            city = root.node(0);
            paris = city.node(0);
            expect("parent" in paris).toBe(true);
            expect("header" in paris).toBe(true);
            expect("weight" in paris).toBe(true);
            expect("index" in paris).toBe(true);
            expect("bgcolor" in paris).toBe(true);
            expect("hueRange" in paris).toBe(true);
            expect("labelElement" in paris).toBe(true);
        });

        it('expects people to be complete', function() {
            people = root.node(1);
            expect("parent" in people).toBe(true);
            expect("header" in people).toBe(true);
            expect("weight" in people).toBe(true);
            expect("index" in people).toBe(true);
            expect("bgcolor" in people).toBe(true);
            expect("hueRange" in people).toBe(true);
            expect("labelElement" in people).toBe(true);
        });

        it('expects food to be complete', function() {
            food = root.node(2);
            expect("parent" in food).toBe(true);
            expect("header" in food).toBe(true);
            expect("weight" in food).toBe(true);
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
            expect(root.label).toEqual("root");
            expect(root.weight).toEqual(100);
            expect(root.opened).toEqual(true);
            expect(root.index).toEqual(0);
        });

        if('expects city values to be ok ', function() {
            // test City
            expect(city.parent).toEqual(root);
            expect(city.label).toEqual("City");
            expect(city.weight).toEqual(32.778);
            expect(city.opened).toEqual(true);
            expect(city.index).toEqual(0);
        });

        if('expects paris values to be ok ', function() {
            // test Paris
            expect(paris.parent).toEqual(root);
            expect(paris.label).toEqual("Paris");
            expect(paris.weight).toEqual(100);
            expect(paris.opened).toEqual(true);
            expect(paris.index).toEqual(0);
        });

        if('expects people values to be ok ', function() {
            // test People
            expect(people.parent).toEqual(root);
            expect(people.label).toEqual("People");
            expect(people.weight).toEqual(38.889);
            expect(people.opened).toEqual(true);
            expect(people.index).toEqual(1);
        });
    });

    describe("node array/", function(){

        var root, city, people, food, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "header": "root",
                "weight": 100,
                "index": 0,
                "nodes": [{
                    "header": "City",
                    "weight": 32.778,
                    "index": 0,
                    "nodes": [{
                        "header": "Paris",
                        "weight": 100,
                        "index": 0,
                        "nodes": []
                    }]
                }, {
                    "header": "People",
                    "weight": 38.889,
                    "index": 1,
                    "nodes": []
                }, {
                    "header": "Food",
                    "weight": 28.333,
                    "index": 2,
                    "nodes": []
                }]
            };

            $treeManager.initTree(jsonObj);
        }));

        it('expects $treeManager to have a nodeArray property', inject(function($treeManager){
            expect($treeManager._nodeArray).toBeTruthy();
            expect($treeManager._nodeArray).toEqual(jasmine.any(Array));
        }));

        it('expects nodeArray length to be 5', inject(function($treeManager){
            expect($treeManager._nodeArray.length).toEqual(5);
        }));

        it('expects node 0 to be root', inject(function($treeManager){
            root = $treeManager._tree;
            expect($treeManager._nodeArray[0]).toEqual(root);
        }));

        it('expects node 1 to be city', inject(function($treeManager){
            root = $treeManager._tree;
            city = root.node(0);
            expect($treeManager._nodeArray[1]).toEqual(city);
        }));

        it('expects node 2 to be paris', inject(function($treeManager){
            root = $treeManager._tree;
            city = root.node(0);
            paris = city.node(0);
            expect($treeManager._nodeArray[2]).toEqual(paris);
        }));

        it('expects node 3 to be people', inject(function($treeManager){
            root = $treeManager._tree;
            people = root.node(1);
            expect($treeManager._nodeArray[3]).toEqual(people);
        }));

        it('expects node 4 to be food', inject(function($treeManager){
            root = $treeManager._tree;
            food = root.node(2);
            expect($treeManager._nodeArray[4]).toEqual(food);
        }));
    });

    describe("tree index/", function(){

        var root, city, people, food, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "header": "root",
                "weight": 100,
                "index": 0,
                "nodes": [{
                    "header": "City",
                    "weight": 32.778,
                    "index": 0,
                    "nodes": [{
                        "header": "Paris",
                        "weight": 100,
                        "index": 0,
                        "nodes": []
                    }]
                }, {
                    "header": "People",
                    "weight": 38.889,
                    "index": 1,
                    "nodes": []
                }, {
                    "header": "Food",
                    "weight": 28.333,
                    "index": 2,
                    "nodes": []
                }]
            };

            $treeManager.initTree(jsonObj);
        }));

        it('expects root to have treeIndex 0', inject(function($treeManager){
            root = $treeManager._tree;
            expect(root.treeIndex).toEqual(0);
        }));

        it('expects city to have treeIndex 1', inject(function($treeManager){
            root = $treeManager._tree;
            city = root.node(0);
            expect(city.treeIndex).toEqual(1);
        }));

        it('expects paris to have treeIndex 2', inject(function($treeManager){
            root = $treeManager._tree;
            city = root.node(0);
            paris = city.node(0);
            expect(paris.treeIndex).toEqual(2);
        }));

        it('expects people to have treeIndex 3', inject(function($treeManager){
            root = $treeManager._tree;
            people = root.node(1);
            expect(people.treeIndex).toEqual(3);
        }));

        it('expects food to have treeIndex 4', inject(function($treeManager){
            root = $treeManager._tree;
            food = root.node(2);
            expect(food.treeIndex).toEqual(4);
        }));
    });

    describe("tree weight/", function(){

        var root, city, people, food, paris, londres, madrid;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "header": "root",
                "weight": 100,
                "index": 0,
                "nodes": [{
                    "header": "City",
                    "weight": 32.778,
                    "index": 0,
                    "nodes": [{
                        "header": "Paris",
                        "weight": 33,
                        "index": 0,
                        "nodes": []
                    },{
                        "header": "Londres",
                        "weight": 22,
                        "index": 0,
                        "nodes": []
                    },{
                        "header": "Madrid",
                        "weight": 45,
                        "index": 0,
                        "nodes": []
                    }]
                }, {
                    "header": "People",
                    "weight": 38.889,
                    "index": 1,
                    "nodes": []
                }, {
                    "header": "Food",
                    "weight": 28.333,
                    "index": 2,
                    "nodes": []
                }]
            };

            $treeManager.initTree(jsonObj);
        }));

        it('expects root to have treeWeight of 100', inject(function($treeManager){
            root = $treeManager._tree;
            expect(root.treeWeight).toEqual(100);
        }));

        it('expects city to have treeWeight of 32.778', inject(function($treeManager){
            root = $treeManager._tree;
            city = root.node(0);
            expect(city.treeWeight).toEqual(32.778);
        }));

        it('expects paris treeWeight to equal  10,817', inject(function($treeManager){
            root = $treeManager._tree;
            city = root.node(0);
            paris = city.node(0);
            expect(paris.treeWeight).toEqual(32.778*33/100);
        }));

        it('expects londres treeWeight to equal 7,211', inject(function($treeManager){
            root = $treeManager._tree;
            city = root.node(0);
            london = city.node(1);
            expect(london.treeWeight).toEqual(32.778*22/100);
        }));

        it('expects madrid treeWeight to equal 14,750', inject(function($treeManager){
            root = $treeManager._tree;
            city = root.node(0);
            madrid = city.node(2);
            expect(madrid.treeWeight).toEqual(32.778*45/100);
        }));

        it('expects people to have treeWeight of 38.889', inject(function($treeManager){
            root = $treeManager._tree;
            people = root.node(1);
            expect(people.treeWeight).toEqual(38.889);
        }));

        it('expects food to have treeIndex of 28.333', inject(function($treeManager){
            root = $treeManager._tree;
            food = root.node(2);
            expect(food.treeWeight).toEqual(28.333);
        }));
    });
    
    describe("walking throught/", function() {

        var root, city, people, food, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "label": "root",
                "weight": 100,
                "opened": true,
                "index": 0,
                "nodes": [{
                    "label": "City",
                    "weight": 32.778,
                    "opened": true,
                    "index": 0,
                    "nodes": [{
                        "label": "Paris",
                        "weight": 100,
                        "opened": true,
                        "index": 0,
                        "nodes": []
                    }]
                }, {
                    "label": "People",
                    "weight": 38.889,
                    "opened": true,
                    "index": 1,
                    "nodes": []
                }, {
                    "label": "Food",
                    "weight": 28.333,
                    "opened": true,
                    "index": 2,
                    "nodes": []
                }]
            };

            $treeManager.initTree(jsonObj);
            root = $treeManager._tree;
            city = root.node(0);
            people = root.node(1);
            food = root.node(2);
            paris = city.node(0);
        }));
        
        describe("root & leaves/", function(){

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
        });

        describe("paths/", function(){
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
        });
        
        // head, tail, parent 
        describe("head, tail and parent/", function(){
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
        });
        
        describe("previous & next sibling/", function(){
            // root
            it("expects the next sibling of root to be null", inject(function($treeManager) {
                expect($treeManager.getNextSiblingNode(root)).toBeNull();
            }));

            it("expects the previous sibling of root to be null", inject(function($treeManager) {
                expect($treeManager.getPreviousSiblingNode(root)).toBeNull();
            }));

            // city
            it("expects the next sibling of city to be People", inject(function($treeManager) {
                expect($treeManager.getNextSiblingNode(city)).toEqual(people);
            }));

            it("expects the previous sibling of city to be null", inject(function($treeManager) {
                expect($treeManager.getPreviousSiblingNode(city)).toBeNull();
            }));

            // people
            it("expects the next sibling of people to be Food", inject(function($treeManager) {
                expect($treeManager.getNextSiblingNode(people)).toEqual(food);
            }));

            it("expects the previous sibling of people to be city", inject(function($treeManager) {
                expect($treeManager.getPreviousSiblingNode(people)).toEqual(city);
            }));

            // food
            it("expects the next sibling of food to be null", inject(function($treeManager) {
                expect($treeManager.getNextSiblingNode(food)).toBeNull();
            }));

            it("expects the previous sibling of food to be people", inject(function($treeManager) {
                expect($treeManager.getPreviousSiblingNode(food)).toEqual(people);
            }));

            // paris
            it("expects the next sibling of paris to be null", inject(function($treeManager) {
                expect($treeManager.getNextSiblingNode(paris)).toBeNull();
            }));

            it("expects the previous sibling of paris to be null", inject(function($treeManager) {
                expect($treeManager.getPreviousSiblingNode(paris)).toBeNull();
            }));
        });

        describe("next node/", function(){
            // root
            it("expects the next node of root to be city", inject(function($treeManager) {
                expect($treeManager.getNextNode(root)).toEqual(city);
            }));

            // city
            it("expects the next node of city to be paris", inject(function($treeManager) {
                expect($treeManager.getNextNode(city)).toEqual(paris);
            }));

            // paris
            it("expects the next node of paris to be people", inject(function($treeManager) {
                expect($treeManager.getNextNode(paris)).toEqual(people);
            }));

            // people
            it("expects the next node of people to be food", inject(function($treeManager) {
                expect($treeManager.getNextNode(people)).toEqual(food);
            }));

            // food
            it("expects the next node of food to be root", inject(function($treeManager) {
                expect($treeManager.getNextNode(food)).toEqual(root);
            }));
        });

        describe("previous node/", function(){
            // root
            it("expects the previous node of root to be food", inject(function($treeManager) {
                expect($treeManager.getPreviousNode(root)).toEqual(food);
            }));

            // food
            it("expects the previous node of food to be people", inject(function($treeManager) {
                expect($treeManager.getPreviousNode(food)).toEqual(people);
            }));

            // people
            it("expects the previous node of people to be paris", inject(function($treeManager) {
                expect($treeManager.getPreviousNode(people)).toEqual(paris);
            }));

            // paris
            it("expects the previous node of paris to be city", inject(function($treeManager) {
                expect($treeManager.getPreviousNode(paris)).toEqual(city);
            }));

            // city
            it("expects the previous node of city to be root", inject(function($treeManager) {
                expect($treeManager.getPreviousNode(city)).toEqual(root);
            }));
        });
    });
});