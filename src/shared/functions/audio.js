import IApp from 'shared/BD/IApp';

// import {showToastText} from "./common";


export function createAudio({id, src, show, loop, useIApp}) {
  if (useIApp && IApp.checkIApp()) {
    IApp.call("createAudio", {id, src})
  } else {
    const audioElm = document.getElementById(id)
    if (!audioElm) {
      const audio = document.createElement("audio")
      audio.src = src;
      audio.className = "audio-box";
      if (show) {
        audio.style.display = "block";
      }
      if (loop) {
        audio.loop = true;
      }
      audio.controls = true
      audio.id = id
      document.body.appendChild(audio)
    }
  }
}

export function getAudioStatus({id, useIApp}) {
  return new Promise((resolve) => {
    if (useIApp && IApp.checkIApp()) {
      IApp.call("getAudioStatus", {id}, (res) => {
        resolve({
          paused: res.split("|")[0] === "paused",
          volume: parseInt(res.split("|")[1])
        })
      })
    } else {
      const audioElm = document.getElementById(id)
      if (audioElm) {
        resolve({
          paused: audioElm.paused,
          volume: audioElm.volume
        })
      } else {
        //showToastText("not found audio")
      }
    }
  })
}

export function startPlayAudio({id, useIApp}) {
  if (useIApp) {
    if (IApp.checkIApp()) {
      IApp.call("startPlayAudio", {id})
    }
  } else {
    const audioElm = document.getElementById(id)
    if (audioElm) {
      if (audioElm.paused) {
        audioElm.play();
      }
    } else {
      //showToastText("not found audio")
    }
  }
}

export function stopPlayAudio({id, useIApp}) {
  if (useIApp && IApp.checkIApp()) {
    IApp.call("stopPlayAudio", {id})
  } else {
    const audioElm = document.getElementById(id)
    if (audioElm) {
      if (!audioElm.paused) {
        audioElm.pause();
      }
    } else {
      //showToastText("not found audio")
    }
  }
}

export function muteAudio({id, useIApp}) {
  if (useIApp && IApp.checkIApp()) {
    IApp.call("muteAudio", {id})
  } else {
    const audioElm = document.getElementById(id)
    if (audioElm) {
      if (audioElm.volume) {
        audioElm.volume = 0;
      }
    } else {
      //showToastText("not found audio")
    }

  }
}

export function unMuteAudio({id, useIApp}) {
  if (useIApp && IApp.checkIApp()) {
    IApp.call("muteAudio", {id})
  } else {
    const audioElm = document.getElementById(id)
    if (audioElm) {
      if (!audioElm.volume) {
        audioElm.volume = 1;
      }
    } else {
      //showToastText("not found audio")
    }
  }
}

export function removeAudio({id, useIApp}) {
  if (useIApp && IApp.checkIApp()) {
    IApp.call("stopAudio", {id})
  } else {
    const audioElm = document.getElementById(id)
    if (audioElm) {
      document.body.removeChild(audioElm)
    } else {
      //showToastText("not found audio")
    }
  }
}
