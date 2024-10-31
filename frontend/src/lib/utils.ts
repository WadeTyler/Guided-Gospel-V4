
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

export const formatTimestampToDifference = (timestamp: string) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);

  if (date < new Date(new Date().setDate(new Date().getDate() - 365))) {
    return 'over a year ago';
  }
  if (date < new Date(new Date().setDate(new Date().getDate() - 182))) {
    return 'over 6 months ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 152))) {
    return 'over 5 months ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 121))) {
    return 'over 4 months ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 91))) {
    return 'over 3 months ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 60))) {
    return 'over 2 months ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 30))) {
    return 'over 1 month ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 14))) {
    return 'over 2 weeks ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 7))) {
    return 'over 7 days ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 6))) {
    return '6 days ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 5))) {
    return '5 days ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 4))) {
    return '4 days ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 3))) {
    return '3 days ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 2))) {
    return '2 days ago';
  }

  if (date < new Date(new Date().setDate(new Date().getDate() - 1))) {
    return '1 days ago';
  }

  const hoursDifference = new Date().getHours() - date.getHours();

  if (hoursDifference > 1) {
    return `${hoursDifference} hours ago`;
  }

  const minutesDifference = new Date().getMinutes() - date.getMinutes();

  if (minutesDifference > 1) {
    return `${minutesDifference} minutes ago`;
  }

  return 'Just now';
}

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

// Binary Search algorithm to check if a post is liked by the user
export const checkIfPostLikedByUser = (likedPosts: Like[], postid: number) => {

  let left = 0;
  let right = likedPosts.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (likedPosts[mid].postid === postid) {
      return true;
    }
    
    if (postid < likedPosts[mid].postid) {
      right = mid - 1;
    }

    if (postid > likedPosts[mid].postid) {
      left = mid + 1;
    }
  }

  return false;

}