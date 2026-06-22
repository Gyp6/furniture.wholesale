'use client';

import { Copy, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { ROUTES } from '@/constants';

type TShareModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link?: string;
};

export function ShareModal({
  open,
  onOpenChange,
  link = ROUTES.S3('projects/share-link'),
}: TShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof window !== 'undefined' &&
      window.isSecureContext
    ) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text using clipboard API: ', err);
          fallbackCopyText(link);
        });
    } else {
      fallbackCopyText(link);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Fallback copy command was unsuccessful');
      }
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={
          'rounded-2xl p-8 flex flex-col gap-5 sm:max-w-[620px] [&>[data-slot=dialog-overlay]]:bg-black/60'
        }
        style={{ height: '294px' }}
        showCloseButton={false}
      >
        <button
          onClick={() => onOpenChange(false)}
          className={
            'absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors'
          }
        >
          <X className={'w-4 h-4 text-muted-foreground'} />
        </button>

        <DialogHeader>
          <DialogTitle className={'text-lg font-semibold'}>
            Public link
          </DialogTitle>
        </DialogHeader>

        <div
          className={
            'rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm text-muted-foreground truncate w-full'
          }
        >
          {link}
        </div>

        <div className={'flex items-start gap-2 w-full'}>
          <div
            className={
              'w-4 h-4 rounded bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5'
            }
          >
            <span className={'text-[8px] font-bold text-secondary'}>!</span>
          </div>
          <p
            className={
              'text-[11px] text-muted-foreground leading-relaxed flex-1'
            }
          >
            Public links are accessible to all users. Share information with
            caution. Links can be found delete at any time. When sending a link
            to third parties, their rules apply.
          </p>
        </div>

        <Button
          variant={'default'}
          className={'rounded-full w-full h-11 gap-2'}
          onClick={handleCopy}
        >
          <Copy size={14} />
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
