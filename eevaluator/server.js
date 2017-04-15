var express = require('express');
path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
mime = require('mime');
cors = require('cors');

mongo = require('mongodb');
MongoClient = mongo.MongoClient
fs = require('fs');
formidable = require('formidable');
// path = require('path');
mailer = require("nodemailer");
Mailgun = require('mailgun-js');
mg = require('nodemailer-mailgun-transport');
nodemailer = require('nodemailer');
sendgrid = require('sendgrid')('jideboris', 'computer123');
EmailTemplates = require('email-templates').EmailTemplate;

Server = mongo.Server,
    connect = mongo.Connect,
    Db = mongo.Db,
    ObjectID = mongo.ObjectID;
Binary = mongo.Binary;
//put in environmental variable
//process.env.MONGOLAB_URI = 'mongodb://jideboris:computer123@ds033096.mlab.com:33096/evaluatordb';
//set MONGOLAB_URI=mongodb://jideboris:computer123@ds033096.mlab.com:33096/evaluatordb
url = process.env.MONGOLAB_URI;
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, database) {

    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to', url);
        db = database;
        // do some work here with the database.

        //Close connection
        // db.close();
    }
});


var students = require('./routes/students');
var edata = require('./routes/edata');
var equestion = require('./routes/questions');
var clients = require('./routes/clients');
var adminclients = require('./routes/adminclients');
var teachers = require('./routes/teachers');
var auth = require('./routes/auth');
var version = '/api/v1/';

common = require('./routes/common');


var app = express();

app.engine('html', require('ejs').renderFile);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
app.all('/api/v1/*', [require('./middlewares/validaterequest')]);

//login
app.post('/login', auth.login);
//stdent
app.get(version + 'studentregsubjects/:authdata', students.getstudentregisteredsubjects);

app.get(version + 'subjecttopics/:selectedsubject', edata.getsubjecttopics);
app.get(version + 'topics/:level1/:level2/', edata.findAllTopics);
app.get(version + 'topicsbysubject/:selectedsubject/:selectedlevel', edata.findAllSubjectTopics);
app.post(version + 'addtopic', edata.addtopic);
app.get(version + 'topicbyid/:id', edata.findtopicbyid);
app.put(version + 'updatetopic/:id', edata.updatetopic);
app.delete(version + 'deletetopic/:id', edata.deletetopic);
app.get(version + 'locations', edata.findAllLocations);
app.post(version + 'addlocation', edata.addlocation);
app.delete(version + 'deletelocation/:id', edata.deletelocation);
app.get(version + 'locationbyid/:id', edata.findLocationById);
app.put(version + 'updatelocation/:id', edata.updatelocation);
app.get(version + 'subjects/:level1/:level2/:level3', edata.findAllSubjects);
app.post(version + 'addsubject', edata.addsubject);
app.get(version + 'subjectbyid/:id', edata.findsubjectbyid);
app.put(version + 'updatesubject/:id', edata.updatesubject);
app.delete(version + 'deletesubject/:id', edata.deletesubject);

app.get(version + 'admins', edata.findAllAdmins);
app.post(version + 'addadmin', edata.addadmin);
app.delete(version + 'deleteadmin/:id', edata.deleteadmin);
app.get(version + 'adminbyid/:id', edata.findAdminById);
app.put(version + 'updateadmin/:id', edata.updateadmin);


app.get(version + 'questioncount', equestion.questioncount);
app.get(version + 'questions', equestion.findAllQuestions);
app.post(version + 'addlackedskillset', equestion.addlackedskillsets);
app.post(version + 'fileUpload', equestion.uploadAvatar);
app.post(version + 'updatefileuploaded', equestion.updatefileuploaded);
app.post(version + 'addquestion', equestion.addquestion);
app.get(version + 'lackedskillset', equestion.findLackedSkillSets);
app.delete(version + 'deletelackedskillset/:id', equestion.deletelackedskillset);
app.delete(version + 'deletequestion/:id', equestion.deletequestion);
app.get(version + 'questionbyid/:id', equestion.findquestionbyid);
app.put(version + 'updatequestion/:id', equestion.updatequestion);
app.get(version + 'questionavatarbyid/:id/', equestion.findquestionavatarbyid);


app.delete(version + 'deleteschool/:id', adminclients.deleteschool);
app.get(version + 'schoolbyid/:id', adminclients.findschoolbyid);
app.post(version + 'addschool', adminclients.addschool);
app.post(version + 'updateschool', adminclients.updateschool);
app.get(version + 'addschoolaccount/:mail/:passcode/:schoolname/:username/:license', adminclients.addschoolaccount);
app.get(version + 'schools/:chklocked', adminclients.findschool);
app.get(version + 'allschools', adminclients.findallschool);
app.get(version + 'allschoolsbylock/:locked', adminclients.findalllockedschool);
app.put(version + 'updateaccount/:id/:updatedlocked/:lock', adminclients.updateaccount);
app.get(version + 'clientidentity/:category/:identity', adminclients.clientidentity);
app.get(version + 'submit/:mail/:passcode/:schoolname/:username/:license', common.sendemail);

