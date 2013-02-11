//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing service $treeManager: ", function() {

    beforeEach(angular.mock.module('App'));

    it('should contain an $treeManager service', inject(function($treeManager) {
        expect($treeManager).toBeTruthy();
    }));

    it('should have a working $treeManager', inject(function($treeManager) {
        expect($treeManager.deleteNode).toBeTruthy();
        expect($treeManager.createSibling).toBeTruthy();

    }));

    describe("Delete a node: ", function() {

        var root;
        var city, people;

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
                    "childNodes": []
                }, {
                    "label": "People",
                    "weight": 38.889,
                    "opened": true,
                    "index": 1,
                    "childNodes": []
                }]
            };

            root = $storage._extendTree(jsonObj);
            city = root.nodes[0];
            people = root.nodes[1];
        }));

        it("should be impossible to delete nothing", inject(function($treeManager) {
            expect($treeManager.deleteNode).toThrow();
        }));

        it("should be impossible to delete the root", inject(function($treeManager) {
            expect((function() {
                $treeManager.deleteNode(root)
            })).toThrow();
        }));

        it("should be possible to delete city", inject(function($treeManager) {
            $treeManager.deleteNode(city);
            expect(root.nodes.length).toEqual(1);
            expect(root.nodes.indexOf(city)).toEqual(-1);
        }));

        it("should updates the links of city", inject(function($treeManager) {
            $treeManager.deleteNode(city);
            expect(city.parent).toBeNull();
        }));

        it("should updates the links of root", inject(function($treeManager) {
            $treeManager.deleteNode(city);
            expect(root.tail()).toEqual(people);
            expect(root.head()).toEqual(people);
        }));

        it("should updates the links of people", inject(function($treeManager) {
            $treeManager.deleteNode(city);
            expect(people.next()).toBeNull();
            expect(people.previous()).toBeNull();
        }));

        it("should reindex the tree", inject(function($treeManager) {
            $treeManager.deleteNode(city);
            expect(people.index).toEqual(0);
        }));


        //TODO: need to test the weigth and index of the remaining nodes !!!!!
    });


    describe("Create a sibling: ", function() {

        var root;
        var city, people;

        beforeEach(inject(function($storage) {
            var jsonObj = {
                "label": "root",
                "weight": 100,
                "opened": true,
                "index": 0,
                "childNodes": [{
                    "label": "City",
                    "weight": 61.111,
                    "opened": true,
                    "index": 0,
                    "childNodes": []
                }, {
                    "label": "People",
                    "weight": 38.889,
                    "opened": true,
                    "index": 1,
                    "childNodes": []
                }]
            };

            root = $storage._extendTree(jsonObj);
            city = root.nodes[0];
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
            expect(root.next()).toBeNull();
        }));

        // sibling of city
        describe("A sibling of city ", function() {

            var sibling

            it("should be possible to create a sibling of city", inject(function($treeManager) {
                expect((function() {
                    $treeManager.createSibling(city);
                })).not.toThrow();
            }));

            beforeEach(inject(function($treeManager) {
                sibling = $treeManager.createSibling(city);
            }));

            it("should be possible to recover the sibling of city", inject(function($treeManager) {
                expect(sibling).toBeTruthy();
                expect(sibling).not.toBeNull();
                expect(sibling).not.toBeUndefined();
            }));

            it("should have correct properties", inject(function($treeManager) {
                expect("label" in sibling).toBe(true);
                expect("weight" in sibling).toBe(true);
                expect("opened" in sibling).toBe(true);
                expect("index" in sibling).toBe(true);
                expect("bgcolor" in sibling).toBe(true);
                expect("hueRange" in sibling).toBe(true);
                expect("labelElement" in sibling).toBe(true);
            }));

            it("should have correct values", inject(function($treeManager) {
                expect(sibling.label).toEqual("");
                expect(sibling.weight).toEqual(city.weight);
                expect(sibling.opened).toEqual(true);
                expect(sibling.index).toEqual(1);
                expect(sibling.bgcolor).toEqual("#ffffff");
                expect(sibling.hueRange).toEqual(360);
                expect(sibling.labelElement).toBeNull();
            }));

            it("should have a correct path", inject(function($treeManager) {
                expect(sibling.path()).toBe("/0/1");
            }));

            it("should have a correct parent", inject(function($treeManager) {
                expect("parent" in sibling).toBe(true);
                expect(sibling.parent).toEqual(root);
            }));

            it("should have a correct previous", inject(function($treeManager) {
                expect("previous" in sibling).toBe(true);
                expect(sibling.previous()).toEqual(city);
            }));

            it("should have a correct next", inject(function($treeManager) {
                expect("next" in sibling).toBe(true);
                expect(sibling.next()).toEqual(people);
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

            it("should not be root", inject(function($treeManager) {
                expect(sibling.isRoot()).not.toBe(true);
            }));

            it("should not be terminal", inject(function($treeManager) {
                expect(sibling.isTerminal()).toBe(true);
            }));

            it("should update parent's number of children", inject(function($treeManager) {
                expect(root.nodes.length).toEqual(3);
            }));

            it("should not re-index city", inject(function($treeManager) {
                expect(city.index).toEqual(0);
            }));

            it("should re-index people", inject(function($treeManager) {
                expect(people.index).toEqual(2);
            }));

            it("should have updated the weigth of city", inject(function($treeManager) {
                expect(city.weight).toBe(37.931);
            }));

            it("should have same weigth as city", inject(function($treeManager) {
                expect(sibling.weight).toBe(37.931);
            }));

            it("should have updated the weigth of people", inject(function($treeManager) {
                expect(people.weight).toBe(24.138);
            }));

            it("sum of siblings' weigth should equal to 100", inject(function($treeManager) {
                expect(city.weight + sibling.weight + people.weight).toBe(100);
            }));

        });

        // sibling of people
        it("should be possible to create a sibling of people", inject(function($treeManager) {
            expect((function() {
                $treeManager.createSibling(people);
            })).not.toThrow();
        }));


        //TODO: need to test the weigth of the new nodes !!!!!
    });
});