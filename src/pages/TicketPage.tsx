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

export const TicketPage = () => {
  const navigate = useNavigate();
  const { userNickname, targetCategory, targetNickname, callDuration, addToHistory, resetCallState } =
    useAppStore();

  const ticket = useMemo<Ticket>(() => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    return {
      id: Date.now().toString(),
      userNickname: userNickname || "陌生人",
      targetCategory,
      targetNickname: targetNickname || "ta",
      duration: callDuration,
      timestamp,
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

      <PageTransition className="content-layer min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <TicketReveal>
          <h1 className="font-serif text-2xl text-moonlight text-center mb-8">
            专属纪念票根
          </h1>

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
