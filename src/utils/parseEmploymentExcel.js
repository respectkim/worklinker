import * as XLSX from "xlsx";

function normalizeText(value) {
  return String(value || "")
    .replace(/\u3000/g, " ")
    .replace(/\s+/g, "")
    .trim();
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  return Number(String(value).replace(/,/g, "").trim()) || 0;
}

function isTargetAge(age) {
  const text = normalizeText(age);

  return [
    "40~44세",
    "45~49세",
    "50~54세",
    "55~59세",
    "60~64세",
    "65세이상",
  
  ].includes(text);
}

function getAgeOrder(age) {
  const text = normalizeText(age);

  if (text === "40~44세") return 1;
  if (text === "45~49세") return 2;
  if (text === "50~54세") return 3;
  if (text === "55~59세") return 4;
  if (text === "60~64세") return 5;
  if (text === "65세이상" || text === "65세 이상") return 6;

  return 999;
}

function cleanRegion(region) {
  return normalizeText(region).replace(/전체$/, "");
}

function isHeaderRow(row) {
  const c0 = normalizeText(row[0]);
  const c2 = normalizeText(row[2]);
  const c3 = normalizeText(row[3]);
  const c4 = normalizeText(row[4]);

  return (
    (c0 === "(지역별)시도" || c0 === "지역" || c0 === "시도") &&
    c2 === "연령" &&
    c3.includes("취업건수") &&
    c4.includes("취업건수")
  );
}

export async function parseEmploymentExcel(input) {
  const buffer =
    input instanceof ArrayBuffer ? input : await input.arrayBuffer();

  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("엑셀 시트를 찾지 못했습니다.");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (!rows.length) {
    throw new Error("엑셀 데이터가 비어 있습니다.");
  }

  // 실제 헤더 행 찾기
  const headerIndex = rows.findIndex((row) => isHeaderRow(row));

  if (headerIndex === -1) {
    console.log("rows preview:", rows.slice(0, 10));
    throw new Error("헤더 행을 찾지 못했습니다.");
  }

  const dataRows = rows.slice(headerIndex + 1);

  const regionIdx = 0;
  const ageIdx = 2;
  const maleIdx = 3;
  const femaleIdx = 4;

  const regionMap = {};
  const ageMap = {};

  let totalMale = 0;
  let totalFemale = 0;

  for (const row of dataRows) {
    const rawRegion = normalizeText(row[regionIdx]);
    const rawAge = normalizeText(row[ageIdx]);

    if (!rawRegion) continue;
    if (!rawAge) continue;
    if (!isTargetAge(rawAge)) continue;

    const region = cleanRegion(rawRegion);
    const male = toNumber(row[maleIdx]);
    const female = toNumber(row[femaleIdx]);
    const total = male + female;

    if (total === 0) continue;

    if (!regionMap[region]) {
      regionMap[region] = { region, total: 0 };
    }
    regionMap[region].total += total;

    if (!ageMap[rawAge]) {
      ageMap[rawAge] = { age: rawAge, total: 0 };
    }
    ageMap[rawAge].total += total;

    totalMale += male;
    totalFemale += female;
  }

  const regionData = Object.values(regionMap).sort((a, b) => b.total - a.total);
  const ageData = Object.values(ageMap).sort(
    (a, b) => getAgeOrder(a.age) - getAgeOrder(b.age)
  );
  const genderData = [
    { label: "남", total: totalMale },
    { label: "여", total: totalFemale },
  ];

  const result = {
    total: totalMale + totalFemale,
    male: totalMale,
    female: totalFemale,
    regionData,
    ageData,
    genderData,
  };

  if (!result.total) {
    throw new Error("집계된 데이터가 없습니다. 40세 이상 데이터만 있는지 확인하세요.");
  }

  return result;
}