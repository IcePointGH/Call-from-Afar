import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";
import { AmbientToggle } from "../components/AmbientToggle";
import { CategorySelect } from "../components/CategorySelect";
import { PrivacyModal } from "../components/PrivacyModal";
import { PageTransition, FadeIn } from "../components/PageTransition";
import { TouchableButton } from "../components/TouchableButton";
import { useAppStore } from "../store/useAppStore";

export const EntryPage = () => {
  const navigate = useNavigate();
  const { setUserInfo, hasSeenPrivacyModal, setHasSeenPrivacyModal } = useAppStore();

  const [nickname, setNickname] = useState("");
  const [category, setCategory] = useState("");
  const [target, setTarget] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(!hasSeenPrivacyModal);

  const handleSubmit = () => {
    if (!nickname.trim() || !category || !target.trim()) return;

    setUserInfo(nickname.trim(), category, target.trim());

    if (!hasSeenPrivacyModal) {
      setShowPrivacy(true);
    } else {
      navigate("/call");
    }
  };

  const handlePrivacyConfirm = () => {
    setHasSeenPrivacyModal(true);
    setShowPrivacy(false);
    navigate("/call");
  };

  const isValid = nickname.trim() && category && target.trim();

  return (
    <>
      <StarBackground />
      <AmbientToggle />

      <PrivacyModal
        isOpen={showPrivacy}
        onConfirm={handlePrivacyConfirm}
      />

      <PageTransition className="content-layer min-h-screen flex flex-col items-center justify-center px-4">
        <FadeIn delay={0.1} className="w-full max-w-md">
          <div className="card-base p-6 md:p-8">
            <h1 className="font-serif text-2xl text-moonlight text-center mb-8">
              通话信息录入
            </h1>

            <div className="space-y-6">
              <div>
                <label className="block text-mist-white/70 text-sm mb-2">
                  我的昵称
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="陌生人、晚风..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-mist-white/70 text-sm mb-2">
                  对方身份
                </label>
                <CategorySelect value={category} onChange={setCategory} />
              </div>

              <div>
                <label className="block text-mist-white/70 text-sm mb-2">
                  对方昵称
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="ta的名字、或者你对他的称呼"
                  className="input-field"
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <TouchableButton onClick={handleSubmit} disabled={!isValid} fullWidth>
                进入通话
              </TouchableButton>

              <TouchableButton
                onClick={() => navigate("/")}
                variant="ghost"
                fullWidth
              >
                返回首页
              </TouchableButton>
            </div>
          </div>
        </FadeIn>
      </PageTransition>
    </>
  );
};
