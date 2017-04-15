var jwt = require('jwt-simple');
var auth = {
    login: login,
    validateUser: validateUser

}

function login(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, data) {

        var username = data.username || '';
        var password = data.password || '';
        var category = data.category || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        // Fire a query to your DB and check if the credentials are valid
        validate(username, password, category, function (err, output) {
            if (!output) { // If authentication fails, we send a 401 back
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid credentials"
                });
                return;
            }

            if (output) {

                // If authentication is success, we will generate a token
                // and dispatch it to the client
                res.json(genToken(output));
            }
        });

    })
};

function validate(username, password, category, callback) {
    switch (category) {
        case 'school':
            db.collection('schoolcollection', function (err, collection) {
                collection.find({ regnumber: username, locked: 0 }).toArray(function (err, items) {
                    return callback(null, items[0]);
                });
            });

            break;
        case 'admin':
            db.collection('admincollection', function (err, collection) {
                collection.find({ username: username, locked: false }).toArray(function (err, items) {
                    return callback(null, items[0]);
                });
            });
            break;
        case 'teacher':
            db.collection('schoolteachercollection', function (err, collection) {
                collection.find({ username: username, "schoolteacher.suspended": false }).toArray(function (err, items) {
                    if (items !== null && typeof (items) != 'undefined' && items.length > 0) {
                        return callback(null, items[0]);

                    }
                });
            });
            break;
        case 'student':
            db.collection('schoolstudentcollection', function (err, collection) {
                collection.find({ username: username, "schoolstudent.suspended": false }).toArray(function (err, items) {
                    return callback(null, items[0]);
                });
            });
            break;
        case 'parent':
            db.collection('schoolstudentcollection', function (err, collection) {
                collection.find({ parentusername: username, "schoolstudent.suspended": false }).toArray(function (err, items) {
                    return callback(null, items[0]);
                });
            });
            break;
        default: return;
    }
};

function validateUser(username, category, callback) {
    return validate(username, null, category, callback);
};
// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;