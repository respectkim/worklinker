
// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(cors());
// app.use(express.json());

// // 🔥 핵심
// app.use('/api', require('./routes/auth'));
// app.use('/api', require('./routes/recommend')); 
// app.use('/api/posts', require('./routes/posts')); // ✅ 추가

// app.listen(5000, () => {
//   console.log('Backend running on port 5000');
// });

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// 라우터 연결
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/recommend', require('./routes/recommend')); // ✅ 정상 동작

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});


// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api', require('./routes/auth'));   // ⭐ 이 줄
// //            ↑ 이게 없거나 다르면 404

// app.listen(5000, () => {
//   console.log('Backend running on port 5000');
// });



// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(cors());
// app.use(express.json());

// // ⭐ 반드시 이 줄
// app.use('/api', require('./routes/auth'));

// app.listen(5000, () => {
//   console.log('Backend running on port 5000');
// });