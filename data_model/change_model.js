var data = require("./data/exp6");


function changeTree( nodeArray){
    nodeArray.forEach( function( node){
        
        //console.log( node.label);
        
        node.weight = parseFloat(node.weightScale);
        node.opened = true;
        
        delete node.childNodesWeight;
        delete node.weightScale;
        
        
        if( node.childNodes !== undefined){
            changeTree( node.childNodes);
        }
        
        
    });
}   

changeTree( data.tree);
console.log( "tree: " + JSON.stringify( data.tree));


