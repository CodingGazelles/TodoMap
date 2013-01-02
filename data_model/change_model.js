var data = require("./data/exp4");


function changeTree( nodeArray){
    nodeArray.forEach( function( node){
        
        //console.log( node.label);
        
        if( ! node.weight   )
            node.weight = 1;
        
        
        if( node.childNodes !== undefined){
            changeTree( node.childNodes);
        }
        
        
    });
}   

changeTree( data.tree);
console.log( "tree: " + JSON.stringify( data.tree));


