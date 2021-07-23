import { getAptLength } from "./apptLengthFix.js";
import { isInFuture } from "./filters.js";
/**Creates a Set of years from an array of students */
export async function getYearsSet(students) {
  return new Set(
    students.map((student) => {
      return new Date(student.acm_startdate).getUTCFullYear();
    })
  );
}

// iterate the years in state, applying a function to each and storing results
export async function iterateYearsInState(state, fn, results = {}) {
  try {
    Object.keys(state).forEach((yr) => {
      results = fn(yr, state, results);
    });
    return results;
  } catch (e) {
    console.log(e, state, fn, results);
  }
}
/**Returns object w/ properties of years 2004 - present, w/ values of empty 12 month arrays  */
async function getYearsObj(startingYear = 2004, obj = {}) {
  for (let year = new Date().getUTCFullYear(); year >= startingYear; year--) {
    obj[`${year}`] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  return obj;
}

/**Populate state with student begin/end records */
async function populateStudentData(students, dataStructure) {
  students.forEach((student) => {
    placeStudentDatesInDataStructure(
      dataStructure,
      [student.acm_startdate, student.acm_enddate],
      getAptLength(student)
    );
  });
  return dataStructure;
}

/**creates "diff" object, containing difference between each month and previous*/
function populateDiffs(yr, i, obj, diff) {
  if (i === 0 && yr !== "2004") return (diff[yr][i] = obj[yr][i] - obj[yr - 1][11]);
  else return (diff[yr][i] = obj[yr][i] - obj[yr][i - 1] || 0);
}

/**adds two inputs */
function sum(a, b) {
  return a + b;
}

/**apply a function to the months of each year, return an array*/
function iterateMonthsInYear(yr, obj, fn) {
  try {
    return obj[yr]
      .filter((element, monthIndex) => !isInFuture(yr, monthIndex))
      .map((element, monthIndex) => {
        monthIndex > 11 ? (monthIndex %= 12) : monthIndex;
        return fn(yr, monthIndex, obj);
      });
  } catch (e) {
    console.log(e, yr, obj, fn);
  }
}

// Add a student's start/stop record to the map
function placeStudentDatesInDataStructure(obj, record, length) {
  let n = length === 60 ? 2 : 1;
  let start = new Date(record[0]);
  let stop = new Date(record[1]);

  obj[start.getUTCFullYear()][start.getUTCMonth()] += n;
  if (stop < new Date()) {
    obj[stop.getUTCFullYear()][stop.getUTCMonth()] -= n;
  }
}

// fill data as next month += previous month's total
function fillDataStructureWithRollingSum(yr, month, obj) {
  // if we're at the beginning of the year, compare with end of last year
  let compareYear = month === 0 ? `${Number(yr) - 1}` : yr;
  let compareMonth = month === 0 ? 11 : month - 1;

  //if it's the first month and no previous year on record
  if (month === 0 && !obj[compareYear]) return 0;
  else return (obj[yr][month] += obj[compareYear][compareMonth]);
}

/**Get an object of getDiff for a given year */
export function getDiffResults(yr, diff, results) {
  iterateMonthsInYear(yr, diff, (yr, i, diff) => results[i].push(diff[yr][i]));
  return results;
}

/**Get a results array of getLabels for a given year */
export function getLabelsResults(yr, state, results) {
  results.push(...iterateMonthsInYear(yr, state, (yr, m) => `${yr} ${m}`));
  return results;
}

/**Get a results array of getData for a given year */
export function getDataResults(yr, state, results) {
  results.push(...iterateMonthsInYear(yr, state, (yr, m, obj) => obj[yr][m]));
  return results;
}

/**Get the average of a year */
export function getYearAvg(yr, obj) {
  return Math.round(obj[yr].reduce(sum, 0) / obj[yr].length);
}
export function getYearAvgResults(yr, state, results) {
  results[yr] = getYearAvg(yr, state);
  return results;
}
export function getMonthAverage(months) {
  return Math.round(months.reduce(sum, 0) / months.length);
}
/**Get the Max of a year */
export function getYearMax(yr, obj) {
  return Math.max(...obj[yr]);
}
export function getYearMaxResults(yr, state, results) {
  results[yr] = getYearMax(yr, state);
  return results;
}
/**Get the total net/month for given history */
export async function getNetTotalByMonth(obj) {
  return Object.keys(obj).map((year) => obj[year].reduce(sum, 0));
}
/**Get the average net/month for given history */
export async function getNetAverageByMonth(obj) {
  return Object.keys(obj).map((year) => obj[year].reduce(sum, 0) / obj[year].length);
}

export async function buildChartState(students) {
  // set up data structures
  let [state, diff] = await Promise.all([getYearsObj(), getYearsObj()]);
  state = await populateStudentData(students, state);
  state = await iterateYearsInState(state, (yr, obj, results) => {
    results[yr] = iterateMonthsInYear(yr, obj, (yr, i, obj) =>
      fillDataStructureWithRollingSum(yr, i, obj)
    );
    return results;
  });
  diff = await iterateYearsInState(state, (yr, obj, results) => {
    results[yr] = iterateMonthsInYear(yr, obj, (yr, i, obj) => populateDiffs(yr, i, obj, diff));
    return results;
  });
  return { state, diff };
}

export function makePrediction(arr, lastRecord) {
  // get the average of the differences between the current and previous month
  // stored in the obj[month] property from the first step
  // also push new values to obj if we forcase for more than 1 year
  let avgDiff = getMonthAverage(arr);
  let prediction = avgDiff + lastRecord;

  return { prediction, avgDiff };
}

export function buildForcast({ arr, labels, forcastMonths = 12, diff = null }) {
  //get last date on record
  let year = Number(labels[labels.length - 1].split(" ")[0]);
  let month = Number(labels[labels.length - 1].split(" ")[1]);

  // create one year's forcast
  for (let i = 0; i < forcastMonths; i++) {
    month++;
    if (month === 12) {
      month = 0;
      year++;
    }
    let { prediction, avgDiff } = makePrediction(diff[month], arr[arr.length - 1]);
    arr.push(prediction);
    diff[month + ""].push(avgDiff);
    labels.push(`${year} ${month}`);
  }
  return { arr, labels };
}
