export const getNextDateForDayOfWeek = (
  dayOfWeek: number,
  timeString: string
): Date => {
  const now = new Date();
  const today = now.getDay();

  let daysUntil = dayOfWeek - today;

  if (daysUntil <= 0) {
    daysUntil += 7;
  }

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntil);

  const [hours, minutes] = timeString.split(":").map(Number);
  nextDate.setHours(hours, minutes, 0, 0);

  return nextDate;
};
