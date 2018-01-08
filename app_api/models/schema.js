var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: String,
    description: String,
    totalMinutes: { type: Number, "default": 0, min: 0 },
    rate: {type: Number, "default": 0, min: 0, max: 0}
});

var timeRecordSchema = new mongoose.Schema({
    date: { type: Date, required: true, "default": Date.now(), index: true },
    activityId: mongoose.Schema.Types.ObjectId,
    minutes: { type: Number, "default": 0, min: 0 },
    isGood: {type: Boolean, "default": false }
});

var achievementsSchema = new mongoose.Schema({
    date: { type: Date, required: true, "default": Date.now() },
    activityId: mongoose.Schema.Types.ObjectId,
    complexity: {type: Number, "default": 0, min: 0, max: 0},
    importance: {type: Number, "default": 0, min: 0, max: 0},
    description: String
});

var daySchema = new mongoose.Schema({
    date: { type: Date, required: true, "default": Date.now(), index: true },
    isGood: {type: Boolean, "default": false }
});

mongoose.model('Achievement', achievementsSchema, 'achievements');
mongoose.model('Activity', activitySchema, 'activities');
mongoose.model('Day', daySchema, 'days');
mongoose.model('TimeRecord', timeRecordSchema, 'timerecords');