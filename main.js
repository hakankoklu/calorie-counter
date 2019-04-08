'use strict';


// Shortcuts to DOM Elements.
var oneLogButton = document.getElementById('one-log-button');
var backButton = document.getElementById('back-button');
var forwardButton = document.getElementById('forward-button');
var newLogField = document.getElementById('one-log-description');
var newLogCount = document.getElementById('one-log-count');
var allLogsContent = document.getElementById('all-logs-grid');
var allLogsTab = document.getElementById('all-logs-tab');
var dayHeader = document.getElementById('days-date');

// local storage data model:
// calories: [{date: somedate, calories: [{description: breakfast, count: 300, date: somedate, time: sometime}]}, {}]

function addLog(position) {
    var newLog = newLogField.value;
    var newCount = newLogCount.value;
    var timestamp = new Date();
    var dateString = getDateString(timestamp);
    var timeString = getTimeString(timestamp);
    var logData = {
        "description": newLog,
        "count": newCount,
        "date": dateString,
        "time": timeString
    };
    console.log("Data to log...");
    console.log(logData);

    // TODO: add to local storage
    saveLog(logData)
    console.log("Data is logged.");
    newLogField.value = "";
    newLogCount.value = "";
}

function saveLog(logData) {
    console.log("Trying to save log...");
    if (!getLocalStorage("calories")) {
        var newCalories = [{"date": logData["date"], "calories": [logData]}]
        addLocalStorage("calories", newCalories);
        return;
    }
    var calories = getLocalStorage("calories");
    var lastDay = calories[calories.length - 1]
    if (lastDay["date"] != logData["date"]) {
        var newDay = {"date": logData["date"], "calories": [logData]}
        calories.push(newDay);
    }
    else {
        lastDay["calories"].push(logData);
    }
    addLocalStorage("calories", calories);
}

function addLocalStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function getLocalStorage(key) {
    if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
    }
    else {
        return null;
    }
}

function getDateString(timestamp) {
    var year = timestamp.getFullYear().toString();
    var month = padZero((timestamp.getMonth() + 1).toString());
    var day = padZero(timestamp.getDate().toString());
    return year + "-" + month + "-" + day
}

function getTimeString(timestamp) {
    var hour = padZero(timestamp.getHours().toString());
    var minute = padZero(timestamp.getMinutes().toString());
    var second = padZero(timestamp.getSeconds().toString());
    return hour + ":" + minute + ":" + day
}

function padZero(num) {
    if (num.length === 1) {
        num = '0' + num;
    }
    return num
}

function getTimeString(timestamp) {
     return timestamp.getHours() + ":" + timestamp.getMinutes() + ":" + timestamp.getSeconds()
}

function renderAllLogs() {
    var calories = getLocalStorage("calories");
    if (!calories) {
        return;
    }
    var day = calories[calories.length - 1]
    renderDay(day["date"], day["calories"]);
}

function goBack() {
    var calories = getLocalStorage("calories");
    if (!calories) {
        return;
    }
    console.log("Previous day...");
    var current_day = dayHeader.firstChild.firstChild.data;
    console.log(current_day);
    for (var i = calories.length - 1; i >= 0; i--) {
        if (calories[i]["date"] === current_day && i - 1 >= 0) {
            renderDay(calories[i - 1]["date"], calories[i - 1]["calories"]);
        }
    }
}

function goForward() {
    var calories = getLocalStorage("calories");
    if (!calories) {
        return;
    }
    console.log("Next day...");
    var current_day = dayHeader.firstChild.firstChild.data;
    console.log(current_day);
    for (var i = calories.length - 1; i >= 0; i--) {
        if (calories[i]["date"] === current_day && i + 1 < calories.length) {
            renderDay(calories[i + 1]["date"], calories[i + 1]["calories"]);
        }
    }
}

function renderDay(date, calories) {
    while (allLogsContent.firstChild) {
        allLogsContent.removeChild(allLogsContent.firstChild);
    }
    if (dayHeader.firstChild) {
        dayHeader.removeChild(dayHeader.firstChild);
    }
    allLogsContent.innerHtml = "";
    var table = document.createElement('table');
    table.setAttribute('class', 'mdl-data-table mdl-js-data-table');
    var tableBody = document.createElement('tbody');

    var row = document.createElement('tr');
    var timeHead = document.createElement('th');
    timeHead.appendChild(document.createTextNode('Time'));

    var logHead = document.createElement('th');
    logHead.appendChild(document.createTextNode('Log'));

    var countHead = document.createElement('th');
    countHead.appendChild(document.createTextNode('Count'));

    row.appendChild(logHead);
    row.appendChild(timeHead);
    row.appendChild(countHead);

    tableBody.appendChild(row);
    
    var totalCalories = 0;
    calories.forEach(function(doc) {
        var row = document.createElement('tr');

        var logTimeText = document.createTextNode(doc["time"]);
        
        var logTextText = document.createTextNode(doc["description"]);

        var countText = document.createTextNode(doc["count"]);
        totalCalories += parseInt(doc["count"]);
        
        var logTimeCell = document.createElement('td');
        logTimeCell.appendChild(logTimeText);
        var logTextCell = document.createElement('td');
        logTextCell.appendChild(logTextText);
        var countCell = document.createElement('td');
        countCell.appendChild(countText);
        
        row.appendChild(logTimeCell);
        row.appendChild(logTextCell);
        row.appendChild(countCell);
    
    tableBody.appendChild(row);
    });
    var lastRow = document.createElement('tr');
    var emptyCell = document.createElement('td');
    emptyCell.appendChild(document.createTextNode(""));
    var totalCell = document.createElement('td');
    totalCell.appendChild(document.createTextNode("Total:"));
    var totalCountCell = document.createElement('td');
    totalCountCell.appendChild(document.createTextNode(totalCalories.toString()));
    lastRow.appendChild(emptyCell);
    lastRow.appendChild(totalCell);
    lastRow.appendChild(totalCountCell);
    tableBody.appendChild(lastRow);
    table.appendChild(tableBody);
    var dayHeaderContent = document.createElement('h5');
    dayHeaderContent.appendChild(document.createTextNode(date));
    dayHeader.appendChild(dayHeaderContent);
    allLogsContent.appendChild(table);
}


// Bindings on load.
window.addEventListener('load', function() {
    oneLogButton.addEventListener('click', addLog);
    backButton.addEventListener('click', goBack);
    forwardButton.addEventListener('click', goForward);
    allLogsTab.addEventListener('click', renderAllLogs);
}, false);