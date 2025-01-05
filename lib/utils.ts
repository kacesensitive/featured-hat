import { clsx, type ClassValue } from "clsx"
import { EmoteOptions, parse } from "simple-tmi-emotes";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDark(color: any) {
  if (color === undefined || color === null) {
      return false;
  }
  var c = color.substring(1);
  var rgb = parseInt(c, 16);
  var r = (rgb >> 16) & 0xff;
  var g = (rgb >> 8) & 0xff;
  var b = (rgb >> 0) & 0xff;

  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luma < 60;
}

export function lightenColor(color: any, percent: any) {
  var num = parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

export const safeParse = (message: string, emotes: any, options: any) => {
  try {
    // strip any links of any kind from the message
    message = message.replace(/(https?:\/\/[^\s]+)/g, '');
    // strip any <a> tags from the message
    message = message.replace(/<a.*?>(.*?)<\/a>/g, '$1');
      return parse(message, emotes, options);
  } catch (e) {
      console.error('Error during parsing:', e);
      return '';
  }
};

export const options: EmoteOptions = {
  format: 'default',
  themeMode: 'light',
  scale: '1.0',
};

export const parseMessageWithEmotes = (msg: string, emotes: any) => {
  let parsedMessage = safeParse(msg, emotes, options);
  parsedMessage = parsedMessage.replace(/<img /g, '<img style="max-width:24px; max-height:24px; display:inline-block; vertical-align:middle;" ');
  return parsedMessage;
};