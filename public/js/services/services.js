'use strict';

angular.module('App.Services', ['ngResource'])

.factory('$storage', [ '$appScope', '$resource', '$injector', function($appScope, $resource, $injector) {
    return {
        store:  $resource(
            '/api/maps/:id', 
            {id: '@id'}, 
            {
                getMap: {method: 'GET'},
                saveMap: {method: 'PUT'}
            }
        ),

        loadTree: function( mapId){
            console.log("Load tree");
            this.store.getMap(
                {id: mapId},
                this._onLoadSucceed,
                this._onLoadFailed
            );
        },

        _onLoadSucceed: function( data){
            console.log("Load map succeed");
            // console.log("$scope.todoTree: " + JSON.stringify(data));
            var tree = $injector.get('$storage')._extendTree( data);
            $appScope.topScope().todoTree = tree;
        },

        _onLoadFailed: function( data){
            console.log("Load map failed");
            console.log("Returned data: " + data);
            $appScope.topScope().todoTree = {
                label: "error",
                childNodes: []
            };
           // console.log("$scope.mapData: " + JSON.stringify(data));
        },

        _extendTree: function(data) {
            console.log("Extend tree");

            var root;
            var getNodeData = function(node) {
                    var attr, nodeData = {};
                    for(attr in node) {
                        if(attr !== "childNodes") nodeData[attr] = node[attr];
                    }
                    return nodeData;
                };

            (function walkDown(node, parent) {
                var newNode;

                if(!parent) {
                    newNode = root = new TdNode(getNodeData(node));
                } else {
                    newNode = new TdNode(getNodeData(node));
                    newNode.parent = parent;
                    parent._pushNode(newNode);
                }

                if("childNodes" in node) {
                    for(var i = 0; i < node.childNodes.length; i++) {
                        walkDown(node.childNodes[i], newNode);
                    }
                }
            })(data);

            return root;
        },

        saveTree: function(){
            console.log("Save tree");
            // $debounce( this._saveTree(), 2000, false);
        },

        _saveTree: function(){
            console.log("Save tree (debounced)");
            
            var todoData = TdTree.filterTree( $rootScope.todoTree);
            // console.log("$scope.mapData: " + JSON.stringify( todoData));
            
            $storage.saveMap(
                {id: todoData._id},
                todoData,
                function(data) { // SUCCESS
                    console.log("call api maps.saveMap succeed");
                    //console.log("$scope.mapData: " + JSON.stringify(data));
                },
                function(data) { // FAILURE
                    console.log("call api maps.saveMap failed");
                    //console.log("$scope.mapData: " + JSON.stringify(data));
                }
            );
        },

        // flatten the tree, ie, remove non persistent properties from the node tree
        _flattenTree: function(data) {
            console.log("flatten tree");

            var root;

            (function walkDown(node, parent) {
                var newNode;

                if(!parent) {
                    newNode = root = _.pick(node, _.keys(TdNode.basic), "_id");
                    newNode.childNodes = [];
                } else {
                    newNode = _.pick(node, _.keys(TdNode.basic));
                    newNode.childNodes = [];
                    parent.childNodes.push(newNode);
                }

                if("childNodes" in node) {
                    for(var i = 0; i < node.nodes().length; i++) {
                        walkDown(node.nodes()[i], newNode);
                    }
                }
            })(data);

            return root;
        }
    };
}])

// filters the user event
.factory('$eventManager', function() {
    return {
        onChange: function(event, node) {
            console.log("Catch event label change");
            $treeManager.onChangedNode(node);
        },

        onKeydown: function(event, node) {
            console.log("Catch event label keydown");
            if(
                (event.keyCode === TdKeyboard.BACK_SPACE || event.keyCode === TdKeyboard.DELETE) 
                && event.target.value === ""
            ){
                console.log("Delete node: " + scope.node);

                $treeManager.deleteNode( node);

                console.log("Throw event redraw node: " + scope.node.parent);
                scope.$emit('redrawNode', {
                    "targetPath": scope.node.parent.path()
                });

                if(scope.node.previous) {
                    scope.node.previous.focus();
                } else if(scope.node.parent) {
                    scope.node.parent.focus();
                } else if(scope.node.next) {
                    scope.node.next.focus();
                }

                console.log("Throw event save map");
                scope.$emit('saveMap');

                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;
            };
        },

        onKeypress: function(event, node) {
            console.log("Catch event label keypress");

            if(event.keyCode === TdKeyboard.ENTER) {
                
                $treeManager.createSibling( scope.node);

                console.log("Throw event redraw node: " + scope.node.parent);
                scope.$emit('redrawNode', {
                    "targetPath": scope.node.parent.path()
                });
                console.log("Throw event save map");
                scope.$emit('saveMap');

                newNode.labelElement[0].focus();

                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;
            };
        },

        onInput: function(event, node) {
            console.log("Catch event label input");
        }
    };
})

// updates the model
.factory('$treeManager', function() {
    return {
        deleteNode: function(node){
            if( !node) throw new Error("Argument can't be undefined");
            if( node.isRoot()){
                console.log('WARN: tried to delete root');
                throw new Error("Can't delete root");
            }
            console.log("Delete node: " + node);
            node.delete();
        },

        createSibling: function(node){
            if( !node) throw new Error("Argument can't be undefined");
            if( node.isRoot()){ 
                console.log('WARN: tried to create a sibling of root');
                throw new Error("Can't create a sibling to root");
            }
            console.log("Create sibling to node: " + node);
            var newNode = node.createSibling();
        },

        onChangedNode: function(node){
            console.log("Changed node:" + node);
            this.saveTree();
        },

        onSavingTree: function(){
            console.log("Saving tree");
            $rootScope.savedState = "Saving ...";
            $rootScope.$digest();
        },

        onSavedTree: function(){
            console.log("Saved tree");
            $rootScope.savedState = "Saved";
            $rootScope.$digest();
        }
    };
});