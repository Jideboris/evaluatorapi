
exports.deleteclientstudent = function (req, res) {
  var id = req.params.id;
  var raw = req.params.authdata;
  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id

        db.collection('schoolstudentcollection', function (err, collection) {
          collection.remove({ '_id': new ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred - ' + err });
            } else {

              res.send('success');
            }
          });
        });
      }
    });
  });

};
exports.getschoolstudentsdisciplinerecord = function (req, res) {
  var raw = req.params.authdata;
  var disciplinerecordid = req.params.disciplinerecordid;

  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id
        db.collection('studentdisciplinerecord', function (err, collection) {
          collection.find({ _id: new ObjectID(disciplinerecordid), schoolid: new ObjectID(clientid) }).toArray(function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred' });
            } else {
              res.send(result);
            }
          });
        });
      }
      else {
        res.send('client not found!');
      }
    });
  });

};
exports.getschoolstudentsdisciplinerecords = function (req, res) {
  var raw = req.params.authdata;
  var level = req.params.level;
  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id
        db.collection('studentdisciplinerecord', function (err, collection) {
          collection.find({ level: level, schoolid: new ObjectID(clientid) }).toArray(function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred' });
            } else {
              res.send(result);
            }
          });
        });
      }
      else {
        res.send('client not found!');
      }
    });
  });

};
exports.adddisciplinetostudentrecord = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields) {
    var level = fields.level;
    var fullname = fields.fullname;
    var dateofbirth = fields.dateofbirth;
    var offence = fields.offence;
    var penalty = fields.penalty;
    var remark = fields.remark;
    var authdata = fields.authdata;
    var decoded = common.decode(authdata);
    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];
    var dateadded = common.gettodaydate();
    var disciplinerecordid = fields.disciplinerecordid;
    var studentid = fields.studentid;

    db.collection('schoolcollection', function (err, collection) {
      collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, result) {
        if (err) {
          res.send('school not found!!');
        } else if (result[0] != '' && typeof (result[0] != 'undefined')) {
          console.log(result[0]);
          db.collection('studentdisciplinerecord', function (err, studentdisciplinerecord) {
            if (disciplinerecordid !== 'undefined') {
              studentdisciplinerecord.remove({
                '_id': new ObjectID(disciplinerecordid)
              })
            }
            studentdisciplinerecord.insert(
              {
                studentid: studentid,
                remark: remark,
                penalty: penalty,
                offence: offence,
                dateofbirth: dateofbirth,
                fullname: fullname,
                dateadded: dateadded,
                schoolid: result[0]._id,
                level: level
              }, { safe: true }, function (err, result) {
                if (err) {
                  res.send({ 'error': 'An error has occurred' });
                }
                else {
                  res.send(result);
                }
              });
          });
        }
      });
    })
  })

};
exports.deleteclientteacher = function (req, res) {
  var id = req.params.id;

  var raw = req.params.authdata;
  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id

        db.collection('schoolteachercollection', function (err, collection) {
          collection.remove({ '_id': new ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred - ' + err });
            } else {

              res.send('success');
            }
          });
        });
      }
    });
  });

}
exports.updateclientstudent = function (req, res) {
  var id = req.params.id;
  var schoolstudent = req.body;

  var raw = req.params.authdata;
  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id

        db.collection('schoolstudentcollection', function (err, collection) {
          collection.update({ '_id': new ObjectID(id) }, {
            $set: {
              schoolstudent: schoolstudent,
              schoolid: clientid
            }
          }, { safe: true }, function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred' });
            } else {
              res.send(result);

            }
          });
        });
      }
    });
  });

}
exports.updateclientteacher = function (req, res) {
  var id = req.params.id;
  var dateadded = common.gettodaydate();
  var schoolteacher = req.body;

  var raw = req.params.authdata;
  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id

        db.collection('schoolteachercollection', function (err, collection) {
          collection.update({ '_id': new ObjectID(id) }, {
            $set: {
              schoolteacher: schoolteacher,
              schoolid: clientid,
              dateadded: dateadded
            }
          }, { safe: true }, function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred' });
            } else {
              res.send(result);

            }
          });
        });
      }
    });
  });

}
exports.addteacherschoolclient = function (req, res) {
  var dateadded = common.gettodaydate();
  var schoolteacher = req.body;

  var raw = req.params.authdata;
  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  var username = schoolteacher.fullname.replace(/ /g, "");
  var item = username + schoolteacher.dateofbirth + schoolteacher.personalemail;
  var teacherpassword = common.makeid(item.toUpperCase());
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id

        db.collection('schoolteachercollection', function (err, collection) {
          collection.insert({
            schoolteacher: schoolteacher,
            schoolid: clientid,
            username: username,
            password: teacherpassword,
            dateadded: dateadded

          }, { safe: true }, function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred' });
            } else {
              res.send(JSON.stringify(result));
            }
          });
        });
      }
    });
  });

};

