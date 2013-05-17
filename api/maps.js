

// Read map
exports.findById = function(req, res, next) {
    console.log('Loading map: ' + id);
    Map.findById({_id: req.params.id}, function(err, map){
        if(err) {
            console.log('Error loading map: ' + err);
            res.json( 500, {'message':'An error has occurred while loading the map', 'error': err});
        } else if( !map){
            console.log('No map found in db');
            res.json( 500, {'message':'No map found in db'});
        } else {
            console.log('Loading succeed');
            res.send(map.toObject());
        } 
    });
};

// Update map
exports.updateById = function(req, res) {
    console.log( 'Updating map: ' + id);
    Map.findById({_id: req.params.id}, function(err, map){
        if (err) {
            console.log('Error updating map: ' + err);
            res.json( 500, {'message':'An error has occurred while updating the map', 'error': err});
        } else if( !map){
            console.log('No map found in db');
            res.json( 500, {'message':'No map found in db'});
        } else {
            map.data = req.body.data;
            map.save(function (err) {
                if (err) {
                    console.log('Error updating map: ' + err);
                    res.json( 500, {'message':'An error has occurred while updating the map', 'error': err});
                } else {
                    console.log('Updating succeed');
                    res.send(map.toObject()); 
                }
            });
        }
    });
};
