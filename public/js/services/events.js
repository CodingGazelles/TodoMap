'use strict';

var TdKeyboard = {
    BACK_SPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    DELETE: 46
}

angular.module('App.Services.Events', ['ngResource'])

// filters user events
.factory('$eventManager', ['$mapManager', '$treeManager', '$appScope',  function($mapManager, $treeManager, $appScope) {
    return {
        

        onClick: function(event, scope, element){
            console.log("$eventManager: Catch event: " + event.type + " on node: " + scope.node);

            // select node
            this._stopEventPropagation(event);
            console.log("$eventManager: Launch select node action: " + scope.node);
            if($appScope.topScope().selectedNode !== scope.node){
                $mapManager.unselectNode();
                $mapManager.selectNode(scope.node);
            }else{
                console.log("$eventManager: Node already selected: " + scope.node);
            }
        },

        onChange: function(event, scope, element) {
            console.log("$eventManager: Catch event label change");
            console.log("$eventManager: No action");
        },

        onKeydown: function(event, scope, element) {
            console.log("$eventManager: Catch event: " + event.toString + " on node: " + scope.node);
            
            // alt key
            if(event.altKey){

                // increase weight
                if(event.keyCode === TdKeyboard.ARROW_UP){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Launch increase node weight action: " + scope.node);
                    // scope.node.parent.printBranch();
                    $mapManager.increaseNodeWeight(scope.node);
                    // scope.node.parent.printBranch();
                }

                // decrease weight
                else if(event.keyCode === TdKeyboard.ARROW_DOWN){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Launch decrease node weight action: " + scope.node);
                    $mapManager.decreaseNodeWeight(scope.node);
                }

                else{
                    console.log("$eventManager: No action");
                };
            } 

            // shift key
            else if(event.shiftKey){
                
                // exp
                if( true){

                }

                else{
                    console.log("$eventManager: No action");
                };
            } 

            // ctrl key
            else if(event.ctrlKey){

                // exp
                if( true){

                }

                else{
                    console.log("$eventManager: No action");
                };
            } 

            // no special keys
            else {

                // delete node
                if((event.keyCode === TdKeyboard.BACK_SPACE || event.keyCode === TdKeyboard.DELETE) 
                    && event.target.value === ""
                ){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Launch delete node action: " + scope.node);
                    $mapManager.deleteNode(scope.node);
                } 

                // move to next node
                else if(event.keyCode === TdKeyboard.ARROW_DOWN){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Catch move to next node event: " + scope.node);
                    $mapManager.selectNextNode(scope.node);
                } 

                // move to previous node
                else if(event.keyCode === TdKeyboard.ARROW_UP){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Catch move to previous node event: " + scope.node);
                    $mapManager.selectPreviousNode(scope.node);
                } 

                // increase/decrease node level
                else if(event.keyCode === TdKeyboard.TAB){
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Launch increase node level action: " + scope.node);
                    $mapManager.moveLevelDown(scope.node);
                }

                // unselect node
                else if(event.keyCode === TdKeyboard.ESCAPE) {
                    this._stopEventPropagation(event);
                    console.log("$eventManager: Launch unselect node action");
                    $mapManager.unselectNode();
                }

                else{
                    console.log("$eventManager: No action");
                };
            }
        },

        onKeypress: function(event, scope, element) {
            console.log("$eventManager: Catch event: " + event.toString + " on node: " + scope.node);

            // create sibling
            if(event.keyCode === TdKeyboard.ENTER) {
                this._stopEventPropagation(event);
                console.log("$eventManager: Launch create sibling node action: " + scope.node);
                $mapManager.createSibling(scope.node);
            }

            else{
                console.log("$eventManager: No action");
            };
        },

        onInput: function(event, scope, element) {
            console.log("$eventManager: Catch event: " + event.toString + " on node: " + scope.node);

            // modifying a node
            this._stopEventPropagation(event);
            console.log("$eventManager: Launch modifying node action: " + scope.node);
            $mapManager.modifyingNode(scope.node); 
        },

        onFocus: function(event, scope, element){
            console.log("$eventManager: Catch event " + event.type + " on node: " + scope.node);
            console.log("$eventManager: No action");
        },

        onBlur: function(event, scope, element){
            console.log("$eventManager: Catch event " + event.type + " on node: " + scope.node);

            // unselect node
            this._stopEventPropagation(event);
            console.log("$eventManager: Launch unselect node action");
            $mapManager.unselectNode();
        },

        // stop event propagation
        _stopEventPropagation: function(event){
            if(event.preventDefaut) event.preventDefault();
            if(event.returnValue) event.returnValue = false;
            event.stopPropagation();
        }
    };
}])

;