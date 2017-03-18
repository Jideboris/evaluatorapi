
exports.getstudentregisteredsubjects = function (req, res) {
    var raw = req.params.authdata;
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];
 
    db.collection('schoolstudentcollection', function (err, collection) {
        collection.find({ username: identity, password: password }).toArray(function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result[0].schoolstudent.studentregisteredsubjects);
            }
        });
    });
};




