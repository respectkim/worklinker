
const express = require('express');
const router = express.Router();

// 프론트엔드에서 /recommend 요청 시 JSON 반환
router.get('/', (req, res) => {
  res.json([
    {
      type: 'education',
      title: '중장년 IT 재취업 과정',
      provider: '고용노동부'
    },
    {
      type: 'youtube',
      title: '중장년 재취업 성공사례',
      url: 'https://youtube.com'
    },
    {
      title: 'React 기초 강의',
      provider: '인프런',
      url: 'https://www.inflearn.com'
    },
    {
      title: '프론트엔드 로드맵',
      provider: '유튜브',
      url: 'https://youtube.com'
    }
  ]);
});

module.exports = router;

// const express = require('express');
// const router = express.Router();

// router.get('/recommend', (req, res) => {
//   res.json([
//     {
//       type: 'education',
//       title: '중장년 IT 재취업 과정',
//       provider: '고용노동부'
//     },
//     {
//       type: 'youtube',
//       title: '중장년 재취업 성공사례',
//       url: 'https://youtube.com'
//     },
//     {
//       title: 'React 기초 강의',
//       provider: '인프런',
//       url: 'https://www.inflearn.com'
//     },
//     {
//       title: '프론트엔드 로드맵',
//       provider: '유튜브',
//       url: 'https://youtube.com'
//     }
//   ]);
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();

// router.get('/recommend', (req, res) => {
//    res.json([
//      {
//        type: 'education',
//        title: '중장년 IT 재취업 과정',
//        provider: '고용노동부'
//      },
//      {
//        type: 'youtube',
//        title: '중장년 재취업 성공사례',
//        url: 'https://youtube.com'
//      },
//      {
//        title: 'React 기초 강의',
//        provider: '인프런',
//        url: 'https://www.inflearn.com'
//      },
//      {
//        title: '프론트엔드 로드맵',
//        provider: '유튜브',
//        url: 'https://youtube.com'
//      }
//    ]);
//  });

// module.exports = router;


// const express = require('express');
// const router = express.Router();

// router.get('/recommend', (req, res) => {
//   res.json([
//     {
//       title: 'React 기초 강의',
//       provider: '인프런',
//       url: 'https://www.inflearn.com'
//     },
//     {
//       title: '프론트엔드 로드맵',
//       provider: '유튜브',
//       url: 'https://youtube.com'
//     }
//   ]);
// });

// module.exports = router;


// function Recommend() {
//   return <h2>추천 콘텐츠 페이지</h2>;
// }

// export default Recommend;