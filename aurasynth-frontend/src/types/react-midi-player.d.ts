declare module 'react-midi-player' {
    import * as React from 'react';
  
    interface MidiPlayerProps {
      src?: string;
      data?: string | ArrayBuffer | Uint8Array;
      autoplay?: boolean;
      loop?: boolean | number;
      onPlay?: () => void;
      onStop?: () => void;
      onPause?: () => void;
      onResume?: () => void;
      onEnd?: () => void;
    }
  
    const MidiPlayer: React.FC<MidiPlayerProps>;
    export default MidiPlayer;
  }
  