app.get(version + 'schoolstudentsdisciplinerecords/:level/:authdata', clients.getschoolstudentsdisciplinerecords);
app.get(version + 'schoolstudentsdisciplinerecord/:disciplinerecordid/:authdata', clients.getschoolstudentsdisciplinerecord);
app.post(version + 'disciplinetostudentrecord', clients.adddisciplinetostudentrecord);
app.post(version + 'addclientstudent', clients.addclientstudent);
app.put(version + 'updateclientstudent/:id/:authdata', clients.updateclientstudent);
app.delete(version + 'deleteclientstudent/:id/:authdata', clients.deleteclientstudent);
app.delete(version + 'deleteclientteacher/:id/:authdata', clients.deleteclientteacher);
app.get(version + 'schoolstudents/:selectedlevel/:authdata', clients.getschoolstudents);
app.get(version + 'schoolstudentsby/:id/:authdata', clients.getschoolstudentsby);
app.post(version + 'uploadbatchclientstudent', common.excelbatchprocessing);
app.post(version + 'addteacherschoolclient/:authdata', clients.addteacherschoolclient);
app.put(version + 'updateclientteacher/:id/:authdata', clients.updateclientteacher);
app.get(version + 'schoolteachers/:authdata', clients.getschoolteachers);
app.get(version + 'schoolteachersby/:id/:authdata', clients.getteacherstudentsby);

//teachers
app.get(version + 'schoolteachersubjects/:authdata', teachers.getschoolteachersubjects);
app.get(version + 'schoolstudentsbysubjectandlevel/:selectedlevel/:selectedsubject/:authdata', teachers.getschoolstudentsbysubjectandlevel);
app.post(version + 'addschoolstudentsbysubjectandlevel', teachers.addschoolstudentsbysubjectandlevel);
app.post(version + 'upadateregistersubjectlevelstudents/:authdata', teachers.upadateregistersubjectlevelstudents);
app.post(version + 'addteacherstudentsubjectattendance', teachers.addteacherstudentsubjectattendance);

app.get(version + 'teacherstudentsubjectattendance/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherstudentsubjectattendance);

app.get(version + 'teacherstudentlivesubjectattendance/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherstudentlivesubjectattendance);

app.post(version + 'schoolteacherstudentsubjectregistration', teachers.getschoolteacherstudentsubjectregistration);
app.post(version + 'todayteachersubjecttest', teachers.addtodayteachersubjecttest);
app.get(version + 'retrievetodaytesttopics/:subject/:level/:authdata', teachers.gettodaytesttopics);
app.get(version + 'retrievetodaytesttopicsafter/:topid/:authdata', teachers.gettodaytesttopicsafter);
app.post(version + 'retrievetodayteachersubjecttest', teachers.gettodayteachersubjecttest);
app.get(version + 'retrieveteacherstudentsubjecttest/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherstudentsubjecttest);

app.post(version + 'retrieveteacherquestionimage/:id/:authdata', teachers.getteacherquestionimage);
app.get(version + 'retrieveteacherquestiondetails/:id/:authdata', teachers.getteacherquestionimagedetails);

app.post(version + 'retrieveteachingmethodimage/:id/:authdata', teachers.getteachingmethodimage);
app.get(version + 'retrieveteachingmethoddetails/:id/:authdata', teachers.getteachingmethoddetails);

app.get(version + 'retrieveteachersuggestion/:authdata', teachers.getteachersuggestion);
app.get(version + 'removeteacherquestions/:id/:authdata', teachers.getleftoverteacherquestions);
app.get(version + 'removeteachersuggestion/:id/:authdata', teachers.getleftoverteachersuggestion);

app.get(version + 'removeteachingmethod/:id/:authdata', teachers.getleftoverteachingmethod);

app.get(version + 'retrieveteachersuggestionsbyid/:id/:authdata', teachers.getteachersuggestionsbyid);
app.get(version + 'retrieveteacherquestionsbyid/:id/:authdata', teachers.getteacherquestionsbyid);
app.get(version + 'retrieveteachingmethodbyid/:id/:authdata', teachers.getteachingmethodbyid);

app.get(version + 'retrieveteacherquestionsbydates/:selecteddate/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherquestionsbydates);
app.get(version + 'retrievetodayteachersubjectassignment/:selectedlevel/:selectedsubject/:authdata', teachers.gettodayteachersubjectassignment);
app.get(version + 'retrieveteacherquestions/:selecteddate/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherquestions);

app.get(version + 'retrieveteachingmethod/:selectedlevel/:selectedsubject/:authdata', teachers.getteachingmethods);


app.get(version + 'retrievenewslettersbydate/:level/:date/:authdata', teachers.getnewslettersbydate);
app.get(version + 'retrieveteachertodaynewsletters/:level/:authdata', teachers.gettodaynewsletters);
app.post(version + 'uploadnewsletter', teachers.addtodaynewsletters);
app.post(version + 'uploadassignment', teachers.addtodayteachersubjectassignment);
app.post(version + 'teachersuggestion', teachers.addteachersuggestion);
app.post(version + 'reassignment/:done/:live/:authdata', teachers.processreassignment);
app.get(version + 'removeassignment/:id/:selectedlevel/:selectedsubject/:authdata', teachers.deleteassignments);
app.post(version + 'retrieveanassignment/:id/:selectedlevel/:selectedsubject/:authdata', teachers.getanassignment);
app.post(version + 'retrieveanassignmentdetails/:id/:selectedlevel/:selectedsubject/:authdata', teachers.getanassignmentdetails);
app.post(version + 'retrieveallassignmentsdetails/:selectedlevel/:selectedsubject/:authdata', teachers.getallassignmentsdetails);
app.post(version + 'assignmentsscores', teachers.saveassignmentsscores);
app.post(version + 'retrieveassignmentsscores', teachers.getassignmentsscores);
app.post(version + 'addquestionfromteacher', teachers.savequestionfromteacher);
app.post(version + 'teachingmethod', teachers.saveteachingmethod);
app.get(version + 'assignmentdetails/:selectedlevel/:selectedsubject/:description/:authdata', teachers.checkassignmentdescription);

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Start the server
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
