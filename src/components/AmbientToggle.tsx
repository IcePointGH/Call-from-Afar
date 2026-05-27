import { useAppStore } from "../store/useAppStore";

export const AmbientToggle = () => {
  const {
    animationEnabled,
    soundEnabled,
    transitionEnabled,
    setAnimationEnabled,
    setSoundEnabled,
    setTransitionEnabled,
  } = useAppStore();

  const toggleItem = (
    label: string,
    enabled: boolean,
    setter: (v: boolean) => void
  ) => (
    <button
      onClick={() => setter(!enabled)}
      className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
        enabled
          ? "bg-accent/30 text-mist-white"
          : "bg-booth-shadow/30 text-mist-white/50 hover:bg-booth-shadow/50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col gap-2">
      <div className="flex flex-col gap-2 items-end">
        {toggleItem("动画", animationEnabled, setAnimationEnabled)}
        {toggleItem("音效", soundEnabled, setSoundEnabled)}
        {toggleItem("过渡", transitionEnabled, setTransitionEnabled)}
      </div>
    </div>
  );
};
