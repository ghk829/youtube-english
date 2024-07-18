import React, { useState, useEffect, useRef } from 'react';
import '../page/css/detailPage.css';
import LongButton from '../components/LongButton';
import { useNavigate } from "react-router-dom";
import { initializePlayer, destroyPlayer, handleScriptChange, handlePlayerStateChange, rewindVideoToScriptSegment } from '../utils/youtubePlayerUtils'; // 경로에 따라 실제 파일 경로를 수정해야 할 수 있습니다.

const VideoDetail = ({ translations, url, step, autoPlay, onEnd, isModalOpen, setStep }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const stepRef = useRef(step);
  const [activeScriptIndex, setActiveScriptIndex] = useState(null);
  const [isShadowing, setIsShadowing] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isLast, setIsLast] = useState(false);

  const scriptWrapperRef = useRef(null);
  const repeatCountRef = useRef(1);
  const refs = useRef([]);

  // YouTube 플레이어 초기화 및 관리
  useEffect(() => {
    const onPlayerStateChange = (event) => {
      handlePlayerStateChange(event, onEnd, stepRef, setStep);
    };

    initializePlayer(url, videoRef, autoPlay, setPlayer, translations, onPlayerStateChange, stepRef, player);

    return () => {
      destroyPlayer(player);
    };
  }, [url, autoPlay]);

  // 스크립트 변경 및 진행 상태 처리
  useEffect(() => {
    return handleScriptChange(player, translations, activeScriptIndex, step, setStep, setActiveScriptIndex, setIsLast, scriptWrapperRef, refs, repeatCountRef, setProgress);
  }, [player, translations, activeScriptIndex, step, setStep]);

  // 비디오 상태 변경 처리
  const handleStateChange = (event) => {
    handlePlayerStateChange(event, onEnd, stepRef, setStep);
  };

  // 자막 위치로 비디오 돌리기
  const rewindToScriptSegment = (start) => {
    rewindVideoToScriptSegment(player, isShadowing, setProgress, repeatCountRef, start);
  };

  return (
    <div className='video-detail'>
      {/* 자동 재생 중인 경우 메시지 표시 */}
      {autoPlay && <div>자동 재생 중</div>}

      <div className='video-wrapper'>
        <div ref={videoRef}></div>  {/* 비디오 플레이어 요소 */}
      </div>

      {/* 첫 번째 단계가 아닌 경우 진행 바 표시 */}
      {step !== 1 && (
        <div className='bar-wrapper'>
          <div className='shadowing-bar' style={{ width: `${progress}%` }}></div>  {/* 섀도잉 진행률 */}
        </div>
      )}

      {/* 첫 번째 단계인 경우 가이드 메시지 표시 */}
      {step === 1 && (
        <div className='shadowing-guide'>
          <p>자막 없이 영상을 들어보세요.</p>
        </div>
      )}

      {/* 스크립트 표시 */}
      {step !== 1 && translations.length > 1 && (
        <div className='scripts-wrapper' ref={scriptWrapperRef}>
          {/* 각 자막 항목 매핑 */}
          {translations.map((item, key) => (
            <div className={`script`} key={key} onClick={() => rewindToScriptSegment(item.start)} style={{ cursor: "pointer" }}>
              <div className='script-num-wrapper'>
                {/* 자막 번호 표시 */}
                <div className='script-num' style={{ backgroundColor: activeScriptIndex === key ? '#903FF6' : '#ABABAB', color: "white" }}>{key + 1}</div>
              </div>
              <ul style={{ margin: 0, padding: 0 }}>
                <li className='script-content' ref={(el) => (refs.current[key] = el)} style={{ backgroundColor: key === activeScriptIndex ? "#F0E6FD" : "" }}>
                  {/* 자막 텍스트 표시 */}
                  <div className='script-text'>{item.text}</div>
                  {/* 두 번째 단계이고 활성화된 자막인 경우 번역 텍스트 표시 */}
                  {step === 2 && key === activeScriptIndex && <div className='script-translation'>{item.ko}</div>}
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 로딩 중 메시지 */}
      {step === 0 && translations.length < 1 && <div>로딩중...</div>}

      <div className='video-bottom-nav'>
        {/* 두 번째 단계이고 마지막 자막이 아닌 경우 종료 버튼 표시 */}
        {step === 2 && !isLast && (
          <LongButton color="inactive" width="298px">학습 종료하기</LongButton>
        )}

        {/* 두 번째 단계이고 마지막 자막인 경우 모달 열기 버튼 표시 */}
        {step === 2 && isLast && (
          <LongButton color="purple" onClick={() => isModalOpen(true)} width="298px">학습 종료하기</LongButton>
        )}
      </div>
    </div>
  );
};

export default VideoDetail;
