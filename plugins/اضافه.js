const fs = require('fs');
const path = require('path');

const pointsFile = path.join(__dirname, '../data/points.json');

// ✅ رقم المطور الوحيد
const developers = ['967715677073'];

function normalize(jid = '') {
  return jid.replace(/[^0-9]/g, '');
}

function loadPoints() {
  if (!fs.existsSync(pointsFile)) fs.writeFileSync(pointsFile, '{}');
  return JSON.parse(fs.readFileSync(pointsFile));
}

function savePoints(points) {
  fs