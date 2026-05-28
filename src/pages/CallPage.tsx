import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";
import { AmbientToggle } from "../components/AmbientToggle";
import { PhoneBoothStage, PhoneBoothStageName } from "../components/scene/PhoneBoothStage";
import { CountdownTimer } from "../components/CountdownTimer";
import { PageTransition, FadeIn } from "../components/PageTransition";
import { TouchableButton } from "../components/TouchableButton";
import { useAppStore } from "../store/useAppStore";
import { useTimer } from "../hooks/useTimer";

export const CallPage = () => {
  const navigate = useNavigate();
  const {
    userNickname,
    targetCategory,
    targetNickname,
    isConnected,
    callDuration,
    startCall,
    endCall,
    updateDuration,
    setIsConnected,
  } = useAppStore();

  const [showEndMessage, setShowEndMessage] = useState(false);
  const [boothStage, setBoothStage] = useState<PhoneBoothStageName>("idle");

  const { start: startTimer, stop: stopTimer } = useTimer(updateDuration, 1000);

  const handleEnterBooth = useCallback(() => {
    setBoothStage("inside");
  }, []);

  const handleConnect = useCallback(() => {
    setBoothStage("dialing");
    setShowEndMessage(false);
    startCall();

    setTimeout(() => {
      setBoothStage("connected");
      setIsConnected(true);
      startTimer();
    }, 900);
  }, [startCall, setIsConnected, startTimer]);

  const handleEnd = useCallback(() => {
    stopTimer();
    endCall();
    setBoothStage("ending");

    setTimeout(() => {
      setShowEndMessage(true);
    }, 520);
  }, [stopTimer, endCall]);

  const handleContinue = useCallback(() => {
    navigate("/ticket");
  }, [navigate]);

  useEffect(() => {
    if (!userNickname && !targetCategory && !targetNickname) {
      navigate("/entry");
    }
  }, [userNickname, targetCategory, targetNickname, navigate]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return (
    <>
      <StarBackground />
      <AmbientToggle />

      <PageTransition className="content-layer min-h-screen flex flex-col items-center justify-center px-4">
        <div className="relative flex flex-col items-center">
          {/* 电话亭插画 */}
          <div className="relative mb-8">
            <PhoneBoothStage stage={boothStage} />

            {/* 连接状态文字 */}
            {boothStage === "dialing" && (
              <FadeIn className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-mist-white/60 text-sm whitespace-nowrap">
                正在接通时空...
              </FadeIn>
            )}
          </div>

          {/* 通话状态 */}
          {isConnected ? (
            <div className="text-center">
              <FadeIn>
                <p className="text-mist-white/60 text-sm mb-4">
                  时空已接通，你可以尽情诉说
                </p>
                <CountdownTimer duration={callDuration} isActive={isConnected} />
                <p className="text-moonlight/50 text-xs mt-2">
                  对 {targetNickname} 的思念
                </p>
              </FadeIn>

              <div className="mt-12">
                <TouchableButton onClick={handleEnd} variant="secondary">
                  结束通话
                </TouchableButton>
              </div>
            </div>
          ) : boothStage === "idle" ? (
            <div className="text-center">
              <p className="text-mist-white/60 text-sm mb-6">
                先推开门，进入时空电话亭
              </p>
              <TouchableButton onClick={handleEnterBooth}>
                进入电话亭
              </TouchableButton>
            </div>
          ) : boothStage === "inside" ? (
            <div className="text-center">
              <FadeIn>
                <p className="text-mist-white/60 text-sm mb-6">
                  拿起听筒，接通想念的另一端
                </p>
              </FadeIn>
              <TouchableButton onClick={handleConnect}>
                接通时空
              </TouchableButton>
            </div>
          ) : null}
        </div>

        {/* 结束消息弹窗 */}
        {showEndMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-deep-space/90" />
            <FadeIn className="relative card-base p-8 max-w-sm text-center">
              <p className="text-xl text-moonlight mb-2">
                你的心里话
              </p>
              <p className="text-xl text-moonlight mb-6">
                时光都收到了
              </p>

              <p className="text-mist-white/60 text-sm mb-8">
                本次通话时长：{Math.floor(callDuration / 60)}分
                {callDuration % 60}秒
              </p>

              <TouchableButton onClick={handleContinue}>
                查看纪念票根
              </TouchableButton>
            </FadeIn>
          </div>
        )}
      </PageTransition>
    </>
  );
};
