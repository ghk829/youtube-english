import React from "react";
import styled from "styled-components";

type VideoThumbnailProps = {
  title: string;
  videoId: string;
};

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ title, videoId }) => {
  return (
    <StThumbnailWrapper>
      <img src={`https://img.youtube.com/vi/${videoId}/0.jpg`} alt={title} />
      <span>{title}</span>
    </StThumbnailWrapper>
  );
};

export default VideoThumbnail;

const StThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 336/263.33;
  display: flex;
  flex-direction: column;
  gap: 16px;

  & img {
    aspect-ratio: 336/223.33;
    border-radius: 16px;
  }

  & span {
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
