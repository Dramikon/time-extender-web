var express = require('express');
var router = express.Router();
var ctrlTime = require('../controllers/time');
var ctrlActivities = require('../controllers/activities');
var ctrlReport = require('../controllers/report');
var ctrlAbout = require('../controllers/about');
var ctrlPartners = require('../controllers/partners');


/* GET home page. */
router.get('/', ctrlTime.todayLog);
router.get('/time/:date', ctrlTime.logByDate);
router.get('/time/:activityId/:date', ctrlTime.addActivity);
router.get('/time/add/:timeRecordId/:mins/:date', ctrlTime.addTime);
router.get('/time/delete/:timeRecordId/:date', ctrlTime.deleteTimeLog);
router.get('/report', ctrlReport.report);
router.get('/activities', ctrlActivities.list);
router.get('/activity/', ctrlActivities.new);
router.get('/activity/create/:name', ctrlActivities.newWithName);
router.post('/activity/create', ctrlActivities.post);
router.post('/activity/create/:activityId', ctrlActivities.post);
router.get('/activity/:activityId', ctrlActivities.find);
router.get('/partners', ctrlPartners.list);
router.get('/about', ctrlAbout.about);

module.exports = router;