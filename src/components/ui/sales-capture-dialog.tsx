"use client";
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import SectionFadeIn from "@/components/ui/section-fade-in";

export interface SalesCaptureDialogProps {
  open: boolean;
  onClose: () => void;
  introText?: string;
  rotatingMessages?: string[];
  formProps?: any;
}

export default function SalesCaptureDialog({
  open,
  onClose,
  introText = "To tailor your onboarding experience we would like to know:",
  rotatingMessages = ["Talk soon!", "Thank you for your info."],
  formProps
}: SalesCaptureDialogProps) {
  const [msgIndex, setMsgIndex] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [open, rotatingMessages.length]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-card/60 backdrop-blur-2xl shadow-2xl">
        <div className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
              <Icon icon="mdi:rocket-launch-outline" className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-black tracking-tight text-foreground uppercase">
              {rotatingMessages[msgIndex]}
            </h3>
            <p className="text-sm text-muted-foreground font-medium italic">
              {introText}
            </p>
          </div>

          <div className="space-y-4">
             {/* If we had a more complex form here, it would render */}
             <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
               Operationalizing sequence...
             </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-primary/80 transition-colors"
          >
            Close / Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
