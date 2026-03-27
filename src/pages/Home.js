import React, { useState } from 'react';
import Contents from '../components/Contents/Contents';

const Home = ({ user }) => {
  // 사용자의 첫 번째 관심사를 초기 검색어로 설정
  const initialKeyword = user?.interests?.[0] || '중장년 취업 교육';
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);

  return (
    // 💡 팩트 체크: 여기서 좌, 우 사이드바 코드는 완전히 사라졌습니다!
    // 이 컴포넌트는 MainLayout의 <Outlet /> 자리에 쏙 들어가게 됩니다.
    <div style={styles.homeContainer}>
      <Contents 
        initialKeyword={initialKeyword} 
        onSearch={(k) => setSearchKeyword(k)} 
      />
    </div>
  );
};

const styles = {
  homeContainer: { 
    width: '100%', 
    height: '100%' 
  }
};

export default Home;