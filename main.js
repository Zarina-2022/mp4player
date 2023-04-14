const container = document.querySelector(".container");

mainVideo = container.querySelector("video");

progressBar = container.querySelector(".progress-bar");
videoTimeline = container.querySelector(".video-timeline");

currentVidTime = container.querySelector(".current-time");
videoDuration = container.querySelector(".video-duration");

volumeBtn = container.querySelector(".volume i");
volumeSlider = container.querySelector(".left input");

playPauseBtn = container.querySelector(".play-pause i");

skipBackward = container.querySelector(".skip-backward i");
skipForward = container.querySelector(".skip-forward i");

speedBtn = container.querySelector(".playback-speed span");
speedOptions = container.querySelector(".speed-options");

picInPicBtn = container.querySelector(".pic-in-pic span");

fullscreenBtn = container.querySelector(".fullscreen i");

//---------------------------------------------------------------------------------------
let timer;

// Hide controls

const hideControls = () => {
  if (mainVideo.paused) return; // if video is paused return
 timer = setTimeout(() => { // remove show-controls class after 3 sec
    container.classList.remove("show-controls"); 
  }, 3000);
};
hideControls();

container.addEventListener("mousemove",()=>{
    container.classList.add("show-controls"); // add show-controls class on mousemove
    clearTimeout(timer) // clear timer
    hideControls(); // calling hideControls
})

// Format Time
const formatTime = (time) => {
  // getting seconds, minutes and hours
  let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

  // adding 0 at the beginning if the particular value is less than 10
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours == 0) {
    // if hours is 0 return minutes and seconds only else  return all
    return `${minutes} : ${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};
//---------------------------------------------------------------------------------------

// Videonun ilerlemesini gosteren cizgi:
mainVideo.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target; // getting currentTime & duration of the video
  let percent = (currentTime / duration) * 100; // getting percent
  progressBar.style.width = `${percent}%`; // passing percent as progressbar width
  currentVidTime.innerText = formatTime(currentTime);
});

//--------------------------------------------------------------------------------------

// Let's update the video duration:

mainVideo.addEventListener("loadeddata", (e) => {
  videoDuration.innerText = formatTime(e.target.duration); // passing video duration as videoDuration innerText
});

// Let's update progress bar on click:
videoTimeline.addEventListener("click", (e) => {
  let timeLineWidth = videoTimeline.clientWidth; // getting videoTimeline width
  mainVideo.currentTime = (e.offsetX / timeLineWidth) * mainVideo.duration; // updating video currentTime
});

// Let's make progressBar draggable:

const draggableProgressBar = (e) => {
  let timeLineWidth = videoTimeline.clientWidth; // getting videoTimeline width
  progressBar.style.width = `${e.offsetX}px`; // passing offsetX value as progressBar width
  mainVideo.currentTime = (e.offsetX / timeLineWidth) * mainVideo.duration; // updating video currentTime
  currentVidTime.innerText = formatTime(mainVideo.currentTime); // passing video current time as currentVidTime innerText
};

videoTimeline.addEventListener("mousedown", () => {
  // calling draggableProgress function on mousemove event
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

document.addEventListener("mouseup", () => {
  // removing mousemove listener on mouse up event
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", (e) => {
  const progressTime = videoTimeline.querySelector("span");
  let offsetX = e.offsetX; // getting mouseX position
  progressTime.style.left = `${offsetX}px`; // passing offsetX value as progressTime left value
  let timeLineWidth = videoTimeline.clientWidth;
  let percent = (e.offsetX / timeLineWidth) * mainVideo.duration; // getting percent
  progressTime.innerText = formatTime(percent); // passing percent as progressTime innetText
});

//--------------------------------------------------------------------------------------

skipBackward.addEventListener("click", () => {
  mainVideo.currentTime -= 5; // subtract 5 second from the current video time
});

skipForward.addEventListener("click", () => {
  mainVideo.currentTime += 5; // add 5 second to the current video time
});

//----------------------------------------------------------------------------------------

playPauseBtn.addEventListener("click", () => {
  // If video is paused, play the video else pause the video
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

//----------------------------------------------------------------------------------------

// Let's change icon to pause if video is playing

mainVideo.addEventListener("play", () => {
  playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {
  playPauseBtn.classList.replace("fa-pause", "fa-play");
});

//----------------------------------------------------------------------------------------

// Let work on volume btn:

volumeBtn.addEventListener("click", () => {
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    // if volume icon isn't volume high icon
    mainVideo.volume = 0.5; // passing 0.5 value as video volume
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    mainVideo.volume = 0.0; // passing 0.0 value as video volume, so the video mute
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeSlider.value = mainVideo.volume; // update slider value according to the video volume
});

//------------------------------------------------------------------------------------------

// Let work on volume slider:

volumeSlider.addEventListener("input", (e) => {
  mainVideo.volume = e.target.value; // passing slider value as video volume
  if (e.target.value == 0) {
    // if slider value is 0, change icon to mute icin
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
});

//-----------------------------------------------------------------------------------------

// Let's work on video playback speed

speedBtn.addEventListener("click", () => {
  speedOptions.classList.toggle("show"); // toogle show class
});

// Let's hide options box on outside click:

document.addEventListener("click", (e) => {
  if (
    e.target.tagName !== "SPAN" ||
    e.target.className !== "material-symbols-rounded"
  ) {
    speedOptions.classList.remove("show");
  }
});

// Let's apply selected speed in the video and change active class on click:

speedOptions.querySelectorAll("li").forEach((option) => {
  option.addEventListener("click", () => {
    // addin click event on all speed options
    mainVideo.playbackRate = option.dataset.speed; // passing option dataset value as a video playback value
    speedOptions.querySelector(".active").classList.remove("active"); // removing active class
    option.classList.add("active"); // adding active class to the selected option
  });
});

//----------------------------------------------------------------------------------------

// Let's work on picture in picture button:

picInPicBtn.addEventListener("click", () => {
  mainVideo.requestPictureInPicture(); // changing video mode to picture in picture
});

//---------------------------------------------------------------------------------------

// Let's work on fullscreen button:
fullscreenBtn.addEventListener("click", () => {
  container.classList.toggle("fullscreen"); // toggle fulscreen class
  if (document.fullscreenElement) {
    // if video is already in fullscreen mode
    fullscreenBtn.classList.replace("fa-compress", "fa-expand");
    return document.exitFullscreen(); // exit from fullscreen mode and return
  }
  fullscreenBtn.classList.replace("fa-expand", "fa-compress");
  container.requestFullscreen(); // go to fullscreen mode
});

//--------------------------------------------------------------------------------------

// Let's work on hiding video controls
