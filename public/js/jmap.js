function BoundingBox( width, height){
    this.width = width;
    this.height = height;
    this.area = this.width * this.height;
    
    console.log( "Bounding Box: " + JSON.stringify(this));
}

function LayoutBox(top, left, axis, length) {
    this.top = top;         // position of the LayoutBox relative to the top-left of the BoundingBox
    this.left = left;       // position of the LayoutBox relative to the top-left of the BoundingBox
    this.axis = axis;       // axis of the box: vertical or horizontal
    this.axisLength = length;       // length of the box in the axis direction
    this.orthoLength = 0;           // length of the box in the parpendicular axis direction
    this.area = 0;                  // area of the layout box
    this.offsetTop = 0;
    this.offsetLeft = 0;
    
    console.log( "Layout Box: " + JSON.stringify(this));
}

function MapBuilder(nodeArray, element){
    this.pendingNodes = nodeArray.slice();
    this.element = element;
    
    // the box in which all childnodes will be laid
    this.boundingBox = new BoundingBox( element[0].getBoundingClientRect().width, element[0].getBoundingClientRect().height);
    
    this.laidNodes = [];
    this.layoutBox = new LayoutBox(0,0,"vertical",this.boundingBox.height);
    
    // calculate nodes' areas
    for( var i = 0; i< this.pendingNodes.length; i++) {
        this.pendingNodes[i].area = this.pendingNodes[i].weightScale * this.boundingBox.area;
    }
    
    this.pushNextNode();
}

MapBuilder.prototype = {
    
    pushNextNode : function(){
        this.laidNodes.push( this.pendingNodes.shift());
        console.log( "Push node: " + JSON.stringify( this.laidNodes[this.laidNodes.length-1].label));
    },
    
    // pendingNodes: nodes waiting to be laid
    // laidNodes: nodes laid down
    squarifyNodes : function(){
//        console.log("call function squarifyNodes");
//        console.log( "pending nodes: " + JSON.stringify( this.pendingNodes));
//        console.log( "laid nodes: " + JSON.stringify( this.laidNodes));
        
        if( this.pendingNodes.length === 0){
            if( this.laidNodes.length > 0)
                this.layoutNodes();
            return;
        }
            
        // get next pending node
        var node = this.pendingNodes[0];
        
        // test aspect ratio of the current row with one more node in it
        if( this.worstRatio( this.laidNodes) <= this.worstRatio( this.laidNodes.concat( node))){
//            console.log( "Add node to current layout box");
            
            // if ok remove the node from the pending nodes and add it to the array of laidNodes
            this.pushNextNode();
            this.squarifyNodes();
            
        } else {
//            console.log( "Lay out nodes and create new layout box");
            
            // else layout the nodes in laidNodes 
            this.layoutNodes();
            
            // init a new layout box
            if( this.layoutBox.axis === "vertical"){
                
                this.layoutBox = new LayoutBox( 
                    this.layoutBox.top, 
                    this.layoutBox.left + this.layoutBox.orthoLength, 
                    "horizontal",
                    this.boundingBox.width - this.layoutBox.left - this.layoutBox.orthoLength
                );
                
            } else {
                this.layoutBox = new LayoutBox( 
                    this.layoutBox.top + this.layoutBox.orthoLength, 
                    this.layoutBox.left, 
                    "vertical",
                    this.boundingBox.height - this.layoutBox.top - this.layoutBox.orthoLength
                );
            }
//            console.log( "Layout Box: " + JSON.stringify(this.layoutBox));
            
            // and start a new one in the alternative axe with the remaining nodes
            this.squarifyNodes();
        }
    },
    
    layoutNodes: function (){
        console.log("call function layoutNodes");
//        console.log( "laid nodes: " + JSON.stringify( this.laidNodes));
//        console.log( "layout box: " + JSON.stringify( this.layoutBox));
        
        // compute total area of nodes
        var totalArea = 0;
        this.laidNodes.forEach( function( node){
            totalArea += node.area;
        });
        
        // update the layout box
        this.layoutBox.area = totalArea;
        this.layoutBox.orthoLength = this.layoutBox.area / this.layoutBox.axisLength;
        
        for( var i in this.laidNodes){
            var node = this.laidNodes[i];
            node.top = this.layoutBox.top + this.layoutBox.offsetTop;
            node.left = this.layoutBox.left + this.layoutBox.offsetLeft;
            
            if( this.layoutBox.axis === "vertical"){
                node.width = this.layoutBox.orthoLength;
                node.height = node.area / node.width;
                this.layoutBox.offsetTop += node.height;
            } else {
                node.height = this.layoutBox.orthoLength;
                node.width = node.area / node.height;
                this.layoutBox.offsetLeft += node.width;
            }
        }
    },
    
    // compute highest aspect ratio
    worstRatio: function ( nodes) {
        console.log("call function worstRatio");
//        console.log( "nodes: " + JSON.stringify( nodes));
        
        // build array of nodes' areas
        var areas = nodes.map(function(child) {
            return child.area;
        });
        
        // compute total area of all nodes
        var totalArea = 0;
        areas.forEach(function(area) {
            totalArea += area;
        });
    
        // get max and min of nodes' areas
        var max = Math.max.apply(null, areas);
        var min = Math.min.apply(null, areas);
    
        // compute the worst aspect ratio of the childnodes aligned along the border 
        // see squarified treemap algorithm
        var w = Math.max(
            this.layoutBox.axisLength * this.layoutBox.axisLength * max / (totalArea * totalArea), 
            totalArea * totalArea / (this.layoutBox.axisLength * this.layoutBox.axisLength * min)
        );
        console.log( "ratio: " + w);
        return w;
    }
};






