import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";
import { AmbientToggle } from "../components/AmbientToggle";
import { TicketCard } from "../components/TicketCard";
import { TicketReveal } from "../components/ticket/TicketReveal";
import { TouchableButton } from "../components/TouchableButton";
import { PageTransition } from "../components/PageTransition";
import { useAppStore, Ticket } from "../store/useAppStore";
import { getMessageByCategory } from "../data/messages";

const formatTimestamp = (date: Date) =>
  `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

export const TicketPage = () => {
  const navigate = useNavigate();
  const {
    userNickname,
    targetCategory,
    targetNickname,
    callDuration,
    addToHistory,
    resetCallState,
  } = useAppStore();

  const ticket = useMemo<Ticket>(() => {
    const now = new Date();

    return {
      id: Date.now().toString(),
      userNickname: userNickname || "陌生人",
      targetCategory,
      targetNickname: targetNickname || "ta",
      duration: callDuration,
      timestamp: formatTimestamp(now),
      message: getMessageByCategory(targetCategory),
    };
  }, [userNickname, targetCategory, targetNickname, callDuration]);

  useEffect(() => {
    if (callDuration === 0) {
      navigate("/entry");
      return;
    }

    addToHistory(ticket);
  }, [callDuration, ticket, addToHistory, navigate]);

  const handleBack = () => {
    resetCallState();
    navigate("/");
  };

  return (
    <>
      <StarBackground />
      <AmbientToggle />

      <PageTransition className="content-layer flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <TicketReveal>
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-accent/70">
              Printed Keepsake
            </p>
            <h1 className="font-serif text-3xl text-moonlight">
              专属纪念票根
            </h1>
          </div>

          <TicketCard ticket={ticket} />

          <TouchableButton
            onClick={handleBack}
            variant="ghost"
            className="mt-8"
          >
            返回首页
          </TouchableButton>
        </TicketReveal>
      </PageTransition>
    </>
  );
};
