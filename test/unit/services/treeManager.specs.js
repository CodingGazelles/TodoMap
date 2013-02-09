//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing service $treeManager ", function() {

    beforeEach(angular.mock.module('App'));

        it('should contain an $treeManager service', inject(function($treeManager) {
            expect($treeManager).toBeTruthy();
        }));

        it('should have a working $treeManager', inject(function($treeManager) {
            expect($treeManager.deleteNode).toBeTruthy();
            expect($treeManager.createSibling).toBeTruthy();

        }));

        describe("/ ", function() {

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
                expect((function(){ $treeManager.deleteNode(root)})).toThrow();
            }));

            it("should be impossible to create a sibling to root", inject(function($treeManager) {
                expect((function(){ $treeManager.createSibling(root)})).toThrow();
            }));

            it("should be really impossible to create a sibling to root", inject(function($treeManager) {
                try{
                    $treeManager.createSibling(root)
                } catch(e){
                    //nothing
                }
                expect(root.next()).toBeNull();
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
        });
});