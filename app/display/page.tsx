'use client';

import { useSearchParams } from 'next/navigation';


export default function Display() {
  const searchParams = useSearchParams();
  const isDebug = searchParams.get("debug") === 'true';
  return (
    <main>
      <div className={`flex flex-col  p-2 items-start text-white ${isDebug ? 'bg-black' : ''}`}>
        {/* <p className="mb-2 text-lg bg-red-500 px-1">Now Playing</p> */}
        <p className="mb-2 text-lg bg-blue-300 px-1">Now Playing</p>
        <h2 className="title font-bold text-white text-4xl">
          夢が夢じゃなくなるその日まで
        </h2>
        <p className="artist text-white text-xl">
          ノクチル (和久井優, 土屋李央, 田嶌紗蘭, 岡咲美保)
        </p>
      </div>
      <style scoped jsx>
        {`
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

          /*アニメーションの開始から終了までを指定する*/
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
