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

//stdent
app.get('/studentregsubjects/:authdata', students.getstudentregisteredsubjects);

app.get('/subjecttopics/:selectedsubject', edata.getsubjecttopics);
app.get('/topics/:level1/:level2/', edata.findAllTopics);
app.get('/topicsbysubject/:selectedsubject/:selectedlevel', edata.findAllSubjectTopics);
app.post('/addtopic', edata.addtopic);
app.get('/topicbyid/:id', edata.findtopicbyid);
app.put('/updatetopic/:id', edata.updatetopic);
app.delete('/deletetopic/:id', edata.deletetopic);
app.get('/locations', edata.findAllLocations);
app.post('/addlocation', edata.addlocation);
app.delete('/deletelocation/:id', edata.deletelocation);
app.get('/locationbyid/:id', edata.findLocationById);
app.put('/updatelocation/:id', edata.updatelocation);
app.get('/subjects/:level1/:level2/:level3', edata.findAllSubjects);
app.post('/addsubject', edata.addsubject);
app.get('/subjectbyid/:id', edata.findsubjectbyid);
app.put('/updatesubject/:id', edata.updatesubject);
app.delete('/deletesubject/:id', edata.deletesubject);

app.get('/admins', edata.findAllAdmins);
app.post('/addadmin', edata.addadmin);
app.delete('/deleteadmin/:id', edata.deleteadmin);
app.get('/adminbyid/:id', edata.findAdminById);
app.put('/updateadmin/:id', edata.updateadmin);


app.get('/questioncount', equestion.questioncount);
app.get('/questions', equestion.findAllQuestions);
app.post('/addlackedskillset', equestion.addlackedskillsets);
app.post('/fileUpload', equestion.uploadAvatar);
app.post('/updatefileuploaded', equestion.updatefileuploaded);
app.post('/addquestion', equestion.addquestion);
app.get('/lackedskillset', equestion.findLackedSkillSets);
app.delete('/deletelackedskillset/:id', equestion.deletelackedskillset);
app.delete('/deletequestion/:id', equestion.deletequestion);
app.get('/questionbyid/:id', equestion.findquestionbyid);
app.put('/updatequestion/:id', equestion.updatequestion);
app.get("/questionavatarbyid/:id/", equestion.findquestionavatarbyid);


app.delete('/deleteschool/:id', adminclients.deleteschool);
app.get('/schoolbyid/:id', adminclients.findschoolbyid);
app.post('/addschool', adminclients.addschool);
app.post('/updateschool', adminclients.updateschool);
app.get('/addschoolaccount/:mail/:passcode/:schoolname/:username/:license', adminclients.addschoolaccount);
app.get('/schools/:chklocked', adminclients.findschool);
app.get('/allschools', adminclients.findallschool);
app.get('/allschoolsbylock/:locked', adminclients.findalllockedschool);
app.put('/updateaccount/:id/:updatedlocked/:lock', adminclients.updateaccount);
app.get('/clientidentity/:category/:identity', adminclients.clientidentity);
app.get('/submit/:mail/:passcode/:schoolname/:username/:license', common.sendemail);

app.get('/schoolstudentsdisciplinerecords/:level/:authdata', clients.getschoolstudentsdisciplinerecords);
app.get('/schoolstudentsdisciplinerecord/:disciplinerecordid/:authdata', clients.getschoolstudentsdisciplinerecord);
app.post('/disciplinetostudentrecord', clients.adddisciplinetostudentrecord);
app.post('/addclientstudent', clients.addclientstudent);
app.put('/updateclientstudent/:id/:authdata', clients.updateclientstudent);
app.delete('/deleteclientstudent/:id/:authdata', clients.deleteclientstudent);
app.delete('/deleteclientteacher/:id/:authdata', clients.deleteclientteacher);
app.get('/schoolstudents/:selectedlevel/:authdata', clients.getschoolstudents);
app.get('/schoolstudentsby/:id/:authdata', clients.getschoolstudentsby);
app.post('/uploadbatchclientstudent', common.excelbatchprocessing);
app.post('/addteacherschoolclient/:authdata', clients.addteacherschoolclient);
app.put('/updateclientteacher/:id/:authdata', clients.updateclientteacher);
app.get('/schoolteachers/:authdata', clients.getschoolteachers);
app.get('/schoolteachersby/:id/:authdata', clients.getteacherstudentsby);

