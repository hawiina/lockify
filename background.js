// Background script for handling alarms
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'pomodoroTimer') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Time is up!',
      message: 'Your pomodoro session has ended.'
    });
  }
});