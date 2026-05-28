import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { StarBackground } from "../components/StarBackground";
import { AmbientToggle } from "../components/AmbientToggle";
import { FadeIn } from "../components/PageTransition";
import { TouchableButton } from "../components/TouchableButton";

export const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigate("/entry");
  };

  return (
    <>
      {isLoading && <LoadingOverlay onComplete={() => setIsLoading(false)} />}
      <StarBackground />
      <AmbientToggle />

      <main className="content-layer min-h-screen flex flex-col items-center justify-center px-4">
        <FadeIn delay={0.2} className="text-center max-w-lg">
          <div className="mb-12">
            <h1 className="font-serif text-3xl md:text-4xl text-moonlight mb-4">
              时空电话亭
            </h1>
            <p className="text-mist-white/60 text-sm md:text-base">
              致好久不见的你
            </p>
          </div>

          <TouchableButton onClick={handleStart} className="text-lg">
            开启时空通话
          </TouchableButton>

        </FadeIn>
      </main>
    </>
  );
};
