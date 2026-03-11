// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api'
// });

// export default api;


// import axios from 'axios';


// const api = axios.create({
//   baseURL: window.location.hostname === 'localhost'
//     ? 'http://localhost:5000/api'
//     : 'http://10.211.244.141:5000/api'
// });

// export default api;

// import axios from 'axios';

// const api = axios.create({
//   baseURL: window.location.hostname === 'localhost'
//     ? 'http://localhost:5000/api/auth'
//     : 'http://10.211.244.141:5000/api/auth'
// });

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'http://10.88.249.141:5000/api'
});

export default api;