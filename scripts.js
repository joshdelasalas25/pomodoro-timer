//set timer variable for each timer mode 
const timer = {
  work: 25,
  shortBreak: 5,
};

let interval;
let currentMode = 'work';

//Main Button contains start and stop function
const mainButton = document.getElementById('main-btn');
mainButton.addEventListener('click', () => {
  const {
      action
  } = mainButton.dataset;
  action === 'start' ? startTimer() : stopTimer();

});

//Reset Button returns the timer to its default number with the given currentMode
const resetButton = document.getElementById('reset-btn');
resetButton.addEventListener('click', resetTimer);


/*==Method that calculates the time remaining==*/
function getRemainingTime(endTime) {
  //Get the current time
  const currentTime = Date.parse(new Date());
  //Then the difference between the entered value and currentTime;
  const difference = endTime - currentTime;

  //calculate the total time remaining
  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
      total,
      minutes,
      seconds,
  };
}


//Function that starts the timer
function startTimer() {
  let {
      total
  } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;


  mainButton.dataset.action = 'stop';
  mainButton.textContent = 'stop';
  mainButton.classList.add('active');

  interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();

      total = timer.remainingTime.total;
      if (total < 0) {
          clearInterval(interval);


          switch (timer.mode) {
              case 'work':

                  switchMode('shortBreak');

                  break;
              default:
                  switchMode('work');
          }

          const text = timer.mode === 'work' ? 'Get back to work!' : 'Take a break!';
          alert(text);

          startTimer();
      }
  }, 1000);
}


//Function the stops the interval to stop the time
function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = 'start';
  mainButton.textContent = 'start';
  mainButton.classList.remove('active');
}


//Function the resets the timer
function resetTimer() {
  console.log('reset');
  stopTimer();
  console.log(currentMode);
  timer.mode = currentMode;
  timer.remainingTime = {
      total: timer[currentMode] * 60,
      minutes: timer[currentMode],
      seconds: 0,
  };
  updateClock();

}

/*Handles the switching of timer modes when one of 
the timer button modes are clicked*/
const modeButtons = document.querySelector('#mode-buttons');
modeButtons.addEventListener('click', handleMode);


//updates the time of the timer
function updateClock() {
  const {
      remainingTime
  } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, '0');
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  const min = document.getElementById('minutes');
  const sec = document.getElementById('seconds');
  min.textContent = minutes;
  sec.textContent = seconds;
}


/*This function changes the max set time of the timer
whenever the mode switches*/
function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
  };

  document.querySelectorAll('button[data-mode]').forEach(e => e.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  document.body.style.backgroundColor = `var(--${mode})`;
  updateClock();
}


/*Gets an event when a mode button is pressed and
handles the changing of the mode of the timer */
function handleMode(event) {
  const {
      mode
  } = event.target.dataset;

  if (!mode) return;
  currentMode = mode;

  switchMode(mode);
  stopTimer();
}

//Defaults the timer mode to work when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  switchMode('work');
});