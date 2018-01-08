var service = require('./service');
var codes = require('./codes');

var mongoose = require('mongoose');
var timerecords = mongoose.model('TimeRecord');
var activities = mongoose.model('Activity');

var dateFormat = require('dateformat');
var apiOptions = {
    formatD : "yyyy-mm-dd"
};


module.exports.getToday = function (req, res) {
    getDataByDate(new Date(dateFormat(new Date(), apiOptions.formatD)), res)
};

module.exports.getByDate = function (req, res) {
    if(req.params && req.params.date) {
        getDataByDate(req.params.date, res);
    } else {
        service.errorResp(res, "no date in request");
    }
};

function handleListResult(res, err, list) {
    if(!list || !list.length) {
        service.errorResp(res, "no time records in the data base");
        return;
    } else if(err) {
        service.jsonResp(res, codes.CODE_404, err);
        return;
    }
    service.jsonResp(res, codes.CODE_200, list);
}

//inner function to call getting of data for time records by date
function getDataByDate(date, res) {
    timerecords
        .find({date : date})
        .exec(function (err, respBody) {
            handleListResult(res, err, respBody)
        });
}

//inner function to call getting of data for time records by date
function getDataByDatePeriod(dateFrom, dateTo, res) {
    timerecords
        .find({
            date : {$gt : dateFrom, $lt : dateTo},
        })
        .exec(function (err, respBody) {
            handleListResult(res, err, respBody)
        });
}

module.exports.getByPeriod = function (req, res) {
    if(req.params && (req.params.dateFrom || req.params.dateTo)) {
        getDataByDatePeriod(req.params.dateFrom, req.params.dateTo, res);
    } else {
        service.errorResp(res, "no date in request");
    }
};

function addTotalActivityMinutes(minutes, activityId, callback) {
    activities
        .findById(activityId)
        .exec(function (err, activity) {
            if(!activity) {
                service.errorResp(res, "activity with id " +  req.params.activityId + " was not found");
                return;
            } else if(err) {
                service.jsonResp(res, codes.CODE_404, err);
                return;
            }
            activity.totalMinutes += minutes;

            activity.save(function (err, result) {
                if(err) {
                    service.jsonResp(res, codes.CODE_400, err);
                    return;
                } else {
                    //service.jsonResp(res, codes.CODE_200, result);
                    callback();
                    return;
                }
            });
        });
};

//post
module.exports.createNewRecord = function (req, res) {
    timerecords
        .create({
            date : req.body.date,
            activityId : req.body.activityId,
            minutes : req.body.minutes,
            isGood : req.body.isGood
        }, function(err, record){
            if(err) {
                service.jsonResp(res, codes.CODE_400, err);
            } else {
                addTotalActivityMinutes(req.body.minutes, req.body.activityId, function () {
                    service.jsonResp(res, codes.CODE_201, record);
                });
            }
        });
};

//put
module.exports.editRecord = function (req, res) {
    if(req.params && req.params.recordId) {
        timerecords
            .findById(req.params.recordId)
            .exec(function (err, record) {
                if(!record) {
                    service.errorResp(res, "time record with id " +  req.params.recordId + " was not found");
                    return;
                } else if(err) {
                    service.jsonResp(res, codes.CODE_404, err);
                    return;
                }
                var timeDelta = req.body.minutes - record.minutes;
                console.log('DELTA ' + timeDelta);
                record.date = req.body.date;
                record.minutes = req.body.minutes;
                record.isGood = req.body.isGood;

                record.save(function (err, result) {
                    if(err) {
                        service.jsonResp(res, codes.CODE_400, err);
                    } else {
                        //add time delta
                        addTotalActivityMinutes(timeDelta, record.activityId, function () {
                            service.jsonResp(res, codes.CODE_200, record);
                        });
                    }
                });
            });
    } else {
        service.errorResp(res, "no recordId in request");
    }
};

//delete
module.exports.deleteRecord = function (req, res) {
    console.log('Delete received' + req.params.recordId);
    if(req.params && req.params.recordId) {
        timerecords
            .findByIdAndRemove(req.params.recordId)
            .exec(function (err, record) {
                if(err) {
                    service.jsonResp(res, codes.CODE_400, err);
                    return;
                } else {
                    service.jsonResp(res, codes.CODE_204, null);
                }
            });
    } else {
        service.errorResp(res, "no recordId in request");
    }
};