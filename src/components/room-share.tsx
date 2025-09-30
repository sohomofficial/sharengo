"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Share2, Copy, Check, QrCode, Shield } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RoomShareProps {
  readonly roomCode: string;
  readonly roomName: string;
  readonly hasPin: boolean;
  readonly pin?: string | null;
}

export function RoomShare({
  roomCode,
  roomName,
  hasPin,
  pin,
}: Readonly<RoomShareProps>) {
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const roomUrl = `${window.location.origin}/room/${roomCode}`;

  const getShareText = () => {
    if (hasPin && pin) {
      return `Join "${roomName}" on ShareNGo!\n\nRoom Code: ${roomCode}\nPIN: ${pin}\n\n${roomUrl}`;
    }
    if (hasPin) {
      return `Join "${roomName}" on ShareNGo!\n\nRoom Code: ${roomCode}\n🔒 This room is protected with a PIN\n\n${roomUrl}`;
    }
    return `Join "${roomName}" on ShareNGo!\n\nRoom Code: ${roomCode}\n\n${roomUrl}`;
  };

  const shareText = getShareText();

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrDataUrl = await QRCode.toDataURL(roomUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    };

    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, roomUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("Room details copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setUrlCopied(true);
      toast.success("Room URL copied to clipboard!");
      setTimeout(() => setUrlCopied(false), 1500);
    } catch {
      toast.error("Failed to copy URL to clipboard");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join "${roomName}" on ShareNGo`,
          text: shareText,
          url: roomUrl,
        });
      } catch (err) {
        // User cancelled the share or error occurred
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback to copying
      copyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Room</DialogTitle>
          <DialogDescription>
            Share this room with others so they can join and upload photos.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <Alert>
              <Share2 className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Room Details</div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      {roomName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Code:</span>{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                        {roomCode}
                      </code>
                    </p>
                    {hasPin && pin && (
                      <p>
                        <span className="text-muted-foreground">PIN:</span>{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                          {pin}
                        </code>
                      </p>
                    )}
                    {hasPin && !pin && (
                      <p className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Protected with PIN
                      </p>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Share Link</h4>
              <div className="relative">
                <Input
                  className="pe-9 font-mono text-xs"
                  type="text"
                  value={roomUrl}
                  readOnly
                />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={copyUrlToClipboard}
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                        aria-label={
                          urlCopied ? "Copied" : "Copy URL to clipboard"
                        }
                        disabled={urlCopied}
                      >
                        <div
                          className={cn(
                            "transition-all",
                            urlCopied
                              ? "scale-100 opacity-100"
                              : "scale-0 opacity-0"
                          )}
                        >
                          <Check
                            className="stroke-emerald-500"
                            size={16}
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className={cn(
                            "absolute transition-all",
                            urlCopied
                              ? "scale-0 opacity-0"
                              : "scale-100 opacity-100"
                          )}
                        >
                          <Copy size={16} aria-hidden="true" />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      Copy URL to clipboard
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleNativeShare} className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4 mt-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-lg bg-background p-4 border">
                {qrCodeUrl ? (
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code for room"
                    width={192}
                    height={192}
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-muted rounded">
                    <div className="text-center">
                      <QrCode className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Generating QR code...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-medium">Scan to join room</p>
                <p className="text-xs text-muted-foreground">
                  Others can scan this QR code with their phone camera to
                  quickly join the room
                </p>
              </div>

              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Link Copied!" : "Copy Room Link"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
