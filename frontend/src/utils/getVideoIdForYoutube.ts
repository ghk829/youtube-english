// YouTube URL에서 비디오 ID를 추출하는 함수
export const getVideoId = (url) => {
  const videoId = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/
  )[1];
  return videoId;
};
