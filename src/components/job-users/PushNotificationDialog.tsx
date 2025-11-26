import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PushNotificationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (message: string) => void;
    displayName: string;
    isPending: boolean;
}

export const PushNotificationDialog = ({
    isOpen,
    onClose,
    onSend,
    displayName,
    isPending,
}: PushNotificationDialogProps) => {
    const [message, setMessage] = useState("");

    const handleClose = () => {
        setMessage("");
        onClose();
    };

    const handleSend = () => {
        if (message.trim()) {
            onSend(message.trim());
            setMessage("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Send push notification</DialogTitle>
                    <DialogDescription>
                        Send a push notification message to {displayName}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {message.length} characters
                        </p>
                    </div>
                </div>
                <DialogFooter className="flex-row gap-2 sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={isPending || !message.trim()}
                        className="gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send notification
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
