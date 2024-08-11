export interface IVideoData {
  _id: string;
  category: string;
  subcategory: string;
  url: string;
  title: string;
  subtitles: {
    start: string;
    dur: string;
    text: string;
    ko: string;
  }[];
  videoid: string;
}
