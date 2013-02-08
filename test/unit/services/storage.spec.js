//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing service $storage ", function() {

    beforeEach(angular.mock.module('App'));

        it('should contain a $storage service', inject(function($storage) {
            expect($storage).to.be.ok;
        }));

        it('should have functions to load a tree', inject(function($storage) {
            expect($storage.loadTree).to.be.ok;
            expect($storage._onLoadSucceed).to.be.ok;
            expect($storage._onLoadFailed).to.be.ok;
            expect($storage._extendTree).to.be.ok;
        }));

        it('should have functions to save a tree', inject(function($storage) {
            expect($storage.saveTree).to.be.ok;
            expect($storage._saveTree).to.be.ok;
            expect($storage._flattenTree).to.be.ok;
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

        describe(": extend a tree ", function() {

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
                expect(root).to.be.ok;
                expect(root).to.be.an('object');
                expect(root.nodes.length).to.equal(3);
            });

            it('should have a city', function() {
                city = root.node(0);
                expect(city).to.be.ok;
                expect(city).to.be.an('object');
                expect(city.nodes.length).to.equal(1);
            });

            it('should have a people', function() {
                people = root.node(1);
                expect(people).to.be.ok;
                expect(people).to.be.an('object');
            });

            it('should have a food', function() {
                food = root.node(2);
                expect(food).to.be.ok;
                expect(food).to.be.an('object');
            });

            it('should have a paris', function() {
                paris = city.node(0);
                expect(paris).to.be.ok;
                expect(paris).to.be.an('object');
            });

            it('expects root to be complete', function() {
                expect("parent" in root).to.be.true;
                expect("label" in root).to.be.true;
                expect("weight" in root).to.be.true;
                expect("opened" in root).to.be.true;
                expect("index" in root).to.be.true;
                expect("bgcolor" in root).to.be.true;
                expect("hueRange" in root).to.be.true;
                expect("labelElement" in root).to.be.true;
            });

            it('expects city to be complete', function() {
                expect("parent" in city).to.be.true;
                expect("label" in city).to.be.true;
                expect("weight" in city).to.be.true;
                expect("opened" in city).to.be.true;
                expect("index" in city).to.be.true;
                expect("bgcolor" in city).to.be.true;
                expect("hueRange" in city).to.be.true;
                expect("labelElement" in city).to.be.true;
            });

            it('expects paris to be complete', function() {
                expect("parent" in paris).to.be.true;
                expect("label" in paris).to.be.true;
                expect("weight" in paris).to.be.true;
                expect("opened" in paris).to.be.true;
                expect("index" in paris).to.be.true;
                expect("bgcolor" in paris).to.be.true;
                expect("hueRange" in paris).to.be.true;
                expect("labelElement" in paris).to.be.true;
            });

            it('expects people to be complete', function() {
                expect("parent" in people).to.be.true;
                expect("label" in people).to.be.true;
                expect("weight" in people).to.be.true;
                expect("opened" in people).to.be.true;
                expect("index" in people).to.be.true;
                expect("bgcolor" in people).to.be.true;
                expect("hueRange" in people).to.be.true;
                expect("labelElement" in people).to.be.true;
            });

            it('expects food to be complete', function() {
                expect("parent" in food).to.be.true;
                expect("label" in food).to.be.true;
                expect("weight" in food).to.be.true;
                expect("opened" in food).to.be.true;
                expect("index" in food).to.be.true;
                expect("bgcolor" in food).to.be.true;
                expect("hueRange" in food).to.be.true;
                expect("labelElement" in food).to.be.true;
            });

            if('expects root values to be ok ', function() {
                // static tests
                // expect the copy to be OK
                // test root
                expect(root.parent).to.equal(null);
                expect(root.label).to.equal(jsonObj.label);
                expect(root.weight).to.equal(jsonObj.weight);
                expect(root.opened).to.equal(jsonObj.opened);
                expect(root.index).to.equal(jsonObj.index);
            });

            if('expects city values to be ok ', function() {
                // test City
                expect(city.parent).to.equal(root);
                expect(city.label).to.equal(jsonObj.childNodes[0].label);
                expect(city.weight).to.equal(jsonObj.childNodes[0].weight);
                expect(city.opened).to.equal(jsonObj.childNodes[0].opened);
                expect(city.index).to.equal(jsonObj.index);
            });

            if('expects paris values to be ok ', function() {
                // test Paris
                expect(paris.parent).to.equal(root);
                expect(paris.label).to.equal(jsonObj.childNodes[0].label);
                expect(paris.weight).to.equal(jsonObj.childNodes[0].weight);
                expect(paris.opened).to.equal(jsonObj.childNodes[0].opened);
                expect(paris.index).to.equal(jsonObj.index);
            });

            if('expects people values to be ok ', function() {
                // test People
                expect(people.parent).to.equal(root);
                expect(people.label).to.equal(jsonObj.childNodes[1].label);
                expect(people.weight).to.equal(jsonObj.childNodes[1].weight);
                expect(people.opened).to.equal(jsonObj.childNodes[1].opened);
                expect(people.index).to.equal(jsonObj.index);
            });

            // root & leaves
            it('expects root to be a root', inject(function() {
                expect(root.isRoot()).to.be.true;
            }));

            it('expects root not to be a leaf', inject(function() {
                expect(root.isTerminal()).to.be.false;
            }));

            it('expects City not to be a root', inject(function() {
                expect(city.isRoot()).to.be.false;
            }));

            it('expects City not to be a leaf', inject(function() {
                expect(city.isTerminal()).to.be.false;
            }));

            it('expects People not to be a root', inject(function() {
                expect(people.isRoot()).to.be.false;
            }));

            it('expects People to be a leaf', inject(function() {
                expect(people.isTerminal()).to.be.true;
            }));

            it('expects food not to be a root', inject(function() {
                expect(food.isRoot()).to.be.false;
            }));

            it('expects food to be a leaf', inject(function() {
                expect(food.isTerminal()).to.be.true;
            }));

            it('expects Paris not to be a root', inject(function() {
                expect(paris.isRoot()).to.be.false;
            }));

            it('expects Paris to be a leaf', inject(function() {
                expect(paris.isTerminal()).to.be.true;
            }));


            // paths
            it('expects the path of root to be ok', inject(function() {
                root.path().should.equal('/0');
            }));

            it('expects the path of City to be ok', inject(function() {
                city.path().should.equal('/0/0');
            }));

            it('expects the path of People to be ok', inject(function() {
                people.path().should.equal('/0/1');
            }));

            it('expects the path of Food to be ok', inject(function() {
                food.path().should.equal('/0/2');
            }));

            it('expects the path of Paris to be ok', inject(function() {
                paris.path().should.equal('/0/0/0');
            }));

            // head, tail, previous, next, parent 
            // root
            it("expects the parent of root to be null", inject(function() {
                expect(root.parent).to.be.null;
            }));

            it("expects the head of root to be City", inject(function() {
                expect(root.head()).to.deep.equal(city);
            }));

            it("expects the tail of root to be Food", inject(function() {
                expect(root.tail()).to.deep.equal(food);
            }));

            it("expects the next of root to be null", inject(function() {
                expect(root.next()).to.be.null;
            }));

            it("expects the previous of root to be null", inject(function() {
                expect(root.previous()).to.be.null;
            }));

            // city
            it("expects the parent of city to be root", inject(function() {
                expect(city.parent).to.deep.equal(root);
            }));

            it("expects the head of city to be paris", inject(function() {
                expect(city.head()).to.equal(paris);
            }));

            it("expects the tail of city to be paris", inject(function() {
                expect(city.tail()).to.deep.equal(paris);
            }));

            it("expects the next of city to be people", inject(function() {
                expect(city.next()).to.deep.equal(people);
            }));

            it("expects the previous of city to be null", inject(function() {
                expect(city.previous()).to.be.null;
            }));

            // people
            it("expects the parent of people to be root", inject(function() {
                expect(people.parent).to.deep.equal(root);
            }));

            it("expects the head of people to be null", inject(function() {
                expect(people.head()).to.equal(null);
            }));

            it("expects the tail of people to be null", inject(function() {
                expect(people.tail()).to.deep.equal(null);
            }));

            it("expects the next of people to be food", inject(function() {
                expect(people.next()).to.deep.equal(food);
            }));

            it("expects the previous of people to be city", inject(function() {
                expect(people.previous()).to.deep.equal(city);
            }));

            // food
            it("expects the parent of food to be root", inject(function() {
                expect(food.parent).to.deep.equal(root);
            }));

            it("expects the head of food to be null", inject(function() {
                expect(food.head()).to.equal(null);
            }));

            it("expects the tail of food to be null", inject(function() {
                expect(food.tail()).to.deep.equal(null);
            }));

            it("expects the next of food to be null", inject(function() {
                expect(food.next()).to.equal(null);
            }));

            it("expects the previous of food to be people", inject(function() {
                expect(food.previous()).to.deep.equal(people);
            }));

            // paris
            it("expects the parent of paris to be city", inject(function() {
                expect(paris.parent).to.deep.equal(city);
            }));

            it("expects the head of paris to be null", inject(function() {
                expect(paris.head()).to.equal(null);
            }));

            it("expects the tail of paris to be null", inject(function() {
                expect(paris.tail()).to.deep.equal(null);
            }));

            it("expects the next of paris to be null", inject(function() {
                expect(paris.next()).to.equal(null);
            }));

            it("expects the previous of paris to be null", inject(function() {
                expect(paris.previous()).to.equal(null);
            }));
        });
});