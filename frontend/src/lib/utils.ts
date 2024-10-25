import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, // To get AM/PM
  };

  return date.toLocaleString('en-US', options);
};

export const convertToDateUSFormat = (timestamp:string) => {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so we add 1
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
}

export const formatName = (name: string) => {
  var formattedName = name.toLowerCase();
  formattedName = formattedName[0].toUpperCase() + formattedName.slice(1);
  console.log(formattedName);
  return formattedName;
}

export const setLocalWithExpiry = (key: string, value: string, ttl: number) => {
  const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

export const getLocalWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

export const manageCacheLimit = (limit: number) => {
  const keys = Object.keys(localStorage);
  if (keys.length > limit) {
      localStorage.removeItem(keys[0]); // Remove the oldest item
  }
}
