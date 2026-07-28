/**
 * Formats completion time from seconds to a human-readable format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "2m 30s", "1h 15m", "2d 3h")
 */
export const formatCompletionTime = (seconds: number): string => {
    if (!seconds || seconds < 0) return "0s";

    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY; // Approximate
    const YEAR = 365 * DAY; // Approximate

    // Years
    if (seconds >= YEAR) {
        const years = Math.floor(seconds / YEAR);
        const remainingSeconds = seconds % YEAR;
        const months = Math.floor(remainingSeconds / MONTH);
        return months > 0 ? `${years}y ${months}mo` : `${years}y`;
    }

    // Months
    if (seconds >= MONTH) {
        const months = Math.floor(seconds / MONTH);
        const remainingSeconds = seconds % MONTH;
        const weeks = Math.floor(remainingSeconds / WEEK);
        return weeks > 0 ? `${months}mo ${weeks}w` : `${months}mo`;
    }

    // Weeks
    if (seconds >= WEEK) {
        const weeks = Math.floor(seconds / WEEK);
        const remainingSeconds = seconds % WEEK;
        const days = Math.floor(remainingSeconds / DAY);
        return days > 0 ? `${weeks}w ${days}d` : `${weeks}w`;
    }

    // Days
    if (seconds >= DAY) {
        const days = Math.floor(seconds / DAY);
        const remainingSeconds = seconds % DAY;
        const hours = Math.floor(remainingSeconds / HOUR);
        return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }

    // Hours
    if (seconds >= HOUR) {
        const hours = Math.floor(seconds / HOUR);
        const remainingSeconds = seconds % HOUR;
        const minutes = Math.floor(remainingSeconds / MINUTE);
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    // Minutes
    if (seconds >= MINUTE) {
        const minutes = Math.floor(seconds / MINUTE);
        const remainingSeconds = seconds % MINUTE;
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }

    // Seconds
    return `${seconds}s`;
};

/**
 * Formats completion time with full words (useful for longer descriptions)
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "2 minutes 30 seconds", "1 hour 15 minutes")
 */
export const formatCompletionTimeLong = (seconds: number): string => {
    if (!seconds || seconds < 0) return "0 seconds";

    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;

    // Years
    if (seconds >= YEAR) {
        const years = Math.floor(seconds / YEAR);
        const remainingSeconds = seconds % YEAR;
        const months = Math.floor(remainingSeconds / MONTH);
        const yearText = years === 1 ? "year" : "years";
        const monthText = months === 1 ? "month" : "months";
        return months > 0 ? `${years} ${yearText} ${months} ${monthText}` : `${years} ${yearText}`;
    }

    // Months
    if (seconds >= MONTH) {
        const months = Math.floor(seconds / MONTH);
        const remainingSeconds = seconds % MONTH;
        const weeks = Math.floor(remainingSeconds / WEEK);
        const monthText = months === 1 ? "month" : "months";
        const weekText = weeks === 1 ? "week" : "weeks";
        return weeks > 0 ? `${months} ${monthText} ${weeks} ${weekText}` : `${months} ${monthText}`;
    }

    // Weeks
    if (seconds >= WEEK) {
        const weeks = Math.floor(seconds / WEEK);
        const remainingSeconds = seconds % WEEK;
        const days = Math.floor(remainingSeconds / DAY);
        const weekText = weeks === 1 ? "week" : "weeks";
        const dayText = days === 1 ? "day" : "days";
        return days > 0 ? `${weeks} ${weekText} ${days} ${dayText}` : `${weeks} ${weekText}`;
    }

    // Days
    if (seconds >= DAY) {
        const days = Math.floor(seconds / DAY);
        const remainingSeconds = seconds % DAY;
        const hours = Math.floor(remainingSeconds / HOUR);
        const dayText = days === 1 ? "day" : "days";
        const hourText = hours === 1 ? "hour" : "hours";
        return hours > 0 ? `${days} ${dayText} ${hours} ${hourText}` : `${days} ${dayText}`;
    }

    // Hours
    if (seconds >= HOUR) {
        const hours = Math.floor(seconds / HOUR);
        const remainingSeconds = seconds % HOUR;
        const minutes = Math.floor(remainingSeconds / MINUTE);
        const hourText = hours === 1 ? "hour" : "hours";
        const minuteText = minutes === 1 ? "minute" : "minutes";
        return minutes > 0 ? `${hours} ${hourText} ${minutes} ${minuteText}` : `${hours} ${hourText}`;
    }

    // Minutes
    if (seconds >= MINUTE) {
        const minutes = Math.floor(seconds / MINUTE);
        const remainingSeconds = seconds % MINUTE;
        const minuteText = minutes === 1 ? "minute" : "minutes";
        const secondText = remainingSeconds === 1 ? "second" : "seconds";
        return remainingSeconds > 0
            ? `${minutes} ${minuteText} ${remainingSeconds} ${secondText}`
            : `${minutes} ${minuteText}`;
    }

    // Seconds
    const secondText = seconds === 1 ? "second" : "seconds";
    return `${seconds} ${secondText}`;
};
