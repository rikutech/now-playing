export type NowPlaying = {
  title: string;
  artist: string;
  trackNumber: number;
  imasBrand: ImasBrand;
}

export type Song = {
  artist: string;
  title: string;
  imasBrand: ImasBrand;
};

export const ImasBrand = {
  AS: 'as',
  CG: 'cg',
  ML: 'ml',
  SM: 'sm',
  SC: 'sc',
} as const;

export type ImasBrand = (typeof  ImasBrand)[keyof typeof ImasBrand];