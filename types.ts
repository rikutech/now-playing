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
  961: '961',
  ALL: 'all'
} as const;

export type ImasBrand = (typeof  ImasBrand)[keyof typeof ImasBrand];