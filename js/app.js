const talking = true;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("service-worker.js").then(
      function (registration) {
        console.log("ServiceWorker registered with scope:", registration.scope);
      },
      function (err) {
        console.log("ServiceWorker registration failed:", err);
      }
    );
  });
}

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

  document.querySelector("#pause").addEventListener("click", function () {
    log("Pause clicked: " + isPaused);
    snd.play();
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
};

function test() {
  console.log("test");
}

function log(msg) {
  console.log(msg);
}

var msg = new SpeechSynthesisUtterance();
var timerInterval;
var isPaused = false;
var isWorkout = true;
var snd = new Audio(
  "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
);

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
var endSound = new Audio("resource/boxing-bell.mp3");
var startSnd = new Audio("resource/startup-87026.mp3");

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
        snd.play();
        log("beep()");
      }

      if (--timer < 0) {
        isWorkout ? endSound.play() : startSnd.play();
        isWorkout ? say("rest now") : say("start excercise");
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

function say(text) {
  if (talking) {
    msg.text = text;
    msg.lang = "en";
    window.speechSynthesis.speak(msg);
  }
}

function startWorkout(timer) {
  say("Start excercise. " + timer + " sec.");

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

updateTimesData();
stopStart(true);

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
