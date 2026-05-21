export type FirestoreTimestamp = {
  seconds?: number;
  _seconds?: number;
};

export function getDate(timestamp?: FirestoreTimestamp | null) {
  const seconds = timestamp?.seconds || timestamp?._seconds;

  if (!seconds) return null;

  return new Date(seconds * 1000);
}

export function formatDate(timestamp?: FirestoreTimestamp | null) {
  const date = getDate(timestamp);

  if (!date) return "TBC";

  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isClosingSoon(timestamp?: FirestoreTimestamp | null) {
  const closingDate = getDate(timestamp);

  if (!closingDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoWeeks = new Date(today);
  twoWeeks.setDate(today.getDate() + 14);

  return closingDate >= today && closingDate <= twoWeeks;
}

export function isClosingWithinSevenDays(timestamp?: FirestoreTimestamp | null) {
  const closingDate = getDate(timestamp);

  if (!closingDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(today.getDate() + 14);

  return closingDate >= today && closingDate <= sevenDaysFromToday;
}