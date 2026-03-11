
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Main.css';

export default function Main() {
  return (
    <div className="pages">

      {/* Header */}
      <header className="header">
        <h1 className="logo">WorkLinker</h1>

        <nav className="nav">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero"
        >
          <h2 className="title">
            당신의 일과 기회를
            <span className="highlight">하나로 연결하다</span>
          </h2>

          <p className="description">
            WorkLinker는 중장년층을 위한 콘텐츠, 프로그램 추천을 통해
            새로운 일과 성장을 연결하는 플랫폼입니다.
          </p>

          <div className="buttons">
            <Link to="/home" className="btn primary">
              시작하기
            </Link>

            <Link to="/program" className="btn outline">
              추천보기
            </Link>

            <Link to="/recommend" className="btn outline">
              간편보기
            </Link>

          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="footer">
        © 2026 WorkLinker. All rights reserved.
      </footer>

    </div>
  );
}