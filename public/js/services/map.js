'use strict';

angular.module('App.Services.Map', ['ngResource'])

// contains services to deal with the map (the view)
.factory('$mapManager', ['$treeManager', '$appScope', '$injector', function($treeManager, $appScope, $injector) {
    return {

        signalToRedrawNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Signal to redraw node: " + node);
            $appScope.safeApply(function(){
                $treeManager.signalToRedrawNode(node);
            });
        },

        saveMap: function(){
            console.log("$mapManager: Save map");
            var successFn = this._onSaveSuccess;
            var failureFn = this._onSaveFailure;
            $appScope.safeApply(function(){
                $appScope.topScope().savedState = "Saving ...";
                $treeManager.saveTree(successFn,failureFn);
            }); 
        },

        _onSaveSuccess: function(){
            console.log("$mapManager: Saving tree succeeded");
            $appScope.topScope().savedState = "Saved";
        },

        _onSaveFailure: function(data){
            console.log("$mapManager: Saving failed");
        },

        modifyingNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Modifying node");
            var $manager = this;
            $appScope.safeApply(function(){
                $manager.saveMap();
            }); 
        },

        deleteNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Delete node: " + node);
            var nextNode = $treeManager.getPreviousNode(node);
            var $manager = this;
            $appScope.safeApply( function(){ 
                $treeManager.deleteNode(node);
                $manager.saveMap();
                $manager.unselectNode();
                $manager.selectNode(nextNode);
                $treeManager.signalToRedrawNode(node.parent);
            });
            this.focusOnSelectedNode();
        },

        createSibling: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Create sibling to node: " + node);
            var newNode;
            var $manager = this;
            $appScope.safeApply( function(){ 
                newNode = $treeManager.createSibling(node);
                $manager.saveMap();
                $manager.unselectNode();
                $manager.selectNode(newNode);
                $treeManager.signalToRedrawNode(newNode.parent);
            });
            this.focusOnSelectedNode();
            return newNode;
        },

        moveLevelDown: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.moveLevelDown(node);
            $treeManager.saveTree();
        },

        moveLevelUp: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.moveLevelUp(node);
            $treeManager.saveTree();
        },

        moveIndexDown: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.moveIndexDown(node);
            $treeManager.saveTree();
        },

        moveIndexUp: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            $treeManager.moveIndexUp(node);
            $treeManager.saveTree();
        },

        increaseNodeWeight: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Increase weight node: " + node);
            var $manager = this;
            $appScope.safeApply( function(){ 
                $treeManager.increaseNodeWeight(node);
                $manager.saveMap();
                $manager.signalToRedrawNode(node.parent);
            });
            this.focusOnSelectedNode();
        },

        decreaseNodeWeight: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Decrease node weight: " + node);
            var $manager = this;
            $appScope.safeApply( function(){ 
                $treeManager.decreaseNodeWeight(node);
                $manager.saveMap();
                $manager.signalToRedrawNode(node.parent);
            });
            this.focusOnSelectedNode();
        },

        selectNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            console.log("$mapManager: Select node: " + node);
            var $manager = this;
            $appScope.safeApply( function(){ 
                node.selected = true;
                $appScope.topScope().selectedNode = node;
                $treeManager.signalToRedrawNode(node);
            });
            this.focusOnSelectedNode();
        },

        selectNextNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            this.unselectNode();
            var nextNode = $treeManager.getNextNode(node);
            this.selectNode(nextNode);
        },

        selectPreviousNode: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            this.unselectNode();
            var previousNode = $treeManager.getPreviousNode(node);
            this.selectNode(previousNode);
        },

        focusOnSelectedNode: function(){
            // this function may be called while angular has not already redrawn the map
            // so the selected element may not be ready to get the focus
            console.log("$mapManager: Focus on selected node: " + $appScope.topScope().selectedNode);
            if($appScope.topScope().selectedNode){
                if($appScope.topScope().selectedNode.element){
                    if(!$appScope.topScope().$$phase){
                        $appScope.topScope().selectedNode.element.find('input')[0].focus();
                    }
                }
            }
        },

        unselectNode: function(){
            console.log("$mapManager: Unselect node: " + $appScope.topScope().selectedNode);
            if($appScope.topScope().selectedNode){
                $appScope.safeApply( function(){ 
                    var node = $appScope.topScope().selectedNode;
                    $appScope.topScope().selectedNode = null;
                    node.selected = false;
                    $treeManager.signalToRedrawNode(node);
                });
                
            }
        },

        colorizeBranch: function(node){
            if(!node) throw new Error("Node can't be null or undefined");
            if(node.nodes.length === 0) return;

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
            if(!node) throw new Error("Node can't be null or undefined");
            if(!rectangle) throw new Error("Rectangle can't be null or undefined");
            var mapBuilder = new MapBuilder(node.nodes, rectangle);
            mapBuilder.squarify(); 
        },

        toHexString: function(color){
            return tinycolor("hsv (" + color.h + " " + color.s + " " + color.v + ")").toHexString();
        }
    };
}])

;