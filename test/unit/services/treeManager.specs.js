//
// test/unit/services/servicesSpec.js
//
describe("Unit: Testing service $treeManager ", function() {

    beforeEach(angular.mock.module('App'));

        it('should contain an $treeManager service', inject(function($treeManager) {
            expect($treeManager).to.be.ok;
        }));

        it('should have a working $treeManager', inject(function($treeManager) {
            expect($treeManager.deleteNode).to.be.ok;
            expect($treeManager.createSibling).to.be.ok;

        }));

        describe(": delete a node", function() {

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

            it("should be impossible to delete the root", inject(function($treeManager) {
                expect($treeManager.deleteNode(root)).to.
                throw();
            }));

            it("should be impossible to create a sibling to root", inject(function($treeManager) {
                expect($treeManager.createSibling(root)).to.
                throw(/sibling/);
            }));

            it("should be possible to delete city", inject(function($treeManager) {
                $treeManager.deleteNode(city);
                expect(root.nodes.length).to.equal(1);
                expect(root.nodes.indexOf(city)).to.equal(-1);
            }));

            it("should updates the links of city", inject(function($treeManager) {
                $treeManager.deleteNode(city);
                expect(city.parent).to.be.null;
            }));

            it("should updates the links of root", inject(function($treeManager) {
                $treeManager.deleteNode(city);
                expect(root.tail()).to.deep.equal(people);
                expect(root.head()).to.deep.equal(people);
            }));

            it("should updates the links of people", inject(function($treeManager) {
                $treeManager.deleteNode(city);
                expect(people.next()).to.be.null;
                expect(people.previous()).to.be.null;
            }));

            it("should reindex the tree", inject(function($treeManager) {
                $treeManager.deleteNode(city);
                expect(people.index).to.equal(0);
            }));
        });
});