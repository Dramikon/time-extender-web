function correctCreateLink(value) {
    newActivityLink.href = "/activity/create/" + value;
}

//think about sockets connection here
/*
function getJSON(type, url, callback) {
    $.ajax({
        type: type,
        url: url,
        dataType: 'json',
        success: callback
    });
}

function getTimeForDate(date) {
    getJSON('GET', serverBaseUrl + 'time/' + date.toDateString(), function (responce) {
        alert('data is here');
    });
}
*/

function getFormatedDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function addActivityToLog(id) {
    var date = document.getElementById('calendar').value;
    //alert('/time/' + id + '/' + date);
    window.location.href = '/time/' + id + '/' + date;
}

function updatePageByNextDate(val){
    var d = document.getElementById('calendar').value;
    var date = new Date(d);
    date.setDate(date.getDate() + val);
    window.location.href = '/time/' + getFormatedDate(date);
}

function addMinutes(id, curMins) {
    var mins = parseInt(document.getElementById('inp' + id).value);
    var d = document.getElementById('calendar').value;
    window.location.href = '/time/add/' + id + '/' + (mins + curMins) + '/' + d;
}

function deleteTimeRecord(id) {
    var d = document.getElementById('calendar').value;
    window.location.href = '/time/delete/' + id + '/' + d;
}