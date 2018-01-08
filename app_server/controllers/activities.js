var request = require('request');
var apiOptions = {
    server : "http://localhost:3000/"
};
if(process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://timeextenderweb.herokuapp.com/"
}

/* GET list of all activities */
module.exports.list = function (req, res) {
    var path = 'api/activities';
    var requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {}
    };
    request(requestOptions, function (err, resp, body) {
        renderListFunc(req, res, body);
    });
};

var renderListFunc = function (req, resp, respBody) {
    var message;
    if(!(respBody instanceof Array)) {
        message = "API lookup error";
        respBody = [];
    } else if(!respBody.length) {
        message = "No activities created yet";
    }
    var dataObject = {
        title: 'List of all activities @Dramikon',
        totalMinutes: 0,
        activities: respBody,
        message: message
    };
    resp.render('activities', dataObject);
};

/* GET activity by ID */
module.exports.find = function (req, res) {
    var path = 'api/activities/' + req.params.activityId;
    var requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {}
    };
    request(requestOptions, function (err, resp, body) {
        renderDetailsFunc(req, res, body, 'Edit Activity');
    });
};

var renderDetailsFunc = function (req, resp, respBody, title) {
    var message;
    if(!respBody) {
        message = "API lookup error or no such data";
        respBody = {};
    }
    var dataObject = {
        title: title,
        activity: respBody,
        message: message
    };
    resp.render('activity', dataObject);
};

/* GET create new activity */
module.exports.new = function (req, res) {
    res.render('activity', {
        title: 'Create Activity'
    });
};

/* GET create new activity with pre-filled name */
module.exports.newWithName = function (req, res) {
    var message, respBody;
    if(!req.params || !req.params.name) {
        message = "No name param in query string";
        respBody = {};
    } else {
        respBody = {
            name: req.params.name,
            type: "",
            description: ""
        };
    }
    renderDetailsFunc(req, res, respBody, 'Create Activity');
};

/* POST create new activity */
module.exports.post = function (req, res) {
    var path = 'api/activities';
    var type = 'POST';
    console.log('TMX: ' + req.params.activityId);
    if(req.params && req.params.activityId) {
        //edit case
        path += '/' + req.params.activityId;
        type = 'PUT';
        console.log('TMX_PUT: ' + req.params.activityId);
    }
    var postData = {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description
    };
    var requestOptions = {
        url : apiOptions.server + path,
        method : type,
        json : postData,
        qs : {}
    };
    request(requestOptions, function (err, resp, body) {
        if(resp.statusCode === 201) {
            renderDetailsFunc(req, res, body, 'Edit Activity');
        } else {
            //show error
        }
    });
};

/*module.exports.list = function (req, res) {
    res.render('activities',
        {
            title: 'List of all activities @Dramikon',
            totalMinutes: 1095,
            activities: [{
                name: 'Express Work',
                type: 'Self Development',
                description: 'Book reading, research and coding own projects to understand better Express framework',
                totalMinutes: 200
            },{
                name: 'Node.JS Work',
                type: 'Self Development',
                description: 'Book reading, research and coding own projects to understand better Node.JS server',
                totalMinutes: 230
            },{
                name: 'Outlook',
                type: 'Self Development',
                description: 'Mails reading and reply',
                totalMinutes: 250
            },{
                name: 'Staffing',
                type: 'Self Development',
                description: 'Staffing related activities',
                totalMinutes: 415
            }]
        });
};*/