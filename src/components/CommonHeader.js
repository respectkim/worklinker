import {Link, useLocation, useNavigate} from 'react-router-dom'

export default function CommonHeader(){

const location = useLocation();
const navigate = useNavigate();

const moveToSection =(sectionId) =>{
    if (location.pathname === '/'){
        const el = document.getElementById(sectionId);
        if (el){
            el.scrollIntoView({behavior: 'smooth'});
        }
    }else {
        navigate(`/#${sectionId}`);
    }
};
    return(
        <header className='header'>
            <div className='header-left'>
                <h1 className='logo' header-logo>
                    <img src='/logo2.png' alt='logo'/>
                    <span>WorkLinker</span>
                </h1>

                <nav className='main-nav'>
                  <button type='button'
                  onClick={()=>moveToSection('home')}
                  className='main-nav-link nav-button'
                  >
                    HOME
                  </button>
                  <Link to='/success' className='main-nav-link'>
                  성공사례
                  </Link>
                  <button
                  type='button'
                  onClick={()=> moveToSection('trend')}
                  className='main-nav-link nav-button'
                  >
                    취업동향
                  </button>
                  <button
                  type='button'
                  onClick={()=> moveToSection('jobs')}
                  className='main-nav-link nav-button'
                  >
                    추천직무
                  </button>
                  <Link to='/program' className='main-nav-link'>
                  추천교육
                  </Link>
                 <Link to='/contents' className='main-nav-link'>
                  유튭영상
                  </Link>

                </nav>
            </div>


        <nav className="nav">
        <Link to="/login" className='nav-link'>Login</Link>
        <span className="nav-divider"/>
        <Link to="/register" className='nav-link'>Register</Link>

         </nav>
        </header>
    )
}