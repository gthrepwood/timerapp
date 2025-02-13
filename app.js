if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
      console.log('ServiceWorker registered with scope:', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed:', err);
    });
  });
}

function startCountdown(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = 0;
    }
  }, 1000);
}

window.onload = function () {
  var twoMinutes = 60 * 2,
      display = document.querySelector('#time');
  startCountdown(twoMinutes, display);
};
