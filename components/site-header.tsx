"use client"
import Link from 'next/link';
import { FaQuestionCircle } from 'react-icons/fa';

import { siteConfig } from '@/config/site';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';

export function SiteHeader() {

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {/* Existing GitHub Link */}
            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <div className={buttonVariants({ size: 'icon', variant: 'ghost' })}>
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            {/* Question Mark Icon */}
            <Dialog>
              <DialogTrigger>
                <FaQuestionCircle className="h-5 w-5" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How does it work?</DialogTitle>
                  <DialogDescription>
                    Change the channel name in the bottom right input box.{<br />}
                    Left is your chat, bottom right is the queue, top right is the Display zone.{<br />}
                    Click a chat to add it to the queue, click a queue item to display it. {<br />}
                    You can toggle the display zone on and off with the button in the bottom right.{<br />}
                    Right click a queue item to remove it from the queue.{<br />}
                    Go to the link by clicking the button in the top right of the Display zone for a dedicated page.
                  </DialogDescription>
                </DialogHeader>
              <a href="https://www.buymeacoffee.com/kacesensitive" target="_blank"><Image src="https://cdn.buymeacoffee.com/buttons/default-red.png" alt="Buy Me A Coffee" height="41" width="174" /></a>
              </DialogContent>
            </Dialog>
            <span className="sr-only">Help</span>
          </nav>
        </div>
      </div>
    </header>
  );
}
