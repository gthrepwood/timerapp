if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("js/service-worker.js").then(
      function (registration) {
        console.log("ServiceWorker registered with scope:", registration.scope);
      },
      function (err) {
        console.log("ServiceWorker registration failed:", err);
      }
    );
  });
}

/* Audio */

const talking = true;

msg = new SpeechSynthesisUtterance();
var timerInterval;
let isPaused = false;
let isWorkout = true;

var endSound = new Audio("resource/boxing-bell.mp3");
var startSnd = new Audio("resource/startup-87026.mp3");

let context;

const beepy = (freq = 520, duration = 200, vol = 100) => {
  if (context == undefined) context = new AudioContext();

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  oscillator.frequency.value = freq;
  oscillator.type = "square";
  gain.connect(context.destination);
  gain.gain.value = vol * 0.01;
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration * 0.001);
};

window.onload = function () {
  // The wake lock sentinel.
  let wakeLock = null;

  // Function that attempts to request a wake lock.
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        console.log("Wake Lock was released");
      });
      console.log("Wake Lock is active");
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };



  /* Wakelock */

  // Function that attempts to release the wake lock.
  const releaseWakeLock = async () => {
    if (!wakeLock) {
      return;
    }
    try {
      await wakeLock.release();
      wakeLock = null;
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  // Request wake lock when the page loads
  requestWakeLock();

  /* Buttons */

  document.querySelector("#pause").addEventListener("click", function () {
    log("Pause clicked: " + isPaused);
    // snd.play();
    beepy();
    stopStart();
    if (!timerInterval && !isPaused) {
      startCountdown(workoutTimer, display);
    }
  });

  document.querySelector("#stop").addEventListener("click", function () {
    log("Stop clicked");
    isPaused = false;
    isWorkout = true;
    stopStart();
    setTimeOnCounter(workoutTimer, display);
    clearInterval(timerInterval);
    timerInterval = undefined;
  });

  document.querySelector("#beepy").addEventListener("click", function () {
    // context = new AudioContext();
    beepy();
  });
};

/* test */

function test() {
  console.log("test");
}

/* Utils */

function log(msg) {
  console.log(msg);
}

/* Workout Code */

var workoutTimer = localStorage.getItem("workoutTimer"); // Default workout time
var restTimer = localStorage.getItem("restTimer"); // Default rest time

if (!workoutTimer) {
  log("No workout time set. Using default 30 sec.");
  workoutTimer = 30;
}

document.getElementById("workout-time").value = workoutTimer;
document.getElementById("rest-time").value = restTimer;

if (!restTimer) {
  log("No rest time set. Using default 30 sec.");
  restTimer = 30;
}

var display = document.querySelector("#time");

display.textContent = getMinSecTime(workoutTimer);

function getMinSecTime(timer) {
  var minutes = parseInt(timer / 60, 10);
  var seconds = parseInt(timer % 60, 10);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return " " + minutes + ":" + seconds + " ";
}

function setTimeOnCounter(timer, display) {
  display.textContent = getMinSecTime(timer);

  document.querySelector("#pause").addEventListener("click", function () {
    snd.play();
    stopStart();
    if (!timerInterval && !isPaused) {
      startCountdown(workoutTimer, display);
    }
  });

  document.querySelector("#stop").addEventListener("click", function () {
    isPaused = false;
    isWorkout = true;
    // stopStart();
    setTimeOnCounter(workoutTimer, display);
    clearInterval(timerInterval);
    timerInterval = undefined;
  });
}

function startCountdown(duration, display) {
  var timer = duration;
  clearInterval(timerInterval); // Clear any existing interval

  timerInterval = setInterval(function () {
    if (!isPaused) {
      setTimeOnCounter(timer, display);

      if (timer < 6 && timer != 0) {
        beepy();
      }

      if (--timer < 0) {
        isWorkout ? endSound.play() : startSnd.play();
        isWorkout ? sayIt("rest now") : sayIt("start excercise");
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

function stopStart(pauseValue) {
  log("Stop/Start clicked: " + pauseValue);

  if (pauseValue) {
    isPaused = pauseValue;
  } else {
    isPaused = !isPaused;
  }
  document.querySelector("#pause").innerHTML = isPaused ? "▶️" : "⏸️";
  document.getElementById("time").style.color = isPaused
    ? "grey"
    : isWorkout
    ? "green"
    : "red";
}

function sayIt(text) {
  if (talking) {
    msg.text = text;
    msg.lang = "en";
    window.speechSynthesis.speak(msg);
  }
}

function startWorkout(timer) {
  sayIt("Start excercise. " + timer + " sec.");

  clearInterval(timerInterval);
  isPaused = true;
  stopStart(false);
  workoutTimer = timer;
  startCountdown(timer, display);
  updateTimesData();
}

function updateTimesData() {
  document.getElementById("data").textContent =
    "W:" + workoutTimer + "  R:" + restTimer;
}

function changeWorkout(o) {
  startWorkout(o.value);
  display.textContent = getMinSecTime(workoutTimer);
  localStorage.setItem("workoutTimer", o.value);
  log("Workout time changed to " + o.value);
}

function changeRest(o) {
  restTimer = o.value;
  updateTimesData();
  localStorage.setItem("restTimer", o.value);
  log("Rest time changed to " + o.value);
}

updateTimesData();
stopStart(true);

document.body.style.zoom=1.0;this.blur();