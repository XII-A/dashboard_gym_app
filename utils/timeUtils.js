export function getDate() {
  const currentDate = new Date();
  //utc
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function convert24to12(time24) {
  let ts = time24;
  const H = +ts.substr(0, 2);
  const h = H % 12 || 12;
  const ampm = H < 12 || H === 24 ? " AM" : " PM";
  ts = String(h).padStart(2, 0) + ts.substr(2, 3) + ampm;
  return ts;
}

export function getWeek() {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  };
  const today = new Date();

  // ✅ Get the first day of the current week (Sunday)
  const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1))
    .toISOString()
    .split("T")[0];

  // ✅ Get the last day of the current week (Saturday)
  const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 7))
    .toISOString()
    .split("T")[0];

  return [firstDay, lastDay];
}

export function getDayFromDate(date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date(date);
  return daysOfWeek[d.getDay()];
}
