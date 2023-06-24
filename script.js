let alarms = [];

// To update time
function updateTime() {
  var currentTime = new Date();
  var hrs = currentTime.getHours();
  var min = currentTime.getMinutes();
  var sec = currentTime.getSeconds();

  if (hrs >= 12) {
    document.getElementById('clock-meridian').innerHTML = 'PM';
  } else {
    document.getElementById('clock-meridian').innerHTML = 'AM';
  }

  document.getElementById('clock-hour').innerHTML = formatTime(hrs);
  document.getElementById('clock-minute').innerHTML = formatTime(min);
  document.getElementById('clock-second').innerHTML = formatTime(sec);
}

function formatTime(time) {
  return time < 10 ? '0' + time : time;
}

setInterval(updateTime, 1000);

// Taking Input and Saving Alarm
function takeInput() {
  var hrsInput = document.getElementById('alarm-hour').value;
  var minInput = document.getElementById('alarm-minute').value;
  var meridianInput = document.getElementById('alarm-meridian').value;

  if (hrsInput === '' || minInput === '' || parseInt(hrsInput) > 12 || parseInt(minInput) > 59) {
    alert("Please enter valid time");
  } else {
    if (meridianInput === "PM" && parseInt(hrsInput) !== 12) {
      hrsInput = parseInt(hrsInput) + 12;
    }
    var alarm = {
      hrs: parseInt(hrsInput),
      min: parseInt(minInput),
      meri: meridianInput,
      id: Date.now().toString(),
      ringed: false,
      timeRemaining: 0
    };
    document.getElementById('alarm-hour').value = "";
    document.getElementById('alarm-minute').value = "";
    saveAlarm(alarm);
  }
}

function saveAlarm(alarm) {
  alarms.push(alarm);

  var currentTime = new Date();
  var date = new Date().getDate();
  var inputTime = new Date();

  inputTime.setDate(date);
  inputTime.setHours(alarm.hrs);
  inputTime.setMinutes(alarm.min);
  inputTime.setSeconds(0);

  if (inputTime < currentTime) {
    inputTime.setDate(date + 1);
  }

  var difference = inputTime - currentTime;
  alarm.timeRemaining = difference;

  var hourRemain = Math.floor((difference / (1000 * 60 * 60)) % 24);
  var minRemain = Math.floor((difference / (1000 * 60)) % 60);
  var secRemain = Math.floor((difference / 1000) % 60);

  alert("Your alarm will ring in " + hourRemain + " hours " + minRemain + " minutes " + secRemain + " seconds");

  renderAlarm(alarm);
  startAlarmTimer(alarm);
}

const alarmList = document.getElementById('saved-alarm-list');

function renderAlarm(alarm) {
  const li = document.createElement('li');
  li.setAttribute('data-id', alarm.id);
  li.innerHTML = `
    <p>${formatTime(alarm.hrs)}:${formatTime(alarm.min)} ${alarm.meri}</p>
    <img src="https://cdn-icons-png.flaticon.com/16/1214/1214428.png" class="delete" onclick="deleteAlarm('${alarm.id}')">
  `;
  alarmList.appendChild(li);
}

// Alarm Ring
function startAlarmTimer(alarm) {
  alarm.timerId = setTimeout(function () {
    ringAlarm(alarm);
    deleteAlarm(alarm.id);
  }, alarm.timeRemaining);
}

function ringAlarm(alarm) {
  if (!alarm.ringed) {
    alert("Alarm Ringed!!!");
    alarm.ringed = true;
  }
}

// Delete Alarm
function deleteAlarm(alarmId) {
  const alarm = alarms.find((alarm) => alarm.id === alarmId);
  if (alarm) {
    clearTimeout(alarm.timerId);
    alarms = alarms.filter((alarm) => alarm.id !== alarmId);
    renderAlarms();
    alert("Alarm Deleted Successfully");
  }
}

function renderAlarms() {
  alarmList.innerHTML = "";

  for (const alarm of alarms) {
    renderAlarm(alarm);
  }
}
