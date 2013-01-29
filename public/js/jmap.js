
function MapBuilder(nodeArray, rectangle) {
    this.pendingNodes = nodeArray.slice();              // nodes without position
    this.boundingBox = {
        width : rectangle.width,
        height : rectangle.height,
        area : rectangle.width * rectangle.height,
        offsetTop : 0,                     // position of the layout frame relative to the top-left of the BoundingBox
        offsetLeft : 0                    // position of the layout frame relative to the top-left of the BoundingBox
    };

    this.computeNodeAreas();
    this.newLayoutZone();
}

function Zone(axis, length){
    this.axis= axis;                               // axis of the area: vertical or horizontal
    this.axisLength= length;                       // length of the box in the direction of the axis 
    this.normalLength= 0;                          // length of the box in the direction perpendicular to the axis 
    this.area= 0;                                  // area of the layout rectangle
    this.offset= 0; 

    this.width = function(){
        return axis === "horizontal" ? axisLength : normalLength;
    }

    this.height = function(){
        return axis === "horizontal" ? normalLength : axisLength;
    }
}

MapBuilder.prototype = {

    // calculate nodes' areas
    computeNodeAreas: function(){
        var node;
        for(var i = 0; i < this.pendingNodes.length; i++ ) {
            node = this.pendingNodes[i];
            if( node.opened){
                node.area = node.weight / 100 * this.boundingBox.area;
            } else {
                node.area = function(){
                    return 20 * this.currentZone.width;
                }
            }
        }
    },
    
    // place the pending nodes inside the layout box according to the aspect ratio
    squarify: function() {
        
        var node = this.pendingNodes[0];                // get next pending node
        
        // if there's no remaining pending nodes, 
        if (!node) {
            this.layoutZone();
        } else {
            // test aspect ratio of the current row with one more node in it
            if (this.worstRatio(this.layoutNodes) >= this.worstRatio(this.layoutNodes.concat(node))) {
                this.pushNextNode();                        // move the node from the pending nodes to the layout nodes
                this.squarify();                            // continue the squarify process
            }
            else {
                this.layoutZone();                     // layout the nodes 
                this.newLayoutZone();                      // init a new layout
                this.squarify();                        // restart a squarify process
            }
        }
        
    },

    // compute highest aspect ratio
    worstRatio: function(nodes) {

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
        var zone = this.currentZone;
        var w = Math.max(
            zone.axisLength * zone.axisLength * max / (totalArea * totalArea),
            totalArea * totalArea / (zone.axisLength * zone.axisLength * min)
        );
        return w;
    },
    
    // determine the position (top, left, width, height) of the nodes inside the bounding box
    layoutZone: function() {

        // compute total area of the layout nodes
        var totalArea = 0;
        var nodes = this.layoutNodes;
        var currentZone = this.currentZone;
        
        nodes.forEach(function(node) {
            totalArea += node.area;
        });

        // update the current layout area
        currentZone.area = totalArea;
        currentZone.normalLength = currentZone.area / currentZone.axisLength;

        for (var i in nodes) {
            var node = nodes[i];
            node.box = {};
            if (currentZone.axis === "vertical") {
                node.box.top = this.boundingBox.offsetTop + currentZone.offset;
                node.box.left = this.boundingBox.offsetLeft;
                node.box.width = currentZone.normalLength;
                node.box.height = node.area / node.box.width;
                currentZone.offset += node.box.height;
            }
            else {
                node.box.top = this.boundingBox.offsetTop;
                node.box.left = this.boundingBox.offsetLeft + currentZone.offset;
                node.box.height = currentZone.normalLength;
                node.box.width = node.area / node.box.height;
                currentZone.offset += node.box.width;
            }
        }
    },
    
    // initiate the layout algorithm
    newLayoutZone: function() {
        this.layoutNodes = [];
        this.pushNextNode();

        var zone, currentZone = this.currentZone;

        if (!currentZone) {
            zone = new Zone( "vertical", this.boundingBox.height);
        }
        else {
            if (currentZone.axis === "vertical") {
                this.boundingBox.offsetLeft += currentZone.normalLength;
                zone = new Zone( "horizontal", this.boundingBox.width - this.boundingBox.offsetLeft);
            }
            else {
                this.boundingBox.offsetTop += currentZone.normalLength;
                zone = new Zone( "vertical", this.boundingBox.height - this.boundingBox.offsetTop);
            }
        }
        this.currentZone = zone;
    },
    
    // push the next pending node inside the layout box
    pushNextNode: function() {
        var node = this.pendingNodes.shift();
        if( node) this.layoutNodes.push( node);
    }
};


