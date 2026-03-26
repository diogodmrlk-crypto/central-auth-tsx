export interface Key {
  key: string;
  level: "BASIC" | "PRO" | "DEV";
  limit: number;
  duration: number;
  packages: number;
}

export const keys: Key[] = [
  { key: "FERRAOBASIC1", level: "BASIC", limit: 500, duration: 20, packages: 0 },
  { key: "FERRAOBASIC2", level: "BASIC", limit: 500, duration: 20, packages: 0 },
  { key: "FERRAOBASIC3", level: "BASIC", limit: 500, duration: 20, packages: 0 },
  { key: "FERRAOBASIC4", level: "BASIC", limit: 500, duration: 20, packages: 0 },
  { key: "FERRAOBASIC5", level: "BASIC", limit: 500, duration: 20, packages: 0 },
  { key: "FERRAOPRO1", level: "PRO", limit: 1000, duration: 30, packages: 999 },
  { key: "FERRAOPRO2", level: "PRO", limit: 1000, duration: 30, packages: 999 },
  { key: "FERRAOPRO3", level: "PRO", limit: 1000, duration: 30, packages: 999 },
  { key: "FERRAOPRO4", level: "PRO", limit: 1000, duration: 30, packages: 999 },
  { key: "FERRAOPRO5", level: "PRO", limit: 1000, duration: 30, packages: 999 },
  { key: "FERRAODEV1", level: "DEV", limit: 5000, duration: 365, packages: 9999 },
  { key: "FERRAODEV2", level: "DEV", limit: 5000, duration: 365, packages: 9999 },
  { key: "FERRAODEV3", level: "DEV", limit: 5000, duration: 365, packages: 9999 },
  { key: "FERRAODEV4", level: "DEV", limit: 5000, duration: 365, packages: 9999 },
  { key: "FERRAODEV5", level: "DEV", limit: 5000, duration: 365, packages: 9999 },
];

export function findKey(keyStr: string): Key | undefined {
  return keys.find((k) => k.key === keyStr.toUpperCase());
}

export function getHWID(): string {
  let hwid = localStorage.getItem("hwid");
  if (!hwid) {
    hwid = "HWID_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("hwid", hwid);
  }
  return hwid;
}
