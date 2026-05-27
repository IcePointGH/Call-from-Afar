interface PrivacyModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export const PrivacyModal = ({ isOpen, onConfirm }: PrivacyModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-space/90">
      <div className="relative card-base p-6 md:p-8 max-w-md w-full animate-modal-slide-in">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#6b7fd7"
                strokeWidth="2"
              />
              <path
                d="M12 16V12"
                stroke="#6b7fd7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="8" r="1" fill="#6b7fd7" />
            </svg>
          </div>

          <h2 className="text-xl font-serif mb-4 text-mist-white">
            私密通话确认
          </h2>

          <p className="text-mist-white/70 text-sm leading-relaxed mb-6">
            本次跨时空通话为私密独白，网页
            <span className="text-moonlight font-medium">不会保存</span>
            你的任何语音内容，仅记录通话时长与生成时间，放心倾诉。
          </p>

          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="btn-primary w-full"
            >
              我知道了，开始通话
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
