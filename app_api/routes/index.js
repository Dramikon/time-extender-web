var express = require('express');
var router = express.Router();
var ctrlTime = require('../controllers/time');
var ctrlActivities = require('../controllers/activities');

router.get('/time', ctrlTime.getToday);
router.get('/time/:date', ctrlTime.getByDate);
router.get('/time/:dateFrom/:dateTo', ctrlTime.getByPeriod);
router.post('/time', ctrlTime.createNewRecord);
router.put('/time/:recordId', ctrlTime.editRecord);
router.delete('/time/:recordId', ctrlTime.deleteRecord);

router.get('/activities', ctrlActivities.getList);
router.get('/activities/:activityId', ctrlActivities.getActivity);
//router.get('/activities/:activityId/:minutesAdd', ctrlActivities.addTimeForActivity);
router.post('/activities', ctrlActivities.createNew);
router.put('/activities/:activityId', ctrlActivities.edit);
router.delete('/activities/:activityId', ctrlActivities.delete);

module.exports = router;