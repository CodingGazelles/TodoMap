var data = require("./data/exp7");


//function changeTree( nodeArray){
//    nodeArray.forEach( function( node){
//        
//        //console.log( node.label);
//        
//        node.weight = parseFloat(node.weightScale);
//        node.opened = true;
//        
//        delete node.childNodesWeight;
//        delete node.weightScale;
//        
//        
//        if( node.childNodes !== undefined){
//            changeTree( node.childNodes);
//        }
//        
//        
//    });
//}   

function changeTree( nodeArray, parentPath){
    var node;
    
    for( var i = 0; i < nodeArray.length; i++){
    
        node = nodeArray[i];
        //console.log( node.label);
        
        node.path = parentPath + "/" + i.toString();
        
        
        if( node.childNodes !== undefined){
            changeTree( node.childNodes, node.path);
        }
        
        
    }
}   

changeTree( data.tree, "");
console.log( "tree: " + JSON.stringify( data.tree));


