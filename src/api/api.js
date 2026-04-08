import axios from 'axios';

// 백엔드(Flask) 서버의 기본 주소를 설정합니다.
// 로컬 테스트용이므로 localhost:5000을 씁니다. 나중에 AWS에 올리면 이 주소만 바뀝니다.
const api = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;