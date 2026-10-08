import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExecutionNode, OperatingModel } from "@deal-to-challenge/engine";
import { useState } from "react";
import { MODEL_LABEL, MODEL_CLASS } from "./store";
import { cn } from "@/lib/utils";

const MODELS: OperatingModel[] = [
  "flexible-talent",
  "challenge",
  "private-pod",
];

export interface OverrideDialogProps {
  node: ExecutionNode | null;
  onClose: () => void;
  onConfirm: (nodeId: string, model: OperatingModel, rationale: string) => void;
  busy?: boolean;
}

export function OverrideDialog({
  node,
  onClose,
  onConfirm,
  busy,
}: OverrideDialogProps) {
  // The dialog is remounted (keyed on the node id) each time it opens, so the
  // default target model can be derived once from the node instead of being
  // synchronised with an effect.
  const [choice, setChoice] = useState<OperatingModel>(() =>
    node
      ? (MODELS.find((model) => model !== node.operatingModel.primary) ??
        "challenge")
      : "private-pod",
  );
  const [rationale, setRationale] = useState("");

  if (!node) return null;
  const canConfirm = rationale.trim().length >= 8;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">
            Override operating model
          </DialogTitle>
          <DialogDescription className="font-mono-data text-[11px]">
            {node.id} · currently {MODEL_LABEL[node.operatingModel.primary]} (
            {node.operatingModel.confidence} confidence)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-4 pb-2">
          <fieldset className="space-y-2">
            <legend className="label text-muted-foreground">
              New primary model
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {MODELS.map((model) => (
                <button
                  key={model}
                  type="button"
                  aria-pressed={choice === model}
                  onClick={() => setChoice(model)}
                  className={cn(
                    "border px-3 py-2 text-left font-mono-data text-[11px] uppercase tracking-[0.08em] transition-colors",
                    choice === model
                      ? MODEL_CLASS[model]
                      : "border-hairline text-muted-foreground hover:border-foreground/40",
                  )}
                >
                  {MODEL_LABEL[model]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label
              htmlFor="override-rationale"
              className="label text-muted-foreground"
            >
              Rationale (recorded as a user decision)
            </Label>
            <Textarea
              id="override-rationale"
              value={rationale}
              onChange={(event) => setRationale(event.target.value)}
              rows={3}
              placeholder="Why is this operating model a better fit for this work?"
              className="text-[13px]"
            />
            <p className="font-mono-data text-[11px] text-muted-foreground">
              {canConfirm
                ? "Rationale recorded against the node's override history."
                : "At least 8 characters required."}
            </p>
          </div>

          {node.operatingModel.splitRecommended &&
          node.operatingModel.splitReason ? (
            <p className="border-l-2 border-review/50 pl-3 text-[12px] leading-6 text-muted-foreground">
              {node.operatingModel.splitReason}
            </p>
          ) : null}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canConfirm || busy}
            onClick={() => {
              onConfirm(node.id, choice, rationale.trim());
              onClose();
            }}
          >
            Record override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
