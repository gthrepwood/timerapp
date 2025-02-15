if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').then(function (registration) {
      console.log('ServiceWorker registered with scope:', registration.scope);
    }, function (err) {
      console.log('ServiceWorker registration failed:', err);
    });
  });
}

window.onload = function () {

  var timerInterval;
  var isPaused = false;
  var isWorkout = true;
  var workoutTimer = 10;
  var restTimer = 10;
  var display = document.querySelector('#time');
  var snd = new Audio("boxing-bell.mp3");
  var startSnd = new Audio("startup-87026.mp3");

  function setTimeOnCounter(timer, display) {
    var minutes = parseInt(timer / 60, 10);
    var seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;
  }

  function startCountdown(duration, display) {
    var timer = duration;
    clearInterval(timerInterval); // Clear any existing interval

    timerInterval = setInterval(function () {
      if (!isPaused) {
        setTimeOnCounter(timer, display);

        if (timer < 6 && timer != 0) {
          beep();
        }

        if (--timer < 0) {
          isWorkout ? snd.play() : startSnd.play();
          clearInterval(timerInterval);
          isWorkout = !isWorkout;
          workout(isWorkout);
          startAgain();
        }
      }
    }, 1000);
  }

  function startAgain() {
    startCountdown(isWorkout ? workoutTimer : restTimer, display);
  }

  function workout(mode) {
    document.getElementById("time").style.color = mode ? "green" : "red";
  }

  function stopStart() {
    isPaused = !isPaused;
    document.querySelector('#pause').innerHTML = isPaused ? "▶️" : "⏸️";
    document.getElementById("time").style.color = isPaused ? "grey" : (isWorkout ? "green" : "red");
  }

  function startWorkout(timer) {
    clearInterval(timerInterval);
    isPaused = false;
    stopStart();
    workoutTimer = timer;
    startCountdown(timer, display);
    updateTimesData();
  }

  function updateTimesData() {
    document.getElementById('data').textContent = "W:" + workoutTimer + "  R:" + restTimer;
  }

  document.querySelector('#pause').addEventListener('click', function () {
    beep();
    stopStart();
    if (!timerInterval && !isPaused) {
      startCountdown(workoutTimer, display);
    }
  });

  document.querySelector('#set-timer-120').addEventListener('click', function () {
    startWorkout(120);
  });

  document.querySelector('#set-timer-90').addEventListener('click', function () {
    startWorkout(90);
  });

  document.querySelector('#set-timer-30').addEventListener('click', function () {
    startWorkout(30);
  });

  document.querySelector('#rest-30').addEventListener('click', function () {
    restTimer = 30;
    updateTimesData();
  });

  document.querySelector('#rest-60').addEventListener('click', function () {
    restTimer = 60;
    updateTimesData();
  });

  document.querySelector('#stop').addEventListener('click', function () {
    isPaused = false;
    isWorkout = true;
    stopStart();
    setTimeOnCounter(workoutTimer, display);
    clearInterval(timerInterval);
    timerInterval = undefined;
  });

  function beep() {
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAW...");
    snd.play();
  }

  updateTimesData();
  stopStart();
};
