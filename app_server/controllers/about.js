/* GET About info */
module.exports.about = function (req, res) {
    res.render('about', { title: 'About @Dramikon' });
};