//teachers
app.get('/schoolteachersubjects/:authdata', teachers.getschoolteachersubjects);
app.get('/schoolstudentsbysubjectandlevel/:selectedlevel/:selectedsubject/:authdata', teachers.getschoolstudentsbysubjectandlevel);
app.post('/addschoolstudentsbysubjectandlevel', teachers.addschoolstudentsbysubjectandlevel);
app.post('/upadateregistersubjectlevelstudents/:authdata', teachers.upadateregistersubjectlevelstudents);
app.post('/addteacherstudentsubjectattendance', teachers.addteacherstudentsubjectattendance);

app.get('/teacherstudentsubjectattendance/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherstudentsubjectattendance);

app.get('/teacherstudentlivesubjectattendance/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherstudentlivesubjectattendance);

app.post('/schoolteacherstudentsubjectregistration', teachers.getschoolteacherstudentsubjectregistration);
app.post('/todayteachersubjecttest', teachers.addtodayteachersubjecttest);
app.get('/retrievetodaytesttopics/:subject/:level/:authdata', teachers.gettodaytesttopics);
app.get('/retrievetodaytesttopicsafter/:topid/:authdata', teachers.gettodaytesttopicsafter);
app.post('/retrievetodayteachersubjecttest', teachers.gettodayteachersubjecttest);
app.get('/retrieveteacherstudentsubjecttest/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherstudentsubjecttest);

app.post('/retrieveteacherquestionimage/:id/:authdata', teachers.getteacherquestionimage);
app.get('/retrieveteacherquestiondetails/:id/:authdata', teachers.getteacherquestionimagedetails);

app.post('/retrieveteachingmethodimage/:id/:authdata', teachers.getteachingmethodimage);
app.get('/retrieveteachingmethoddetails/:id/:authdata', teachers.getteachingmethoddetails);

app.get('/retrieveteachersuggestion/:authdata', teachers.getteachersuggestion);
app.get('/removeteacherquestions/:id/:authdata', teachers.getleftoverteacherquestions);
app.get('/removeteachersuggestion/:id/:authdata', teachers.getleftoverteachersuggestion);

app.get('/removeteachingmethod/:id/:authdata', teachers.getleftoverteachingmethod);

app.get('/retrieveteachersuggestionsbyid/:id/:authdata', teachers.getteachersuggestionsbyid);
app.get('/retrieveteacherquestionsbyid/:id/:authdata', teachers.getteacherquestionsbyid);
app.get('/retrieveteachingmethodbyid/:id/:authdata', teachers.getteachingmethodbyid);

app.get('/retrieveteacherquestionsbydates/:selecteddate/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherquestionsbydates);
app.get('/retrievetodayteachersubjectassignment/:selectedlevel/:selectedsubject/:authdata', teachers.gettodayteachersubjectassignment);
app.get('/retrieveteacherquestions/:selecteddate/:selectedlevel/:selectedsubject/:authdata', teachers.getteacherquestions);

app.get('/retrieveteachingmethod/:selectedlevel/:selectedsubject/:authdata', teachers.getteachingmethods);


app.get('/retrievenewslettersbydate/:level/:date/:authdata', teachers.getnewslettersbydate);
app.get('/retrieveteachertodaynewsletters/:level/:authdata', teachers.gettodaynewsletters);
app.post('/uploadnewsletter', teachers.addtodaynewsletters);
app.post('/uploadassignment', teachers.addtodayteachersubjectassignment);
app.post('/teachersuggestion', teachers.addteachersuggestion);
app.post('/reassignment/:done/:live/:authdata', teachers.processreassignment);
app.get('/removeassignment/:id/:selectedlevel/:selectedsubject/:authdata', teachers.deleteassignments);
app.post('/retrieveanassignment/:id/:selectedlevel/:selectedsubject/:authdata', teachers.getanassignment);
app.post('/retrieveanassignmentdetails/:id/:selectedlevel/:selectedsubject/:authdata', teachers.getanassignmentdetails);
app.post('/retrieveallassignmentsdetails/:selectedlevel/:selectedsubject/:authdata', teachers.getallassignmentsdetails);
app.post('/assignmentsscores', teachers.saveassignmentsscores);
app.post('/retrieveassignmentsscores', teachers.getassignmentsscores);
app.post('/addquestionfromteacher', teachers.savequestionfromteacher);
app.post('/teachingmethod', teachers.saveteachingmethod);
app.get('/assignmentdetails/:selectedlevel/:selectedsubject/:description/:authdata', teachers.checkassignmentdescription);
app.listen(3000);
console.log('Listening on port 3000...');
