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
