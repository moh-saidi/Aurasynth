import React, { useState, useEffect } from "react";
import ReactMidiPlayer from "react-midi-player";

interface Props {
  url: string;
}

const MidiPlayer: React.FC<Props> = ({ url }) => {
  const [error, setError] = useState<string | null>(null);

  // Handle errors during fetch or playback
  useEffect(() => {
    setError(null);
    console.log(`Fetching MIDI file from: ${url}`);
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch MIDI file: ${res.status} ${res.statusText}`);
        }
        return res.arrayBuffer();
      })
      .then((data) => {
        console.log("MIDI file size:", data.byteLength, "bytes");
        if (data.byteLength === 0) {
          setError("MIDI file is empty");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(`Error loading MIDI file: ${err.message}`);
      });
  }, [url]);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <ReactMidiPlayer
        src={url}
        loop={false}
        autoplay={false}
        onPlay={() => {
          console.log("MIDI playback started");
          setError(null);
        }}
        onStop={() => {
          console.log("MIDI playback stopped");
        }}
        onPause={() => {
          console.log("MIDI playback paused");
        }}
        onResume={() => {
          console.log("MIDI playback resumed");
        }}
        onEnd={() => {
          console.log("MIDI playback ended");
        }}
      />
      <button
        onClick={() => {
          const link = document.createElement("a");
          link.href = url;
          link.download = url.split("/").pop() || "midi-file.mid";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log("Download triggered");
        }}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
      >
        Download
      </button>
      {error && (
        <div className="text-red-600 mt-2" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default MidiPlayer;