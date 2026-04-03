import { Link, useLocation } from 'react-router-dom';
import {motion} from 'framer-motion'
import { useEffect, useState, useMemo } from 'react';
import './Main.css';
import { parseEmploymentExcel } from './utils/parseEmploymentExcel';
import CommonHeader from './components/CommonHeader';

export default function Main(){

  // CommonHeader 함수 선언
  const location = useLocation();

  useEffect(()=>{
    if (location.hash) {
      const id = location.hash.replace('#','');
      const el = document.getElementById(id);

      if(el){
        setTimeout(()=>{
          el.scrollIntoView({behavior:'smooth'});
        },100);
      }
    }
   },[location]);
  // CommonHeader 함수 선언


  const [mouseX, setMouseX] = useState(0);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/employment.xlsx", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("엑셀 파일을 불러오지 못했습니다.");
      }

      const buffer = await response.arrayBuffer();
      const parsed = await parseEmploymentExcel(buffer);

      setDashboardData(parsed);
    } catch (err) {
      console.error("대시보드 데이터 로딩 오류:", err);
      setError(err?.message || "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x= (e.clientX - rect.left) / rect.width; // 0~1
    const normalizedX = x *2 -1; // -1 ~ 1
    setMouseX(normalizedX);
  };

  const handleMouseLeave= () => {
    setMouseX(0);
  };


const total = dashboardData?.total ?? 0;
const male = dashboardData?.male ?? 0;
const female = dashboardData?.female ?? 0;

const regionData = dashboardData?.regionData ?? [];
const ageData = dashboardData?.ageData ?? [];
const genderData = dashboardData?.genderData ?? [];

const maxRegion = useMemo(
    () => Math.max(...regionData.map((item) => item.total), 1),
    [regionData]
  );

  const ageChartData = useMemo(() => {
    return [...ageData].sort((a, b) => b.total - a.total).slice(0, 6);
  }, [ageData]);

  const maxAgeChart = useMemo(
    () => Math.max(...ageChartData.map((item) => item.total), 1),
    [ageChartData]
  );

  const malePercent = total ? Math.round((male / total) * 100) : 0;
  const femalePercent = total ? Math.round((female / total) * 100) : 0;

//  세번째 섹tus 더미 데이터
  const MOCK_OPTIONS={
    regions : ['전체', '서울','경기','부산','인천','대구'],
    genders : ['전체','남성','여성'],
    ages : ['전체','40~44세','45~49세','50~54세','55~59세','60~64세','65세이상'],
  };
  const MOCK_TOP_JOBS = {
  "전체|전체|전체": [
    { job: "경비원", total: 18240 },
    { job: "청소원", total: 16420 },
    { job: "주차관리원", total: 14310 },
    { job: "요양보호사", total: 13200 },
    { job: "매장판매직", total: 11850 },
  ],
  "서울|여성|50~54세": [
    { job: "요양보호사", total: 4210 },
    { job: "매장판매직", total: 3560 },
    { job: "사무보조원", total: 2980 },
    { job: "청소원", total: 2450 },
    { job: "조리보조원", total: 2010 },
  ],
  "서울|남성|50~54세": [
    { job: "경비원", total: 3880 },
    { job: "주차관리원", total: 3120 },
    { job: "시설관리원", total: 2750 },
    { job: "택배상하차", total: 1980 },
    { job: "운전직", total: 1740 },
  ],
  "경기|전체|60~64세": [
    { job: "경비원", total: 5230 },
    { job: "청소원", total: 4820 },
    { job: "주차관리원", total: 3360 },
    { job: "매장판매직", total: 2910 },
    { job: "시설관리원", total: 2480 },
  ],
  "부산|여성|45~49세": [
    { job: "매장판매직", total: 2410 },
    { job: "조리보조원", total: 2140 },
    { job: "청소원", total: 1980 },
    { job: "사무보조원", total: 1760 },
    { job: "요양보호사", total: 1650 },
  ],
};

const [selectedRegion, setSelectedRegion] = useState("전체");
const [selectedGender, setSelectedGender] = useState("전체");
const [selectedAge, setSelectedAge] = useState("전체");

const [jobOptions, setJobOptions] = useState({
  regions: [],
  genders: [],
  ages: [],
});

const [topJobs, setTopJobs] = useState([]);
const [jobLoading, setJobLoading] = useState(true);

useEffect(() => {
  const loadMockOptions = async () => {
    setTimeout(() => {
      setJobOptions(MOCK_OPTIONS);
    }, 300);
  };

  loadMockOptions();
}, []);

useEffect(() => {
  const loadMockTopJobs = async () => {
    setJobLoading(true);

    const key = `${selectedRegion}|${selectedGender}|${selectedAge}`;
    const fallbackKey = "전체|전체|전체";

    setTimeout(() => {
      setTopJobs(MOCK_TOP_JOBS[key] || MOCK_TOP_JOBS[fallbackKey]);
      setJobLoading(false);
    }, 350);
  };

  loadMockTopJobs();
}, [selectedRegion, selectedGender, selectedAge]);
  
 return(
    <div className='pages'>
    <CommonHeader />
    
    
      
       
     
    {/* Main */}

    <main className='main-wrapper'>
    
      <section
      id='home'
      className='hero-wrapper'
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
    <div className='main-text'>
    중장년의 새로운 시작! <br/>
    국비지원과 무료교육으로 취업연결까지
    </div>




    <div className='image-zone'>
    <motion.div
      className='image-slot side-slot'
      animate={{x:mouseX < 0 ? Math.abs(mouseX)*30 : 0}}
      transition={{type:'spring', stiffness:120, damping: 18}}
    >
      <img src='/person22.png' alt='left' className='hero-image'/>

    </motion.div>
   
    <motion.div
     className='image-slot center-slot'
     animate={{x: mouseX * -8}}
     transition={{type:'spring', stiffness:120, damping: 18}}
    >
    <img src='/image2.png' alt='center' className='hero-image'/>
    </motion.div>

  <motion.div
   className='image-slot side-slot'
   animate={{x: mouseX > 0? -mouseX* 30:0}}
   transition={{type:'spring', stiffness:120, damping: 18}}
  >
    <img src='/person3.png' alt='right' className='hero-image'/>
  </motion.div>
   
    </div>
   </section>


   {/* 두 번째 화면 */}
  <section id="trend" className="news-section">
          <div className="news-inner">
            <h2 className="news-title">취업동향</h2>
            <p className='news-subtitle'>40세 이상 재취업 시장을 한눈에 보는 핵심 지표</p>        


            {loading && (
              <p className="dashboard-message">데이터 불러오는 중...</p>
            )}

            {error && <p className="dashboard-error">{error}</p>}

            {!loading && !error && (
              <div className="dashboard-grid">
                <section className="panel">
                  <h3 className="panel-title">취업 현황 요약</h3>

                  <div className="kpi-list">
                    <div className="kpi-card">
                      <span className="kpi-label">전체 취업건수</span>
                      <strong className="kpi-value">
                        {total.toLocaleString()}건
                      </strong>
                    </div>

                    <div className="kpi-card">
                      <span className="kpi-label">남성 취업건수</span>
                      <strong className="kpi-value">
                        {male.toLocaleString()}건
                      </strong>
                    </div>

                    <div className="kpi-card">
                      <span className="kpi-label">여성 취업건수</span>
                      <strong className="kpi-value">
                        {female.toLocaleString()}건
                      </strong>
                    </div>
                  </div>

                  <div className="summary-split">
                    <div className="summary-row">
                      <div className="summary-top">
                        <span>남성 비중</span>
                        <strong>{malePercent}%</strong>
                      </div>
                      <div className="bar-bg">
                        <div
                          className="bar-fill"
                          style={{ width: `${malePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="summary-row">
                      <div className="summary-top">
                        <span>여성 비중</span>
                        <strong>{femalePercent}%</strong>
                      </div>
                      <div className="bar-bg">
                        <div
                          className="bar-fill gender"
                          style={{ width: `${femalePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="panel">
                  <h3 className="panel-title">지역별 취업건수</h3>

                  <div className="rank-list">
                    {regionData.map((item, index) => (
                      <div className="rank-row" key={item.region}>
                        <div className="rank-top">
                          <div className="rank-left">
                            <span className="rank-number">{index + 1}</span>
                            <span className="rank-name">{item.region}</span>
                          </div>
                          <strong className="rank-value">
                            {item.total.toLocaleString()}건
                          </strong>
                        </div>

                        <div className="bar-bg">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${(item.total / maxRegion) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel">
                  <h3 className="panel-title">나이대 / 성별</h3>

                  <div className="sub-section">
                    <h4 className="sub-title">나이대별 취업건수</h4>

                    <div className="age-chart">
                      {ageChartData.map((item) => (
                        <div className="age-chart-item" key={item.age}>
                          <div className="age-chart-value">
                            {item.total.toLocaleString()}
                          </div>

                          <div className="age-chart-bar-wrap">
                            <div
                              className="age-chart-bar"
                              style={{
                                height: `${(item.total / maxAgeChart) * 140}px`,
                              }}
                            />
                          </div>

                          <div className="age-chart-label">{item.age}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sub-section">
                    <h4 className="sub-title">성별 취업건수</h4>

                    <div className="gender-chart-wrap">
                      <div
                        className="gender-donut"
                        style={{
                          background: `conic-gradient(
                            #2563eb 0% ${malePercent}%,
                            #8b5cf6 ${malePercent}% 100%
                          )`,
                        }}
                      >
                        <div className="gender-donut-inner">
                          <span>전체</span>
                          <strong>{total.toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="gender-legend">
                        {genderData.map((item) => (
                          <div className="gender-legend-item" key={item.label}>
                            <span
                              className={`legend-dot ${
                                item.label === "남" ? "male-dot" : "female-dot"
                              }`}
                            />
                            <div className="legend-text">
                              <span>{item.label === "남" ? "남성" : "여성"}</span>
                              <strong>
                                {item.total.toLocaleString()}건 (
                                {item.label === "남"
                                  ? malePercent
                                  : femalePercent}
                                %)
                              </strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </section>
    {/* 세 번째 화면 */}

    <section id='jobs' className="trend-section">
  <div className="trend-inner">
    <div className="trend-header">
      <h2 className="trend-title">맞춤 직무 추천</h2>
      <p className="trend-subtitle">
        지역, 성별, 연령을 선택하면 조건에 맞는 상위 직무를 보여드려요
      </p>
    </div>

    <div className="job-board">
      <div className="job-filter-card">
        <h3 className="job-filter-title">조건 선택</h3>

        <div className="job-filter-grid">
          <div className="filter-group">
            <label>지역</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {jobOptions.regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>성별</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              {jobOptions.genders.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>연령</label>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
            >
              {jobOptions.ages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-summary-card">
          <span className="filter-summary-label">선택 조건</span>
          <strong className="filter-summary-value">
            {selectedRegion} / {selectedGender} / {selectedAge}
          </strong>
        </div>
      </div>

      <div className="job-result-card">
        <div className="job-result-top">
          <h3 className="job-result-title">추천 직무 TOP 5</h3>
          <span className="job-result-badge">실시간 미리보기</span>
        </div>

        {jobLoading ? (
          <div className="job-loading">추천 직무를 불러오는 중...</div>
        ) : (
          <div className="job-list">
            {topJobs.map((item, index) => {
              const max = topJobs[0]?.total || 1;

              return (
                <div className="job-row" key={item.job}>
                  <div className="job-row-top">
                    <div className="job-row-left">
                      <span className="job-rank">{index + 1}</span>
                      <span className="job-name">{item.job}</span>
                    </div>

                    <strong className="job-value">
                      {item.total.toLocaleString()}건
                    </strong>
                  </div>

                  <div className="job-bar-bg">
                    <div
                      className="job-bar-fill"
                      style={{ width: `${(item.total / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  </div>
</section>


   
      
    </main>

  {/* Footer */}
  <footer className='footer'>
    @ 2026 WorkLinker. All rights reserved 
  </footer>


  </div>

 );

}







