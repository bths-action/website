export function isAlumni(gradYear: number | null | undefined) {
  if (gradYear == null) return false;
  return new Date("July 1," + gradYear) < new Date();
}

/**
 * Bulk-created accounts only contain an email until the member completes
 * their profile on first login.
 */
export function isProfileComplete(user: {
  name: string | null;
  preferredName: string | null;
  pronouns: string | null;
  prefect: string | null;
  birthday: string | null;
  gradYear: number | null;
  sgoSticker: boolean | null;
}) {
  return Boolean(
    user.name &&
      user.preferredName &&
      user.pronouns &&
      user.prefect &&
      user.birthday &&
      user.gradYear != null &&
      user.sgoSticker != null
  );
}

export function* shuffle<T>(arr: T[]): Generator<T> {
  arr = [...arr];
  while (arr.length) yield arr.splice((Math.random() * arr.length) | 0, 1)[0];
}

export function clubAge(startDate: Date, currentDate: Date) {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth(); // 0-indexed
  const startDay = startDate.getDate();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Calculate the difference in years and months
  let totalYears = currentYear - startYear;
  let totalMonths = currentMonth - startMonth;
  let totalDays = currentDay - startDay;

  if (totalDays < 0) {
    totalMonths--;
    // Calculate days in the previous month
    let prevMonth = currentMonth - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
    }
    const daysInPrevMonth = new Date(currentYear, prevMonth + 1, 0).getDate();
    totalDays += daysInPrevMonth;
  }

  // Adjust for month difference
  if (totalMonths < 0) {
    totalYears--;
    totalMonths += 12;
  }

  return `This club has been running for ${totalYears} years, ${totalMonths} months and ${totalDays} days.`;
}
