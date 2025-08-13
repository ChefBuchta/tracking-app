import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onDetected }: { onDetected: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<any>(null); // any to bypass missing .reset typing

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    if (videoRef.current) {
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          onDetected(result.getText());
        }
      });
    }

    return () => {
      codeReaderRef.current?.reset(); // works even if TS doesn't think it exists
    };
  }, [onDetected]);

  return <video ref={videoRef} style={{ width: "100%" }} />;
}
