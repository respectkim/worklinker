import React from 'react';
import './Mileagetree.css';


/**
* MileageTree
* - 마일리지(포인트) 성장 상태를 나무 형태로 시각화
* - 단계별로 unlock 되는 구조 (씨앗 → 새싹 → 나무 → 열매)
* - 현재 마일리지에 따라 active 단계 표시
*/

const STAGES = [
  { level: 1, label: 'Seed', title: '씨앗', min: 0, icon: '🌰' },      // 씨앗
  { level: 2, label: 'Sprout', title: '새싹', min: 100, icon: '🌱' },  // 새싹
  { level: 3, label: 'Tree', title: '나무', min: 500, icon: '🌳' },     // 나무
  { level: 4, label: 'Fruit', title: '열매', min: 1000, icon: '🍎' },   // 열매
];

export default function MileageTree({ mileage = 0 }) {
const currentStage = STAGES
.slice()
.reverse()
.find(stage => mileage >= stage.min) || STAGES[0];


return (
<div className="page">
<div className="program-container">
<h2 className="member">🌱 마일리지 성장 나무</h2>


<div className="mileage-summary">
<span className="mileage-label">현재 마일리지</span>
<span className="mileage-value">{mileage.toLocaleString()} P</span>
</div>


<div className="tree-container">
{STAGES.map(stage => {
const isActive = stage.level <= currentStage.level;
const isCurrent = stage.level === currentStage.level;


return (
<div
key={stage.level}
className={`tree-node ${isActive ? 'active' : ''} ${
isCurrent ? 'current' : ''
}`}
>
<div className="tree-icon">{stage.icon}</div>
<div className="tree-title">{stage.title}</div>
<div className="tree-require">{stage.min} P+</div>
</div>
);
})}
</div>
</div>
</div>
);
}