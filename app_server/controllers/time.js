var request = require('request');
var dateFormat = require('dateformat');
var apiOptions = {
    server : "http://localhost:3000/",
    formatD : "yyyy-mm-dd"
};
if(process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://timeextenderweb.herokuapp.com/"
}

function getNowDate() {
    return new Date(dateFormat(new Date(), apiOptions.formatD));
}

var renderListsFunc = function (req, resp, respAct, respTime, date) {
    var message;
    if(!(respAct instanceof Array)) {
        message = "API lookup error";
        respAct = [];
    } else if(!respAct.length) {
        message = "No activities created yet";
    }
    if(!(respTime instanceof Array)) {
        message = "TIME API lookup error";
        respTime = [];
    } else if(!respTime.length) {
        message = "No time records created yet";
    }
    var totalMins = 0;
    respTime.forEach(function (t) {
        totalMins += t.minutes;
        respAct.forEach(function (act) {
            if(t.activityId === act._id) {
                t.name = act.name;
                t.type = act.type;
            }
        });
    });

    var dataObject = {
        title: 'Todays waisted time @Dramikon',
        totalMinutes: totalMins,
        date: dateFormat(date, apiOptions.formatD),
        activities: respAct,
        timeLog: respTime,
        message: message
    };
    resp.render('index', dataObject);
};

/* GET today time page */
module.exports.todayLog = function (req, res) {
    var pathActivities = 'api/activities';
    var requestActivitiesOptions = {
        url : apiOptions.server + pathActivities,
        method : "GET",
        json : {},
        qs : {}
    };

    var pathTime = 'api/time';
    var requestTimeOptions = {
        url : apiOptions.server + pathTime,
        method : "GET",
        json : {},
        qs : {}
    };

    request(requestActivitiesOptions, function (err, resp, bodyAct) {
        request(requestTimeOptions, function (err, resp, bodyTime) {
            renderListsFunc(req, res, bodyAct, bodyTime, getNowDate());
        });
    });
};

/* GET time page by date */
module.exports.logByDate = function (req, res) {
    var pathActivities = 'api/activities';
    var requestActivitiesOptions = {
        url : apiOptions.server + pathActivities,
        method : "GET",
        json : {},
        qs : {}
    };
    var date;
    if(!req.params || !req.params.date) {
        date = dateFormat(new Date(), apiOptions.formatD);
    } else {
        date = dateFormat(new Date(req.params.date), apiOptions.formatD);
    }

    var pathTime = 'api/time/';
    var requestTimeOptions = {
        url : apiOptions.server + pathTime + date,
        method : "GET",
        json : {},
        qs : {}
    };

    request(requestActivitiesOptions, function (err, resp, bodyAct) {
        request(requestTimeOptions, function (err, resp, bodyTime) {
            renderListsFunc(req, res, bodyAct, bodyTime, date);
        });
    });
};

/* GET time page with added activity */
module.exports.addActivity = function (req, res) {
    var pathActivities = 'api/activities';
    var requestActivitiesOptions = {
        url : apiOptions.server + pathActivities,
        method : "GET",
        json : {},
        qs : {}
    };
    if(!req.params || !req.params.date || !req.params.activityId) {
        return todayLog();
    }
    var date = dateFormat(new Date(req.params.date), apiOptions.formatD);

    var pathTime = 'api/time/';
    var requestTimeOptions = {
        url : apiOptions.server + pathTime + date,
        method : "GET",
        json : {},
        qs : {}
    };

    var requestTimeAddActivitOptions = {
        url : apiOptions.server + pathTime,
        method : "POST",
        json : {
            date : date,
            activityId : req.params.activityId,
            minutes : 0,
            isGood : false
        },
        qs : {}
    };
    request(requestTimeAddActivitOptions, function(err, resp, bodyAdded){
        request(requestActivitiesOptions, function (err, resp, bodyAct) {
            request(requestTimeOptions, function (err, resp, bodyTime) {
                renderListsFunc(req, res, bodyAct, bodyTime, date);
            });
        });
    });
};

/* GET time page with added time for activity */
module.exports.addTime = function (req, res) {
    var pathActivities = 'api/activities';
    var requestActivitiesOptions = {
        url : apiOptions.server + pathActivities,
        method : "GET",
        json : {},
        qs : {}
    };
    if(!req.params || !req.params.date || !req.params.timeRecordId || !req.params.mins) {
        return todayLog();
    }
    var date = dateFormat(new Date(req.params.date), apiOptions.formatD);

    var pathTime = 'api/time/';
    var requestTimeOptions = {
        url : apiOptions.server + pathTime + date,
        method : "GET",
        json : {},
        qs : {}
    };

    var requestTimeAddActivityOptions = {
        url : apiOptions.server + pathTime + req.params.timeRecordId,
        method : "PUT",
        json : {
            date : date,
            activityId : req.params.activityId,
            minutes : req.params.mins,
            isGood : false
        },
        qs : {}
    };
    request(requestTimeAddActivityOptions, function(err, resp, bodyAdded){
        request(requestActivitiesOptions, function (err, resp, bodyAct) {
            request(requestTimeOptions, function (err, resp, bodyTime) {
                renderListsFunc(req, res, bodyAct, bodyTime, date);
            });
        });
    });
};

/* GET time page with deleted activity */
module.exports.deleteTimeLog = function (req, res) {
    var pathActivities = 'api/activities';
    var requestActivitiesOptions = {
        url : apiOptions.server + pathActivities,
        method : "GET",
        json : {},
        qs : {}
    };
    if(!req.params || !req.params.date || !req.params.timeRecordId) {
        return todayLog();
    }
    var date = dateFormat(new Date(req.params.date), apiOptions.formatD);

    var pathTime = 'api/time/';
    var requestTimeOptions = {
        url : apiOptions.server + pathTime + date,
        method : "GET",
        json : {},
        qs : {}
    };

    var requestTimeDeleteActivityOptions = {
        url : apiOptions.server + pathTime + req.params.timeRecordId,
        method : "DELETE",
        json : {},
        qs : {}
    };
    request(requestTimeDeleteActivityOptions, function(err, resp, bodyAdded){
        request(requestActivitiesOptions, function (err, resp, bodyAct) {
            request(requestTimeOptions, function (err, resp, bodyTime) {
                renderListsFunc(req, res, bodyAct, bodyTime, date);
            });
        });
    });
};