var Map,
User;

function defineModels(mongoose, fn) {
    console.log('Loading models');

    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    /**
     * Model: Map
     */
    Map = new Schema({
        'data': String,
        'userId': {
            type: ObjectId,
            index: true
        },
        'createdAt': {
            type: Date,
            default: Date.now
        },
        'modifiedAt': { 
            type: Date, 
            default: Date.now 
        }
    });

    Map.virtual('id')
        .get(function () {
        return this._id.toHexString();
    });

    /**
     * Model: User
     */

    function validatePresenceOf(value) {
        return value && value.length;
    }

    User = new Schema({
        'provider': {
            type: String,
            validate: [validatePresenceOf, 'a provider is required'],
            index: true
        },
        'providerId': {
            type: String,
            validate: [validatePresenceOf, 'an id is required'],
            index: true
        },
        'displayName': {
            type: String,
            validate: [validatePresenceOf, 'a display name is required'],
            index: true
        },
        'email': {
            type: String,
            validate: [validatePresenceOf, 'an email is required'],
            index: {
                unique: true
            }
        },
        'createdAt': {
            type: Date,
            default: Date.now
        },
        'modifiedAt': { 
            type: Date, 
            default: Date.now 
        }
        
    });

    User.virtual('id')
        .get(function() {
        return this._id.toHexString();
    });

    User.pre('save', function(next) {
        if (!validatePresenceOf(this.password)) {
            next(new Error('Invalid password'));
        } else {
            next();
        }
    });


    mongoose.model('Map', Map);
    mongoose.model('User', User);

    fn();
}

exports.defineModels = defineModels;