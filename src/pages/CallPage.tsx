import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";
import { AmbientToggle } from "../components/AmbientToggle";
import {
  PhoneBoothStage,
  PhoneBoothStageName,
} from "../components/scene/PhoneBoothStage";
import { CountdownTimer } from "../components/CountdownTimer";
import { PageTransition, FadeIn } from "../components/PageTransition";
import { TouchableButton } from "../components/TouchableButton";
import { TicketPrinter } from "../components/ticket/TicketPrinter";
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

  const [showPrinter, setShowPrinter] = useState(false);
  const [boothStage, setBoothStage] = useState<PhoneBoothStageName>("idle");

  const { start: startTimer, stop: stopTimer } = useTimer(updateDuration, 1000);

  const handleEnterBooth = useCallback(() => {
    setBoothStage("inside");
  }, []);

  const handleConnect = useCallback(() => {
    setBoothStage("dialing");
    setShowPrinter(false);
    startCall();

    window.setTimeout(() => {
      setBoothStage("connected");
      setIsConnected(true);
      startTimer();
    }, 900);
  }, [startCall, setIsConnected, startTimer]);

  const handleEnd = useCallback(() => {
    updateDuration();
    stopTimer();
    endCall();
    setBoothStage("ending");

    window.setTimeout(() => {
      setShowPrinter(true);
    }, 520);
  }, [updateDuration, stopTimer, endCall]);

  const handleOpenTicket = useCallback(() => {
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

      <PageTransition className="content-layer flex min-h-screen flex-col items-center justify-center px-4">
        <div className="relative flex flex-col items-center">
          <div className="relative mb-8">
            <PhoneBoothStage stage={boothStage} />

            {boothStage === "dialing" && (
              <FadeIn className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-mist-white/60">
                正在接通时空...
              </FadeIn>
            )}
          </div>

          {isConnected ? (
            <div className="text-center">
              <FadeIn>
                <p className="mb-4 text-sm text-mist-white/60">
                  时空已接通，你可以尽情诉说
                </p>
                <CountdownTimer duration={callDuration} isActive={isConnected} />
                <p className="mt-2 text-xs text-moonlight/50">
                  对 {targetNickname} 的思念
                </p>
              </FadeIn>

              <div className="mt-12">
                <TouchableButton onClick={handleEnd} variant="secondary">
                  结束通话
                </TouchableButton>
              </div>
            </div>
          ) : showPrinter ? (
            <FadeIn className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-deep-space/92" />
              <div className="relative w-full max-w-md rounded-2xl border border-accent/25 bg-call-panel/70 px-6 py-8 shadow-[0_30px_90px_rgba(2,4,10,0.45)] backdrop-blur-md">
                <div className="mb-6 text-center">
                  <p className="mb-2 text-xl text-moonlight">你的心里话</p>
                  <p className="text-xl text-moonlight">时光已经收妥</p>
                  <p className="mt-4 text-sm text-mist-white/55">
                    现在从电话亭里打印一张专属纪念票根。
                  </p>
                </div>

                <TicketPrinter
                  targetNickname={targetNickname}
                  duration={callDuration}
                  onOpenTicket={handleOpenTicket}
                />
              </div>
            </FadeIn>
          ) : boothStage === "idle" ? (
            <div className="text-center">
              <p className="mb-6 text-sm text-mist-white/60">
                先推开门，进入时空电话亭
              </p>
              <TouchableButton onClick={handleEnterBooth}>
                进入电话亭
              </TouchableButton>
            </div>
          ) : boothStage === "inside" ? (
            <div className="text-center">
              <FadeIn>
                <p className="mb-6 text-sm text-mist-white/60">
                  拿起听筒，接通想念的另一端
                </p>
              </FadeIn>
              <TouchableButton onClick={handleConnect}>
                接通时空
              </TouchableButton>
            </div>
          ) : null}
        </div>
      </PageTransition>
    </>
  );
};
