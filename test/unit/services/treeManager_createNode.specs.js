//
// test/unit/services/servicesSpec.js
//
describe("Unit Testing/ $treeManager/", function() {

    beforeEach(angular.mock.module('App'));

    it('should contain a $treeManager service', inject(function($treeManager) {
        expect($treeManager).toBeTruthy();
    }));

    it('should have functions to create a sibling node', inject(function($treeManager) {
        expect($treeManager.createSibling).toBeTruthy();
    }));

    describe("Create a sibling of root/", function() {

        var root, city, people, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "header": "root",
                "index": 0,
                "weight": 100,
                "nodes": [{
                    "header": "City",
                    "index": 0,
                    "weight": 70,
                    "nodes": [{
                        "header": "Paris",
                        "index": 0,
                        "weight": 100,
                        "nodes": []
                    }]
                }, {
                    "header": "People",
                    "index": 1,
                    "weight": 30,
                    "nodes": []
                }]
            };

            $treeManager.initTree(jsonObj);
            root = $treeManager._tree;
            city = root.nodes[0];
            paris = city.node(0);
            people = root.nodes[1];
        }));

        it("should be impossible to create a sibling to root", inject(function($treeManager) {
            expect((function() {
                $treeManager.createSibling(root)
            })).toThrow();
        }));

        it("should be really impossible to create a sibling to root", inject(function($treeManager) {
            try {
                $treeManager.createSibling(root)
            } catch(e) {
                //nothing
            }
            expect($treeManager.getNextSiblingNode(root)).toBeNull();
        }));
    });

    describe("Create a sibling of city/", function() {

        var root, city, people, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "header": "root",
                "index": 0,
                "weight": 100,
                "nodes": [{
                    "header": "City",
                    "index": 0,
                    "weight": 70,
                    "nodes": [{
                        "header": "Paris",
                        "index": 0,
                        "weight": 100,
                        "nodes": []
                    }]
                }, {
                    "header": "People",
                    "index": 1,
                    "weight": 30,
                    "nodes": []
                }]
            };

            $treeManager.initTree(jsonObj);
            root = $treeManager._tree;
            city = root.nodes[0];
            paris = city.node(0);
            people = root.nodes[1];
        }));

        var sibling;

        it("should be possible to create a sibling of city", inject(function($treeManager) {
            expect((function() {
                $treeManager.createSibling(city);
            })).not.toThrow();
        }));

        beforeEach(inject(function($treeManager) {
            sibling = $treeManager.createSibling(city);
        }));

        it("expects the sibling of city to be thruthy", inject(function($treeManager) {
            // sibling = $treeManager.createSibling(city);
            expect(sibling).toBeTruthy();
            expect(sibling).not.toBeNull();
            expect(sibling).not.toBeUndefined();
        }));

        it("should have correct properties", inject(function($treeManager) {
            expect("header" in sibling).toBe(true);
            expect("weight" in sibling).toBe(true);
            expect("index" in sibling).toBe(true);
        }));

        it("should have correct values", inject(function($treeManager) {
            expect(sibling.header).toEqual("");
            expect(sibling.weight).toEqual(city.weight);
            expect(sibling.index).toEqual(1);
        }));

        it("should not be root", inject(function($treeManager) {
            expect(sibling.isRoot()).not.toBe(true);
        }));

        it("should not be terminal", inject(function($treeManager) {
            expect(sibling.isTerminal()).toBe(true);
        }));

        describe("parent/", function(){
            it("should have a correct parent", inject(function($treeManager) {
                expect(sibling.parent).toEqual(root);
            }));

            it("should not update root's head", inject(function($treeManager) {
                expect(root.head()).toEqual(city);
            }));

            it("should not update parent's tail", inject(function($treeManager) {
                expect(root.tail()).toEqual(people);
            }));

            it("should update parent's number of children", inject(function($treeManager) {
                expect(root.nodes.length).toEqual(3);
            }));

            it("should update parent's number of children", inject(function($treeManager) {
                expect(root.nodes.length).toEqual(3);
            }));
        });

        describe("node array", function(){
            it('expects nodeArray length to be 5', inject(function($treeManager){
                expect($treeManager._nodeArray.length).toEqual(5);
            }));

            it("expects root treeIndex to equal 0", function(){
                expect(root.treeIndex).toEqual(0);
            });

            it("expects city treeIndex to equal 1", function(){
                expect(city.treeIndex).toEqual(1);
            });

            it("expects paris treeIndex to equal 2", function(){
                expect(paris.treeIndex).toEqual(2);
            });

            it("expects sibling treeIndex to equal 3", function(){
                expect(sibling.treeIndex).toEqual(3);
            });

            it("expects people treeIndex to equal 4", function(){
                expect(people.treeIndex).toEqual(4);
            });
        });

        describe("path, index & treeIndex/", function(){
            
            it("should have a correct path", function() {
                expect(sibling.path()).toBe("/0/1");
            });

            it("should have a correct index", function() {
                expect(sibling.index).toEqual(1);
            });

            it("should have a correct treeIndex", function() {
                expect(sibling.treeIndex).toEqual(3);
            });

            it("should not re-index root", function() {
                expect(root.index).toEqual(0);
                expect(root.treeIndex).toEqual(0);
                expect(root.path()).toEqual("/0");
            });

            it("should not re-index city", function() {
                expect(city.index).toEqual(0);
                expect(city.treeIndex).toEqual(1);
                expect(city.path()).toEqual("/0/0");
            });

            it("should re-index people", function() {
                expect(people.index).toEqual(2);
                expect(people.treeIndex).toEqual(4);
                expect(people.path()).toEqual("/0/2");
            });

            it("should not re-index paris", function() {
                expect(paris.index).toEqual(0);
                expect(paris.treeIndex).toEqual(2);
                expect(paris.path()).toEqual("/0/0/0");
            });
        });
        
        describe("walkthrought/", function(){
            it("should have a correct previous sibling", inject(function($treeManager) {
                expect($treeManager.getPreviousSiblingNode(sibling)).toEqual(city);
            }));

            it("should have a correct next sibling", inject(function($treeManager) {
                expect($treeManager.getNextSiblingNode(sibling)).toEqual(people);
            }));

            it("should have a correct previous node", inject(function($treeManager) {
                expect($treeManager.getPreviousNode(sibling)).toEqual(paris);
            }));

            it("should have a correct next node", inject(function($treeManager) {
                expect($treeManager.getNextNode(sibling)).toEqual(people);
            }));
        });

        describe("weight & treeWeight/", function(){
            it("should not have updated the weigth of root", function() {
                expect(root.weight).toEqual(100);
            });

            it("should have updated the weigth of city", function() {
                expect(city.weight).toEqual(41.176);
            });

            it("should have same weigth as city", function() {
                expect(sibling.weight).toEqual(41.176);
            });

            it("should have updated the weigth of people", function() {
                expect(people.weight).toEqual(17.647);
            });

            it("should not have updated the weigth of paris", function() {
                expect(paris.weight).toEqual(100);
            });

            it("sum of siblings' weigth should equal to 100", function() {
                expect(city.weight + sibling.weight + people.weight - 100).toBeLessThan(0.001);
            });

            it("should not have updated the treeWeight of root", function() {
                expect(root.treeWeight).toEqual(100);
            });

            it("should have updated the treeWeight of city", function() {
                expect(city.treeWeight).toEqual(41.176);
            });

            it("should have the same treeWeight as city", function() {
                expect(sibling.treeWeight).toEqual(41.176);
            });

            it("should have updated the treeWeigth of people", function() {
                expect(people.treeWeight).toEqual(17.647);
            });

            it("should have updated the treeWeigth of paris", function() {
                expect(paris.treeWeight).toEqual(41.176);
            });
        });
    });

    describe("Create a sibling of people/", function() {
        var root, city, people, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "header": "root",
                "index": 0,
                "weight": 100,
                "nodes": [{
                    "header": "City",
                    "index": 0,
                    "weight": 70,
                    "nodes": [{
                        "header": "Paris",
                        "index": 0,
                        "weight": 100,
                        "nodes": []
                    }]
                }, {
                    "header": "People",
                    "index": 1,
                    "weight": 30,
                    "nodes": []
                }]
            };

            $treeManager.initTree(jsonObj);
            root = $treeManager._tree;
            city = root.nodes[0];
            paris = city.node(0);
            people = root.nodes[1];
        }));

        var sibling;

        it("should be possible to create a sibling of people", inject(function($treeManager) {
            expect((function() {
                $treeManager.createSibling(people);
            })).not.toThrow();
        }));
    });
});