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
                    parent._pushChild(newNode);
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

// updates the model
.factory('$treeManager', ['$storage', '$rootScope', function($storage, $rootScope) {
    return {
        deleteNode: function(node){
            if( !node) throw new Error("Node can't be null or undefined");
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
            return node.createSibling();
        },

        onChangedTree: function(){
            console.log("Changed tree");
            $storage.saveTree();
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
}])

.factory('$mapManager', ['$appScope', function($appScope) {
    return {
        // todo: ajouter map builder

        colorizeBranch: function(node){
            if( !node) throw new Error("Node can't be null");
            if( node.nodes.length === 0) return;

            var parentColor, hueRange, hueOffset;

            if( node.bgcolor.h && node.bgcolor.s && node.bgcolor.v){
                parentColor =  {
                    h: node.bgcolor.h, 
                    s: node.bgcolor.s * 0.65, 
                    v: node.bgcolor.v
                };
            } else {
                parentColor = {h: 0, s: 0.9, v: 1};
            }

            hueRange = node.hueRange || 360;
            hueOffset = hueRange / node.nodes.length;

            node.nodes.forEach( function( child, index) {
                child.bgcolor = {
                    h: (parentColor.h + hueOffset * index) % 360,
                    s: parentColor.s,
                    v: parentColor.v
                };
                child.hueRange = hueOffset;
            });
        },

        squarifyBranch: function(node, rectangle){
            var mapBuilder = new MapBuilder(node.nodes, rectangle);
            mapBuilder.squarify();
        },

        toHexString: function(color){
            return tinycolor("hsv (" + color.h + " " + color.s + " " + color.v + ")").toHexString();
        },

        redrawNode: function(node) {
            console.log("Throw event redraw node: " + node);
            $appScope.topScope().$broadcast('redrawNode', {
                "targetPath": node.path()
            });
        },

        focusOnNode: function(node) {
            console.log("Throw event focus on node: " + node);
            $appScope.topScope().$broadcast('focusOnLabel', {
                "targetPath": node.path()
            });
            
        }
    };
}])

// filters the user event
.factory('$eventManager', [ '$treeManager', '$mapManager',  function($treeManager, $mapManager) {
    return {
        onChange: function(event, node) {
            console.log("Catch event label change");
            $treeManager.onChangedTree();
        },

        onKeydown: function(event, node) {
            console.log("Catch event label keydown");
            if((event.keyCode === TdKeyboard.BACK_SPACE || event.keyCode === TdKeyboard.DELETE) 
                && event.target.value === ""
            ){
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;

                console.log("Catch delete node event: " + node);

                $treeManager.deleteNode( node);
                $treeManager.onChangedTree();
                $mapManager.redrawNode(node.parent);

                if(node.previous) {
                    $mapManager.focusOnNode(node.previous());
                } else if(node.parent) {
                    $mapManager.focusOnNode(node.parent());
                } else if(node.next) {
                    $mapManager.focusOnNode(node.next());
                }
            };
        },

        onKeypress: function(event, node) {
            console.log("Catch event label keypress");

            if(event.keyCode === TdKeyboard.ENTER) {
                if(event.preventDefaut) event.preventDefault();
                if(event.returnValue) event.returnValue = false;
                
                $treeManager.createSibling( scope.node);
                $treeManager.onChangedTree(node);

                console.log("Throw event redraw node: " + scope.node.parent);
                scope.$emit('redrawNode', {
                    "targetPath": scope.node.parent.path()
                });

                newNode.labelElement[0].focus();

                
            };
        },

        onInput: function(event, node) {
            console.log("Catch event label input");
        }
    };
}])

;