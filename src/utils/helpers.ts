export function isAlumni(gradYear: number) {
  return new Date("July 1," + gradYear) < new Date();
}

export function* shuffle<T>(arr: T[]): Generator<T> {
  arr = [...arr];
  while (arr.length) yield arr.splice((Math.random() * arr.length) | 0, 1)[0];
}

export function clubAge(startDate: Date, currentDate: Date) {
  let startYear = startDate.getFullYear();
  let startMonth = startDate.getMonth(); // 0-indexed
  let startDay = startDate.getDate();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();
  let currentDay = currentDate.getDate();

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
    let daysInPrevMonth = new Date(currentYear, prevMonth + 1, 0).getDate();
    totalDays += daysInPrevMonth;
  }

  // Adjust for month difference
  if (totalMonths < 0) {
    totalYears--;
    totalMonths += 12;
  }

  return `This club has been running for ${totalYears} years, ${totalMonths} months and ${totalDays} days.` 
}
