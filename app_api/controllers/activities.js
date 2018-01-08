var service = require('./service');
var codes = require('./codes');

var mongoose = require('mongoose');
var activities = mongoose.model('Activity');


//get list
module.exports.getList = function (req, res) {
    //console.log("V_LOG: request");
    activities
        .find()
        .exec(function (err, list) {
            if(!list || !list.length) {
                service.errorResp(res, "no activities in the data base");
                return;
            } else if(err) {
                service.jsonResp(res, codes.CODE_404, err);
                return;
            }
            service.jsonResp(res, codes.CODE_200, list);
        });
};

//get one
module.exports.getActivity = function (req, res) {
    //console.log("V_LOG: param request");
    if(req.params && req.params.activityId) {
        activities
            .findById(req.params.activityId)
            .exec(function (err, activity) {
                if(!activity) {
                    service.errorResp(res, "activity with id " +  req.params.activityId + " was not found");
                    return;
                } else if(err) {
                    service.jsonResp(res, codes.CODE_404, err);
                    return;
                }
                service.jsonResp(res, codes.CODE_200, activity);
            });
    } else {
        service.errorResp(res, "no activityId in request");
    }
};

//post one
module.exports.createNew = function (req, res) {
    activities
        .create({
            name: req.body.name,
            type: req.body.type,
            description: req.body.description
        }, function(err, activity){
            if(err) {
                service.jsonResp(res, codes.CODE_400, err);
            } else {
                service.jsonResp(res, codes.CODE_201, activity);
            }
        });
};

//put one
module.exports.edit = function (req, res) {
    if(req.params && req.params.activityId) {
        activities
            .findById(req.params.activityId)
            .exec(function (err, activity) {
                if(!activity) {
                    service.errorResp(res, "activity with id " +  req.params.activityId + " was not found");
                    return;
                } else if(err) {
                    service.jsonResp(res, codes.CODE_404, err);
                    return;
                }
                activity.name = req.body.name;
                activity.type = req.body.type;
                activity.description = req.body.description;

                activity.save(function (err, result) {
                    if(err) {
                        service.jsonResp(res, codes.CODE_400, err);
                    } else {
                        service.jsonResp(res, codes.CODE_200, result);
                    }
                });
            });
    } else {
        service.errorResp(res, "no activityId in request");
    }
};

//get - add time logged for activity
/*module.exports.addTimeForActivity = function (req, res) {
    if(req.params && req.params.activityId && req.params.minutesAdd) {
        activities
            .findById(req.params.activityId)
            .exec(function (err, activity) {
                if(!activity) {
                    service.errorResp(res, "activity with id " +  req.params.activityId + " was not found");
                    return;
                } else if(err) {
                    service.jsonResp(res, codes.CODE_404, err);
                    return;
                }
                activity.totalMinutes += parseInt(req.params.minutesAdd);

                activity.save(function (err, result) {
                    if(err) {
                        service.jsonResp(res, codes.CODE_400, err);
                        return;
                    } else {
                        service.jsonResp(res, codes.CODE_200, result);
                        return;
                    }
                });
            });
    } else {
        service.errorResp(res, "no activityId or minutesAdd in request");
    }
};
*/

//delete one
module.exports.delete = function (req, res) {
    if(req.params && req.params.activityId) {
        activities
            .findByIdAndRemove(req.params.activityId)
            .exec(function (err, activity) {
                if(err) {
                    service.jsonResp(res, codes.CODE_400, err);
                    return;
                } else {
                    service.jsonResp(res, codes.CODE_204, null);
                }
            });
    } else {
        service.errorResp(res, "no activityId in request");
    }
};