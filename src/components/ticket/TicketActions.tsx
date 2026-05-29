import { DownloadIcon, PrintIcon, ShareIcon } from "../Icons";
import { TouchableButton } from "../TouchableButton";

interface TicketActionsProps {
  onSave: () => void;
  onPrint: () => void;
  onShare: () => void;
}

export const TicketActions = ({
  onSave,
  onPrint,
  onShare,
}: TicketActionsProps) => {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <TouchableButton
        onClick={onSave}
        className="flex flex-1 items-center justify-center gap-2"
      >
        <DownloadIcon />
        保存图片
      </TouchableButton>

      <TouchableButton
        onClick={onPrint}
        variant="secondary"
        className="flex flex-1 items-center justify-center gap-2"
      >
        <PrintIcon />
        打印票根
      </TouchableButton>

      <TouchableButton
        onClick={onShare}
        variant="secondary"
        className="flex flex-1 items-center justify-center gap-2"
      >
        <ShareIcon />
        分享
      </TouchableButton>
    </div>
  );
};
