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
              <DialogContent style={{
                maxHeight: '90%',
                overflow: 'auto',
              }}>
                <DialogHeader>
                  <DialogTitle>How does it work?</DialogTitle>
                  <DialogDescription>
                  </DialogDescription>
                </DialogHeader>
                  Change the channel name in the bottom right input box.
                  <Image priority placeholder="blur" blurDataURL='/name2.gif' src="/name2.gif" alt="Description" style={{ paddingBottom: '2vh', display: 'block', margin: '0 auto' }} width={380} height={220} />

                  Left is your chat, bottom right is the queue, top right is the Display zone.
                  <Image priority placeholder="blur" blurDataURL='/orientation.png' src="/orientation.png" alt="Description" style={{ paddingBottom: '2vh', display: 'block', margin: '0 auto' }} width={380} height={220} />

                  Click a chat to add it to the queue, click a queue item to display it.
                  <Image priority placeholder="blur" blurDataURL='/flow.png' src="/flow.png" alt="Description" style={{ paddingBottom: '2vh', display: 'block', margin: '0 auto' }} width={380} height={220} />

                  You can toggle the display on and off with the button in the bottom right (this does apply to the viewer page as well).
                  <Image priority placeholder="blur" blurDataURL='/hide.png' src="/hide.png" alt="Description" style={{ paddingBottom: '2vh', display: 'block', margin: '0 auto' }} width={380} height={220} />

                  Right click a queue item to remove it from the queue.
                  <Image priority placeholder="blur" blurDataURL='/remove.gif' src="/remove.gif" alt="Description" style={{ paddingBottom: '2vh', display: 'block', margin: '0 auto' }} width={380} height={220} />

                  Go to the link by clicking the button in the top right of the Display zone for a dedicated page. Or copy the link to be used as a browser source in OBS.
                  <Image priority placeholder="blur" blurDataURL='/copy2.gif' src="/copy2.gif" alt="Description" style={{ paddingBottom: '2vh', display: 'block', margin: '0 auto' }} width={380} height={220} />

                  Set your browser source to in OBS and get to streaming!
                  <Image priority placeholder="blur" blurDataURL='/OBS2.gif' src="/OBS2.gif" alt="Description" style={{ paddingBottom: '2vh', display: 'block', margin: '0 auto' }} width={380} height={220} />
                  <a style={{ color: 'lightblue', fontWeight: 'bolder', margin: '0 auto' }} href="https://github.com/kacesensitive/featured-hat/blob/main/HOWITWORKS.md" target="_blank" rel="noreferrer">More Info</a>
                  <a style={{ margin: '0 auto' }} href="https://www.buymeacoffee.com/kacesensitive" target="_blank" rel="noreferrer">
                    <Image src="/default-red.png" alt="Buy Me A Coffee" height="41" width="174" />
                  </a>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </div>
    </header>
  );
}
