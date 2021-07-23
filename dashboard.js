import { API, endpoints } from "../API.js";
import { createChart } from "../util/createChart.js";
import { parseStudents } from "../models/student.js";
import {
  iterateYearsInState,
  buildChartState,
  buildForcast,
  getNetTotalByMonth,
  getNetAverageByMonth,
  getDiffResults,
  getLabelsResults,
  getDataResults,
  getYearMaxResults,
  getYearAvgResults,
} from "./util/chartData.js";
import { getRandomColor } from "../util/getRandomColor.js";
import { Factory } from "../util/DomFactory.js";
import { printBirthdays } from "./util/birthdays.js";
import { printAvgRate } from "./util/rates.js";
import { isPopIn, filterState, isCurrent } from "./util/filters.js";
import { parseModel } from "../models/parseModel.js";
import { Record } from "../models/Record.js";
const body = document.getElementById("main");
let range = document.getElementById("range");
let container = document.getElementById("rate");
let forcastRange = document.getElementById("forcastRange");
let today = new Date();
let students = null;
let teachers = null;
let state = null;
let diff = null;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function assemble(data, labels, type, title, href = "/dashboard", color) {
  const link = Factory.create_node({ type: "a", attributes: { href: `/lessons/${href}` } });
  createChart({
    node: link,
    type: type,
    data: data,
    labels: labels,
    title: title,
    color: color,
    canvasOptions: { width: 300, height: 200 },
    cssClass: "dashboardWidget",
  });
  body.appendChild(link);
}

async function forcast(a, l, diff) {
  let { arr, labels } = buildForcast({
    arr: a,
    labels: l,
    forcastMonths: forcastRange.value,
    diff: diff,
  });
  assemble(arr, labels, "line", `Forcast for ${range.value} months`, "forcast", "red");
}

async function totalStudentsByInstructor(dateRange, teachers) {
  // array for each teacher position initialized to 0
  let activeStudents = teachers.map((t) => 0);
  // end date greater than today implies current only
  students
    .filter((s) => isCurrent(s) && new Date(s.acm_startdate) >= new Date(dateRange))
    .forEach((s) => activeStudents[teachers.indexOf(s.ain_name)]++);
  return activeStudents;
}

async function handleChange() {
  Factory.clean(body);
  // get the dates to filter
  let dateRange = new Date(`${today.getUTCFullYear() - range.value}`);
  // filter the dates we care about
  let filteredState = filterState(state, dateRange, today);
  let filteredDiff = filterState(diff, dateRange, today);
  let accumulator = [[], [], [], [], [], [], [], [], [], [], [], []];
  // process the data
  let [max, avg, arr, labels, diffAvg] = await Promise.all([
    iterateYearsInState(filteredState, getYearMaxResults),
    iterateYearsInState(filteredState, getYearAvgResults),
    iterateYearsInState(filteredState, getDataResults, []),
    iterateYearsInState(filteredState, getLabelsResults, []),
    iterateYearsInState(filteredDiff, getDiffResults, accumulator),
  ]);
  let [netAvg, netTotal, activeStudents] = await Promise.all([
    getNetAverageByMonth(diffAvg),
    getNetTotalByMonth(diffAvg),
    totalStudentsByInstructor(dateRange, teachers),
  ]);
  // process graphs
  forcast(arr, labels, diffAvg);
  assemble(arr, labels, "line", `Headcount - ${range.value} Years`, "timeline", "blue");
  assemble(netAvg, months, "bar", "Avg Net/Month", "monthlyReport", "purple");
  assemble(netTotal, months, "bar", "Net/Month", "monthlyReport", "rgb(0, 99, 0)");
  assemble(Object.values(avg), Object.keys(avg), "bar", "Avg / Yr", "monthlyReport", "orange");
  assemble(Object.values(max), Object.keys(max), "bar", "Max / Yr", "monthlyReport", "black");
  assemble(
    activeStudents,
    teachers,
    "bar",
    `Active Students/Teacher`,
    "monthlyReport",
    getRandomColor(teachers.length)
  );
}

async function init() {
  // fetch and filter data
  students = parseStudents(await API.getData(endpoints.students));
  students = students.filter(isPopIn);
  teachers = parseModel(await API.getData(endpoints.instructors), Record);
  teachers = teachers.map((t) => t.ain_name);

  // load data into data structures
  ({ state, diff } = await buildChartState(students));
  // repaint the dash
  handleChange();

  // misc metric printing
  printAvgRate();
  printBirthdays(students, container);
}
init();

range.addEventListener("change", handleChange);
forcastRange.addEventListener("change", handleChange);
