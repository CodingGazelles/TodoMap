//
// test/unit/services/servicesSpec.js
//
describe("Unit Testing/ $treeManager/", function() {

    beforeEach(angular.mock.module('App'));

    it('should contain a $treeManager service', inject(function($treeManager) {
        expect($treeManager).toBeTruthy();
    }));

    it('should have functions to delete a node', inject(function($treeManager) {
        expect($treeManager.deleteNode).toBeTruthy();
    }));

    describe("Delete node/", function() {

        var root, city, people, food, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "label": "root",
                "weight": 100,
                "index": 0,
                "nodes": [{
                    "label": "City",
                    "weight": 32.778,
                    "index": 0,
                    "nodes": [{
                        "label": "Paris",
                        "weight": 100,
                        "index": 0,
                        "nodes": []
                    }]
                }, {
                    "label": "People",
                    "weight": 38.889,
                    "index": 1,
                    "nodes": []
                }, {
                    "label": "Food",
                    "weight": 28.333,
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
            expect(root.nodes.length).toEqual(2);
            expect(root.nodes.indexOf(city)).toEqual(-1);
        }));

        it("should be possible to delete paris", inject(function($treeManager) {
            $treeManager.deleteNode(paris);
            expect(city.nodes.length).toEqual(0);
            expect(city.nodes.indexOf(paris)).toEqual(-1);
        }));

        it("should be possible to delete people", inject(function($treeManager) {
            $treeManager.deleteNode(people);
            expect(root.nodes.length).toEqual(2);
            expect(root.nodes.indexOf(people)).toEqual(-1);
        }));

        it("should be possible to delete food", inject(function($treeManager) {
            $treeManager.deleteNode(food);
            expect(root.nodes.length).toEqual(2);
            expect(root.nodes.indexOf(food)).toEqual(-1);
        }));

    });

    describe("Delete people/", function() {

        var root, city, people, food, paris;

        beforeEach(inject(function($treeManager) {
            var jsonObj = {
                "label": "root",
                "weight": 100,
                "index": 0,
                "nodes": [{
                    "label": "City",
                    "weight": 32.778,
                    "index": 0,
                    "nodes": [{
                        "label": "Paris",
                        "weight": 100,
                        "index": 0,
                        "nodes": []
                    }]
                }, {
                    "label": "People",
                    "weight": 38.889,
                    "index": 1,
                    "nodes": []
                }, {
                    "label": "Food",
                    "weight": 28.333,
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

        it("should updates the parent of people", inject(function($treeManager) {
            $treeManager.deleteNode(people);
            expect(people.parent).toBeNull();
        }));

        it("should not updates the links of root", inject(function($treeManager) {
            $treeManager.deleteNode(people);
            expect(root.head()).toEqual(city);
            expect(root.tail()).toEqual(food);
        }));

        it("should updates the links of people", inject(function($treeManager) {
            $treeManager.deleteNode(people);
            expect(people.next()).toBeNull();
            expect(people.previous()).toBeNull();
        }));

        it("should reindex the tree", inject(function($treeManager) {
            $treeManager.deleteNode(people);
            expect(people.index).toEqual(0);
        }));


        //TODO: need to test the weigth and index of the remaining nodes !!!!!
    });


});