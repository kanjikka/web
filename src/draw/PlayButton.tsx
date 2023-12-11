import { useEffect, useRef, useState } from "react";

function getFullPath(src: string) {
  return `/audio-files/${src}`;
}
export function PlayButton(props: { src: string; controls?: boolean }) {
  const { src, controls } = props;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Every time we stop or play, let's also stop all other audios
  useEffect(() => {
    const audios = document.querySelectorAll("audio");
    audios.forEach((a) => a.pause());

    if (audioPlaying) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [audioPlaying]);

  useEffect(() => {
    function onPlay(event) {
      const audios = document.querySelectorAll("audio");
      const otherAudios = Array.from(audios).filter((a) => {
        return a !== audioRef.current;
      });

      otherAudios.forEach((a) => {
        a.currentTime = 0;
        a.pause();
      });
    }

    audioRef.current.addEventListener("play", onPlay);
    return () => {
      // TODO: i think this is incorrect
      audioRef.current?.removeEventListener("play", onPlay);
    };
  }, [audioRef.current]);

  // Sometimes controls are useful, since it makes it clear which one is playing
  if (controls) {
    return <audio ref={audioRef} controls loop src={getFullPath(src)} />;
  }

  return (
    <>
      <audio ref={audioRef} loop src={getFullPath(src)} />
      <button
        onClick={() => {
          if (!audioRef.current) {
            return;
          }

          setAudioPlaying((s) => !s);
        }}
      >
        🔊
      </button>
    </>
  );
}
