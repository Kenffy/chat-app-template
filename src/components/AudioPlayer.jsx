import "../assets/css/audioplayer.css";
import React, { useEffect, useRef, useState } from "react";

export const AudioPlayer = ({ audio }) => {
  const [play, setPlay] = useState(false);
  const [duration, setDuration] = useState({
    currentTime: 0,
    totalTime: 0,
    current: "0:00",
    total: "0:00",
    progress: 0,
  });
  const audioRef = useRef();
  const timeLineRef = useRef();
  const testRef = useRef();

  const formatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  const formatDuration = (time) => {
    const secs = Math.floor(time % 60);
    const mins = Math.floor(time / 60) % 60;
    const hrs = Math.floor(time / 3600);

    if (hrs === 0) {
      return `${mins}:${formatter.format(secs)}`;
    } else {
      return `${hrs}:${formatter.format(mins)}:${formatter.format(secs)}`;
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef?.current) return;
    play ? audioRef.current.pause() : audioRef.current.play();
    setPlay((prev) => !prev);
  };

  const handleTimeUpdate = () => {
    if (!audioRef?.current) return;

    const currTime = audioRef.current.currentTime;
    const totalTime = audioRef.current.duration;
    const progress = currTime / totalTime;
    setDuration((prev) => ({
      ...prev,
      currentTime: currTime,
      totalTime: totalTime,
      current: formatDuration(currTime),
      total: formatDuration(totalTime),
      progress,
    }));

    if (currTime === totalTime) {
      setPlay(false);
    }
  };

  const handleOnMouseDown = (e) => {
    if (!timeLineRef?.current) return;
    const clientRect = timeLineRef.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.clientX - clientRect.x), clientRect.width) /
      clientRect.width;

    const scrubbing = (e.button & 1) === 1;
    if (scrubbing && audioRef?.current) {
      play ? audioRef.current.pause() : audioRef.current.play();
    } else {
      const currentTime = percent * audioRef.current.duration;
      audioRef.current.currentTime = currentTime;
      const progress = currentTime / audioRef.current.duration;
      setDuration((prev) => ({
        ...prev,
        currentTime,
        current: formatDuration(currentTime),
        progress,
      }));
    }
  };

  const handleOnTimeline = (e) => {
    if (!testRef?.current) return;
    const clientRect = testRef.current.getBoundingClientRect();
    const percent = (e.clientX - clientRect.x) / clientRect.width;
    const currentTime = percent * audioRef.current.duration;
    const progress = currentTime / audioRef.current.duration;

    audioRef.current.currentTime = currentTime;
    setDuration((prev) => ({
      ...prev,
      currentTime,
      current: formatDuration(currentTime),
      progress,
    }));
  };

  return (
    <div className="audio-player">
      <span className="audio-filename">
        {audio?.filename.slice(37, audio?.filename.length)}
      </span>
      <audio onTimeUpdate={handleTimeUpdate} ref={audioRef} src={audio?.url} />
      <div className="audio-controls">
        <button onClick={handleTogglePlay}>
          <i className={play ? "fa-solid fa-pause" : "fa-solid fa-play"}></i>
        </button>
        <div
          className="progress-wrapper"
          ref={testRef}
          onMouseDown={handleOnTimeline}
        >
          <div
            className="progress-line"
            style={{ width: `calc(${duration?.progress} * 100%)` }}
          ></div>
        </div>
        {/* <div
          className="audio-timeline"
          ref={timeLineRef}
          onMouseDown={handleOnMouseDown}
        >
          <div
            className="progress-bar"
            style={{ right: `calc(100% - ${duration?.progress} * 100%)` }}
          ></div>
        </div> */}
        <div className="duration-wrapper">
          <span className="current-time">{duration?.current || "0:00"}</span>-
          <span className="total-time">{duration?.total || "0:00"}</span>
        </div>
      </div>
    </div>
  );
};
