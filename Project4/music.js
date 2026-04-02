const songs = [
    {
      title: "Un Día Hermoso",
      artist: "Pop Music",
      src: "songs/song1.mp3",
      cover: "images/cover1.jpg"
    },
    {
      title: "Golden Piano",
      artist: "Vintage Notes",
      src: "songs/song2.mp3",
      cover: "images/cover2.jpg"
    },
    {
      title: "Silent Waltz",
      artist: "Royal Strings",
      src: "songs/song3.mp3",
      cover: "images/cover3.jpg"
    }
  ];
  
  const audio = document.getElementById("audio");
  const title = document.getElementById("title");
  const artist = document.getElementById("artist");
  const cover = document.getElementById("cover");
  
  const playBtn = document.getElementById("play");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  
  const progress = document.getElementById("progress");
  const volume = document.getElementById("volume");
  const playlist = document.getElementById("playlist");
  
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
  
  const bars = document.querySelectorAll("#equalizer span");
  
  let index = 0;
  let isPlaying = false;
  let animationId = null;
  
  /* ---------- PLAYLIST ---------- */
  function renderPlaylist() {
    playlist.innerHTML = "";
  
    songs.forEach((song, i) => {
      const li = document.createElement("li");
      li.textContent = `${song.title} - ${song.artist}`;
  
      if (i === index) {
        li.classList.add("active");
      }
  
      li.addEventListener("click", () => {
        loadSong(i);
        playSong();
      });
  
      playlist.appendChild(li);
    });
  }
  
  function loadSong(i) {
    index = i;
    const song = songs[i];
  
    audio.src = song.src;
    title.textContent = song.title;
    artist.textContent = song.artist;
    cover.src = song.cover;
  
    progress.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
  
    renderPlaylist();
  }
  
  /* ---------- CONTROLS ---------- */
  function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸";
  }
  
  function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
  }
  
  playBtn.addEventListener("click", () => {
    if (!audio.src) {
      loadSong(index);
    }
  
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  });
  
  nextBtn.addEventListener("click", () => {
    index = (index + 1) % songs.length;
    loadSong(index);
    playSong();
  });
  
  prevBtn.addEventListener("click", () => {
    index = (index - 1 + songs.length) % songs.length;
    loadSong(index);
    playSong();
  });
  
  /* ---------- TIME / PROGRESS ---------- */
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      progress.value = (audio.currentTime / audio.duration) * 100;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationEl.textContent = formatTime(audio.duration);
    }
  });
  
  progress.addEventListener("input", () => {
    if (audio.duration) {
      audio.currentTime = (progress.value / 100) * audio.duration;
    }
  });
  
  volume.addEventListener("input", () => {
    audio.volume = volume.value;
  });
  
  audio.addEventListener("loadedmetadata", () => {
    if (audio.duration) {
      durationEl.textContent = formatTime(audio.duration);
    }
  });
  
  audio.addEventListener("ended", () => {
    index = (index + 1) % songs.length;
    loadSong(index);
    playSong();
  });
  
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return `${minutes}:${seconds}`;
  }
  
  /* ---------- EQUALIZER ---------- */
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContextClass();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audio);
  
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  function animateEqualizer() {
    animationId = requestAnimationFrame(animateEqualizer);
  
    analyser.getByteFrequencyData(dataArray);
  
    bars.forEach((bar, i) => {
      const value = dataArray[i * 2] || 0;
      const height = Math.max(15, value * 0.7);
      bar.style.height = `${height}px`;
    });
  }
  
  function resetEqualizer() {
    bars.forEach((bar) => {
      bar.style.height = "20px";
    });
  }
  
  audio.addEventListener("play", async () => {
    await audioCtx.resume();
  
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  
    animateEqualizer();
  });
  
  audio.addEventListener("pause", () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    resetEqualizer();
  });
  
  audio.addEventListener("ended", () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    resetEqualizer();
  });
  
  /* ---------- INIT ---------- */
  loadSong(index);
  audio.volume = volume.value;
  renderPlaylist();
  resetEqualizer();