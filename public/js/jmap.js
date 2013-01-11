function BoundingBox( rectangle){
    this.width = rectangle.width;
    this.height = rectangle.height;
    this.area = this.width * this.height;
    
    this.offsetTop = 0;                 // position of the LayoutBox relative to the top-left of the BoundingBox
    this.offsetLeft = 0;                // position of the LayoutBox relative to the top-left of the BoundingBox
    
//    console.log( "New Bounding Box: " + JSON.stringify(this));
}

BoundingBox.prototype = {
    buildNewLayoutBox: function( currentBox){
        var newBox;
        if( currentBox === undefined){
            return new LayoutBox( "vertical", this.height);
        }
        if( currentBox.axis === "vertical"){
            this.offsetLeft += currentBox.normalLength;
            newBox = new LayoutBox( "horizontal", this.width - this.offsetLeft );
        } else {
            this.offsetTop += currentBox.normalLength;
            newBox = new LayoutBox( "vertical", this.height - this.offsetTop);
        }
//        console.log( "Bounding Box: " + JSON.stringify(this));
        return newBox;
    }
};

function LayoutBox(axis, length) {

    this.axis = axis;       // axis of the box: vertical or horizontal
    this.axisLength = length;       // length of the box in the direction of thaxis 
    this.normalLength = 0;           // length of the box in the direction perpendicular to the axis 
    this.area = 0;                  // area of the layout box
    
    this.offset = 0;             // position of the node along the axis of the layout box and relative to its origin
    
//    console.log( "New Layout Box: " + JSON.stringify(this));
}

function MapBuilder(nodeArray, element){
    this.pendingNodes = nodeArray.slice();          // nodes without position
    
    // the box in which all childnodes will be laid at the end
    this.boundingBox = new BoundingBox( element[0].getBoundingClientRect());
    
    // calculate nodes' areas
    for( var i = 0; i< this.pendingNodes.length; i++) {
        this.pendingNodes[i].area = this.pendingNodes[i].weight / 100 * this.boundingBox.area;
    }
    
    this.initLayout();
}

MapBuilder.prototype = {
    
    // initiate the layout algorithm
    initLayout: function(){
//        console.log("Init the layout");
        this.layoutNodes = [];
        this.pushNextNode();
        this.layoutBox = this.boundingBox.buildNewLayoutBox( this.layoutBox);
    },
    
    // push the next pending node inside the layout box
    pushNextNode : function(){
//        console.log( "Push node into layout box: " + this.pendingNodes[0].label);
        this.layoutNodes.push( this.pendingNodes.shift());
    },
    
    // place the pending nodes inside the layout box according to the aspect ratio
    squarify : function(){
//        console.log("call function squarifyNodes");
        
        // if there's no remaining pending nodes, 
        if( this.pendingNodes.length === 0){
            if( this.layoutNodes.length > 0)
                this.layout();
            return;
        }
            
        // get next pending node
        var node = this.pendingNodes[0];
        
        // test aspect ratio of the current row with one more node in it
        if( this.worstRatio( this.layoutNodes) >= this.worstRatio( this.layoutNodes.concat( node))){
            // if ok remove the node from the pending nodes and add it to the array of layout nodes
            this.pushNextNode();
            this.squarify();
            
        } else {
            // else layout the nodes in layout box 
            this.layout();
            
            // init a new layout
            this.initLayout();
            
            // and start a new one in the alternative axe with the remaining nodes
            this.squarify();
        }
    },
    
    // determine the position (top, left, width, height) of the nodes inside the layout box
    layout: function (){
//        console.log("call function layoutNodes");
        
        // compute total area of the layout nodes
        var totalArea = 0;
        this.layoutNodes.forEach( function( node){
            totalArea += node.area;
        });
        
        // update the layout box
        this.layoutBox.area = totalArea;
        this.layoutBox.normalLength = this.layoutBox.area / this.layoutBox.axisLength;
        
//        console.log( "Layout box: " + JSON.stringify(this.layoutBox));
        
        for( var i in this.layoutNodes){
            var node = this.layoutNodes[i];
            node.box = {};
            if( this.layoutBox.axis === "vertical"){
                node.box.top = this.boundingBox.offsetTop + this.layoutBox.offset;
                node.box.left = this.boundingBox.offsetLeft;
                node.box.width = this.layoutBox.normalLength;
                node.box.height = node.area / node.box.width;
                this.layoutBox.offset += node.box.height;
            } else {
                node.box.top = this.boundingBox.offsetTop;
                node.box.left = this.boundingBox.offsetLeft + this.layoutBox.offset;
                node.box.height = this.layoutBox.normalLength;
                node.box.width = node.area / node.box.height;
                this.layoutBox.offset += node.box.width;
            }
            
//            console.log( "Node box: " + JSON.stringify(node.box));
        }
    },
    
    // compute highest aspect ratio
    worstRatio: function ( nodes) {
//        console.log("call function worstRatio");
        
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
//        console.log( "ratio: " + w);
        return w;
    }
};






