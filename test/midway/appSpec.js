//
// test/midway/appSpec.js
//
describe("Midway: Testing Modules", function() {
  describe("App Module:", function() {

    var module;
    before(function() {
      module = angular.module("App");
    });

    it("should have a module App registered", function() {
      expect(module).to.be.ok;
    });

    it("should have a module App.Services registered", function(){
      expect( angular.module('App.Services')).to.be.ok;
    });

    describe("Dependencies:", function() {

      var deps;
      var hasModule = function(m) {
        return deps.indexOf(m) >= 0;
      };
      before(function() {
        deps = module.value('appName').requires;
      });

      //you can also test the module's dependencies
      it("should have App.Controllers as a dependency", function() {
        expect(hasModule('App.Controllers')).to.equal(true);
      });

      it("should have App.Directives as a dependency", function() {
        expect(hasModule('App.Directives')).to.equal(true);
      });

      it("should have App.Filters as a dependency", function() {
        expect(hasModule('App.Filters')).to.equal(true);
      });

      it("should have App.Routes as a dependency", function() {
        expect(hasModule('App.Routes')).to.equal(true);
      });

      it("should have App.Services as a dependency", function() {
        expect(hasModule('App.Services')).to.equal(true);
      });
    });
  });
});
