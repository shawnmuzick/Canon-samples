/**True if Birthday is today */
export function isBirthday(s) {
  let today = new Date();
  let month = today.getUTCMonth();
  let day = today.getUTCDate();
  let b = new Date(s.std_bdate);
  let bMonth = b.getUTCMonth();
  let bDay = b.getUTCDate();
  return month === bMonth && day === bDay;
}

/**True if end date before today */
export function filterCurrentStudents(students) {
  return students.filter(isCurrent);
}

/**True if end date before today */
export function isCurrent(s) {
  return new Date(s.acm_enddate) > new Date();
}

/**True if recurrence is not weekly */
export function filterPopIn(students) {
  return students.filter(isPopIn);
}

/**True if recurrence is not weekly */
export function isPopIn(s) {
  return s.asc_recurrencerule.split("FREQ=")[1]?.split(";")[0] === "WEEKLY";
}

/**True if year is >= start and <= end */
export function isInYearRange(yr, start, end) {
  return new Date(yr) <= end && new Date(yr) >= start;
}

/**True if month is >= start and <= end */
export function isInMonthRange(m, start, end) {
  return m >= start && m <= end;
}

/**Get an array of the years in state that fit into the range provided */
export function filterYearsInState(state, start, end) {
  return Object.keys(state).filter((key) => isInYearRange(key, start, end));
}

export function filterState(state, start, end) {
  let filters = filterYearsInState(state, start, end);
  return Object.keys(state)
    .filter((key) => filters.includes(key))
    .reduce((f, key) => {
      return { ...f, [key]: state[key] };
    }, {});
}

/**True if year >= current && month > current */
export function isInFuture(yr, month, today = new Date()) {
  return Number(yr) >= today.getUTCFullYear() && month > today.getUTCMonth();
}
/**Takes 2 date strings, converts to Date Objects,
 *
 *  and matches via getUTCFullYear() */
export function matchDate(a, b) {
  if (new Date(a).getUTCFullYear() === new Date(b).getUTCFullYear()) return true;
}
