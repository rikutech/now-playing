"use client";

import { ImasBrand, NowPlaying } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const BrandColorMap: { [key in ImasBrand]: string } = {
  [ImasBrand.AS]: "#f34f6d",
  [ImasBrand.CG]: "#2681c8",
  [ImasBrand.ML]: "#ffc30b",
  [ImasBrand.SM]: "#0fbe94",
  [ImasBrand.SC]: "#8dbbff",
};

export default function Display() {
  const wsRef = useRef<WebSocket>();
  const searchParams = useSearchParams();
  const isDebug = searchParams.get("debug") === "true";

  const [playHistory, setPlayHistory] = useState<NowPlaying[]>([]);

  useEffect(() => {
    console.log("initial socket");
    wsRef.current = new WebSocket("ws://localhost:9001");
    const { current: ws } = wsRef;

    ws.addEventListener("open", () => {
      console.log("open socket");
    });
    ws.addEventListener("message", (msg) => {
      const nowPlaying: NowPlaying = JSON.parse(msg.data);
      console.log("nowPlaying: ", nowPlaying);
      setPlayHistory((history) => [...history, nowPlaying]);
    });
  }, []);

  return (
    <main>
      <div className={`${isDebug ? "bg-black" : ""}`}>
        {playHistory.length >= 1 &&
          playHistory.map((nowPlaying, index) =>
            index === playHistory.length - 1 ? (
              <div
                key={index}
                className="flex flex-col  p-2 items-start text-white"
              >
                <p
                  className={`mb-4 rounded-sm text-3xl px-2 pb-1 imas-${nowPlaying.imasBrand}`}
                >
                  Now Playing
                </p>
                <h2 className="title font-bold text-white text-7xl mb-1">
                  {nowPlaying.title}
                </h2>
                <p className="artist text-white text-4xl">
                  {nowPlaying.artist}
                </p>
              </div>
            ) : (
              <div key={index}></div>
            )
          )}
      </div>
      <style scoped jsx>
        {`
          .imas-as {
            background-color: #f34f6d;
          }
          .imas-cg {
            background-color: #2681c8;
          }
          .imas-ml {
            background-color: #ffc30b;
          }
          .imas-sm {
            background-color: #0fbe94;
          }
          .imas-sc {
            background-color: #8dbbff;
          }

          .title {
            animation-name: fadeUpAnime;
            animation-duration: 1s;
            animation-fill-mode: forwards;
            opacity: 0;
          }

          .artist {
            animation-name: fadeUpAnime;
            animation-duration: 1s;
            animation-fill-mode: forwards;
            animation-delay: 0.2s;
            opacity: 0;
          }

          @keyframes fadeUpAnime {
            from {
              opacity: 0;
              transform: translateY(100px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </main>
  );
}
