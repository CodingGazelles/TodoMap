var data = require("./data/exp9");


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

function changeTree( nodeArray){
    var node;
    
    for( var i = 0; i < nodeArray.length; i++){
    
        node = nodeArray[i];
        //console.log( node.label);
        
        // node.path = parentPath + "/" + i.toString();
        node.index = parseInt( node.path.slice( node.path.length - 1));
        delete node.path;
        
        
        if( node.childNodes !== undefined){
            changeTree( node.childNodes);
        }
        
        
    }
}   

changeTree( data.tree, "");
console.log( "tree: " + JSON.stringify( data.tree));