exports.addclientstudent = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields) {
    var dateadded = common.gettodaydate();
    var raw = fields.authdata;
    var username = fields.fullname.replace(/ /g, "");
    var dateofbirth = fields.dateofbirth;
    var personalemail = fields.personalemail;
    var parentemail = fields.parentemail;
    var fullname = fields.fullname;
    var selectedlevel = fields.selectedlevel;
    var parentnumber = fields.parentnumber;
    var studentregisteredsubjects = fields.studentregisteredsubjects;
    var decoded = common.decode(raw);

    var identity = decoded.split(':')[0];
    var password = decoded.split(':')[1];


    var item = username + dateofbirth + personalemail;
    var studentpassword = common.makeid(item.toUpperCase());
    var parentusername = parentemail;
    var parentpassword = common.makeid(parentusername.toUpperCase());


    db.collection('schoolcollection', function (err, collection) {
      collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
        if (items != '') {
          var clientid = items[0]._id
          db.collection('schoolstudentcollection', function (err, collection) {
            collection.insert({
              schoolstudent: {
                fullname: fullname,
                dateofbirth: dateofbirth,
                selectedlevel: selectedlevel,
                personalemail: personalemail,
                parentemail: parentemail,
                parentnumber: parentnumber,
                studentregisteredsubjects: studentregisteredsubjects,
                suspended: false
              },
              schoolid: clientid,
              username: username,
              password: studentpassword,
              parentusername: parentusername,
              parentpassword: parentpassword,
              dateadded: dateadded

            }, { safe: true }, function (err, result) {
              if (err) {
                res.send({ 'error': 'An error has occurred' });
              } else {
                res.send(JSON.stringify(result));
              }
            });
          });
        }
      });
    });

  })
};

exports.getteacherstudentsby = function (req, res) {
  var raw = req.params.authdata;
  var id = req.params.id;
  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id

        db.collection('schoolteachercollection', function (err, collection) {
          collection.find({ schoolid: new ObjectID(clientid), '_id': new ObjectID(id) }).toArray(function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred' });
            } else {
              res.send(result);
            }
          });
        });
      }
      else {
        res.send('client not found!');
      }
    });
  });

};
exports.getschoolstudentsby = function (req, res) {
  var raw = req.params.authdata;
  var id = req.params.id;
  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id

        db.collection('schoolstudentcollection', function (err, collection) {
          collection.find({ schoolid: new ObjectID(clientid), '_id': new ObjectID(id) }).toArray(function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred' });
            } else {
              res.send(result);
            }
          });
        });
      }
      else {
        res.send('client not found!');
      }


    });
  });

};
exports.getschoolteachers = function (req, res) {
  var raw = req.params.authdata;
  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];
  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '') {
        var clientid = items[0]._id
        db.collection('schoolteachercollection', function (err, collection) {
          collection.find({ schoolid: new ObjectID(clientid) }).toArray(function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred' });
            } else {
              res.send(result);
            }
          });
        });
      }
      else {
        res.send('client not found!');
      }


    });
  });

};
exports.getschoolstudents = function (req, res) {
  var raw = req.params.authdata;
  var selectedlevel = req.params.selectedlevel;

  var decoded = common.decode(raw);

  var identity = decoded.split(':')[0];
  var password = decoded.split(':')[1];

  db.collection('schoolcollection', function (err, collection) {
    collection.find({ regnumber: identity, schoolpasscode: password }).toArray(function (err, items) {
      if (items != '' && typeof (items) != 'undefined') {
        var clientid = items[0]._id
        db.collection('schoolstudentcollection', function (err, collection) {
          collection.find({ schoolid: new ObjectID(clientid), "schoolstudent.selectedlevel": selectedlevel }).toArray(function (err, result) {
            if (err) {
              res.send({ 'error': 'An error has occurred' });
            } else {
              res.send(result);
            }
          });
        });
      }
      else {
        db.collection('admincollection', function (err, collection) {
          collection.find({ username: identity, password: password }).toArray(function (err, items) {
            if (items != '' && typeof (items) != 'undefined') {
              var adminid = items[0]._id
              if (adminid != '') {
                db.collection('schoolstudentcollection', function (err, collection) {
                  collection.find({ "schoolstudent.selectedlevel": selectedlevel }).toArray(function (err, result) {
                    if (err) {
                      res.send({ 'error': 'An error has occurred' });
                    } else {
                      res.send(result);
                    }
                  });
                });
              }
              else {
                res.send('client not found!');
              }
            }
          });
        });

      };
    })
  })
}

