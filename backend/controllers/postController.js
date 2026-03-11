// let posts = [];

// exports.getPosts = (req, res) => {
//   res.json(posts);
// };

// exports.createPost = (req, res) => {
//   const { title, content } = req.body;

//   if (!title || !content) {
//     return res.status(400).json({ message: 'title and content required' });
//   }

//   const newPost = {
//     id: Date.now(),
//     title,
//     content,
//     createdAt: new Date()
//   };

//   posts.unshift(newPost);
//   res.status(201).json(newPost);
// };

// controllers/postController.js 예시
// let posts = [];
// let userMileage = 0; // 임시, 실제는 DB에서 가져오기

// exports.getPosts = (req, res) => {
//   res.json(posts);
// };

// exports.createPost = (req, res) => {
//   const { title, content } = req.body;
//   if (!title || !content) {
//     return res.status(400).json({ message: 'title and content required' });
//   }

//   const newPost = { id: Date.now(), title, content, createdAt: new Date() };
//   posts.unshift(newPost);

//   userMileage += 1; // 글 작성 시 1P 증가
//   res.status(201).json({ post: newPost, mileage: userMileage });
// };

// exports.deletePost = (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = posts.findIndex(p => p.id === id);
//   if (index === -1) return res.status(404).json({ message: '글 없음' });

//   posts.splice(index, 1);
//   userMileage = Math.max(0, userMileage - 1); // 글 삭제 시 1P 감소, 0 미만 방지
//   res.json({ message: '삭제 완료', mileage: userMileage });
// };


let posts = [];
let userMileage = 0; // 임시, 실제는 DB에서 가져오기

exports.getPosts = (req, res) => {
  res.json(posts);
};

exports.createPost = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'title and content required' });
  }

  const newPost = { id: Date.now(), title, content, createdAt: new Date() };
  posts.unshift(newPost);

  userMileage += 1; // 글 작성 시 1P 증가
  res.status(201).json({ post: newPost, mileage: userMileage });
};

// exports.deletePost = (req, res) => {
//   const id = Number(req.params.id); // 여기서 Number 변환
//   const index = posts.findIndex(p => p.id === id);
//   if (index === -1) return res.status(404).json({ message: '글 없음' });

//   posts.splice(index, 1);
//   userMileage = Math.max(0, userMileage - 1); // 글 삭제 시 1P 감소
//   res.json({ message: '삭제 완료', mileage: userMileage });
// };

// exports.deletePost = (req, res) => {
//   const id = Number(req.params.id); // 문자열 → 숫자 변환
//   const index = posts.findIndex(p => p.id === id);
//   if (index === -1) return res.status(404).json({ message: '글 없음' });

//   posts.splice(index, 1);
//   userMileage = Math.max(0, userMileage - 1);
//   res.json({ message: '삭제 완료', mileage: userMileage });
// };


// exports.deletePost = (req, res) => {
//   const id = Number(req.params.id); // 문자열 → 숫자 변환
//   const index = posts.findIndex(p => p.id === id);

//   if (index === -1) {
//     console.log("삭제 실패: 존재하지 않는 ID", id);
//     return res.status(404).json({ message: '글 없음' });
//   }

//   posts.splice(index, 1);
//   userMileage = Math.max(0, userMileage - 1);
//   res.json({ message: '삭제 완료', mileage: userMileage });
// };


// exports.deletePost = (req, res) => {
//   const id = Number(req.params.id);
//   console.log("삭제 요청 ID:", id, "현재 posts:", posts.map(p => p.id));
//   const index = posts.findIndex(p => p.id === id);

//   if (index === -1) return res.status(404).json({ message: '글 없음' });

//   posts.splice(index, 1);
//   userMileage = Math.max(0, userMileage - 1);
//   res.json({ message: '삭제 완료', mileage: userMileage });
// };


exports.deletePost = (req, res) => {
  const id = Number(req.params.id);
  console.log("삭제 요청 ID:", id, "현재 posts 배열:", posts.map(p => p.id));
  const index = posts.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).json({ message: '글 없음' });

  posts.splice(index, 1);
  userMileage = Math.max(0, userMileage - 1);
  res.json({ message: '삭제 완료', mileage: userMileage });
};
