"use client";
import { useEffect, useRef, useState } from "react";
import { ImasBrand, NowPlaying, Song } from "../types";
import { setlist } from "@/setlist";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>(setlist);
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const wsRef = useRef<WebSocket>();
  
  useEffect(() => {
    console.log("initial socket");
    wsRef.current = new WebSocket("ws://localhost:9001");
    const { current: ws } = wsRef;

    ws.addEventListener("open", () => {
      console.log("open socket");
    });
  }, []);  

  const addSong = () => {
    setSongs([...songs, { artist: "", title: "", imasBrand: ImasBrand.AS }]);
  };

  const changeTitle = (i: number, value: string) => {
    songs[i].title = value;
    setSongs([...songs]);
  };

  const changeArtist = (i: number, value: string) => {
    songs[i].artist = value;
    setSongs([...songs]);
  };

  const selectBrand = (i: number, value: string) => {
    songs[i].imasBrand = value as ImasBrand;
    setSongs([...songs]);
  }

  const moveUp = (i: number) => {
    console.log("moveUp", i);
    if (i === 0) return;
    let _songs = [...songs];
    console.log("songs: ", songs);
    const targetSong = _songs[i - 1];
    console.log("targetSong: ", targetSong);
    _songs[i - 1] = _songs[i];
    _songs[i] = targetSong;
    console.log("changedSongs: ", _songs);
    setSongs([..._songs]);
  };

  const moveDown = (i: number) => {
    if (i === songs.length - 1) return;
    let _songs = [...songs];
    const targetSong = _songs[i + 1];
    _songs[i + 1] = _songs[i];
    _songs[i] = targetSong;
    setSongs([..._songs]);
  };

  const deleteSong = (i: number) => {
    songs.splice(i, 1);
    setSongs([...songs]);
  };

  const playNext = () => {
    if (currentSong === null || currentSong === songs.length - 1) {
      return 
    }
    syncCurrentSong(currentSong + 1);
  };

  const playBack = () => {
    if (currentSong === null || currentSong === 0) {
      return
    }
    syncCurrentSong(currentSong - 1);
  }

  const play = () => {
    syncCurrentSong(0);
  }

  const syncCurrentSong = (index: number) => {
    setCurrentSong(index);
    const currentSong = songs[index];
    const { current: ws } = wsRef;
    if (!ws || !currentSong) return; 
    const nowPlaying: NowPlaying = {
      title: currentSong.title,
      artist: currentSong.artist,
      imasBrand: currentSong.imasBrand,
      trackNumber: index + 1,
    }
    ws.send(JSON.stringify(nowPlaying));
  }

  return (
    <main className="w-screen h-screen">
      <div className="w-full p-4">
        <h1 className="font-bold text-black text-3xl mb-4">セットリスト</h1>
        <div className="flex flex-col space-y-4 items-stretch mb-4">
          {songs.map((song, i) => (
            <div
              className={`flex flex-row space-x-3 ${
                currentSong === i ? "border-2 border-red-600" : ""
              }`}
              key={i}
            >
              <input
                className="border p-1 rounded-md flex-1"
                value={song.title}
                onChange={(e) => changeTitle(i, e.target.value)}
                placeholder="Title"
              />
              <input
                className="border p-1 rounded-md flex-1"
                value={song.artist}
                onChange={(e) => changeArtist(i, e.target.value)}
                placeholder="Artist"
              />
              <select value={song.imasBrand} className="border p-1 rounded-md" name="brand" id="brand" onChange={(e) => selectBrand(i, e.target.value)}>
                <option value={ImasBrand.AS}>AS</option>
                <option value={ImasBrand.CG}>デレ</option>
                <option value={ImasBrand.ML}>ミリ</option>
                <option value={ImasBrand.SM}>M</option>
                <option value={ImasBrand.SC}>シャニ</option>
                <option value={ImasBrand[961]}>961</option>
                <option value={ImasBrand.ALL}>合同</option>
              </select>
              <div className="flex flex-row space-x-1">
                <button onClick={() => moveUp(i)}>↑</button>
                <button onClick={() => moveDown(i)}>↓</button>
                <button onClick={() => deleteSong(i)}>削除</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-10 items-start">
          <button
            className=" bg-blue-600 text-xl text-white px-2 py-1 rounded-md"
            onClick={addSong}
          >
            追加
          </button>
          <div className="flex flex-row items-start space-x-2">
            {currentSong === null ? (
              <button
                className=" bg-red-600 text-xl text-white px-2 py-1 rounded-md"
                onClick={play}
              >
                再生
              </button>
            ) : (
              <div className="flex flex-col">
              <p>NowPlaying: {songs[currentSong].title}</p>
              <div className="flex flex-row space-x-2">
                <button
                  className=" bg-red-600 text-xl text-white px-2 py-1 rounded-md"
                  onClick={playBack}
                >
                  前の曲
                </button>
                <button
                  className=" bg-red-600 text-xl text-white px-2 py-1 rounded-md"
                  onClick={playNext}
                >
                  次の曲
                </button>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
