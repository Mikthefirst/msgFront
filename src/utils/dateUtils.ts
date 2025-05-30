/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  // If older than a week, return the date
  return date.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats a date to a time string for messages (e.g., "14:30")
 */
export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}


export function formatDateNormal(dateString: string): string {
  const date = new Date(dateString);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // Extract UTC components
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  let days = date.getUTCDay().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getUTCFullYear();
  if (days[0] === "0") days = days[1];

  return `${minutes}min; ${hours}h; ${days}days; ${month}month; ${year}year;`;
}