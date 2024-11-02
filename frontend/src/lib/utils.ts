
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

export const formatTimestampToDifference = (timestamp: string): string => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const currentDate = new Date();
  const yearDifference = currentDate.getFullYear() - date.getFullYear();
  
  if (yearDifference > 0) return `${yearDifference} ${yearDifference > 1 ? 'years' : 'year'} ago`;

  const monthDifference = currentDate.getMonth() - date.getMonth();
  if (monthDifference > 0) return `${monthDifference} ${monthDifference > 1 ? 'months' : 'month'} ago`;

  const dayDifference = currentDate.getDate() - date.getDate();
  if (dayDifference > 0) return `${dayDifference} ${dayDifference > 1 ? 'days' : 'day'} ago`;

  const hourDifference = currentDate.getHours() - date.getHours();
  if (hourDifference > 0) return `${hourDifference} ${hourDifference > 1 ? 'hours' : 'hour'} ago`;

  const minuteDifference = currentDate.getMinutes() - date.getMinutes();
  if (minuteDifference > 0) return `${minuteDifference} ${minuteDifference > 1 ? 'minutes' : 'minute'} ago`;

  const secondDifference = currentDate.getSeconds() - date.getSeconds();
  if (secondDifference > 10) return `${secondDifference} ${secondDifference > 1 ? 'seconds' : 'second'} ago`;
  
  return 'Just now';
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

export const checkIfFollowingTarget = (followingList: Following[], targetid: string) => {
  const exists = followingList.some(item => {
    console.log(`Check if ${item.followingid} is equal to target ${targetid}`);  
    return item.followingid === targetid;
  });

  return exists;
}