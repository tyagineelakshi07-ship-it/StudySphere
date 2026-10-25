
import "./Home.css";

function Home() {
  return (
    <main className="home-page">

      {/* Welcome Text */}
      <div className="welcome-section">
        <p className="small-text">Welcome,</p>

        <h1>
          Neelakshi<span></span>
        </h1>

        <div className="name-underline"></div>
      </div>

      {/* Open Book */}
      <svg className="doodle-svg book-doodle" viewBox="0 0 180 140">
        <path d="M20 45 Q55 20 85 45 L85 120 Q52 95 20 115 Z" />
        <path d="M85 45 Q120 20 155 45 L155 115 Q120 95 85 120 Z" />
        <path d="M85 45 L85 120" />
        <path d="M35 55 Q55 45 72 55" />
        <path d="M35 68 Q55 58 72 68" />
        <path d="M98 55 Q120 45 140 55" />
        <path d="M98 68 Q120 58 140 68" />
        <path d="M52 22 L78 5" />
      </svg>

      {/* Clock */}
      <svg className="doodle-svg clock-doodle" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="45" />
        <circle cx="60" cy="60" r="3" />
        <path d="M60 60 L60 32" />
        <path d="M60 60 L80 70" />
        <path d="M60 10 L60 16" />
        <path d="M110 60 L104 60" />
        <path d="M60 110 L60 104" />
        <path d="M10 60 L16 60" />
      </svg>

      {/* Paper Plane */}
      <svg className="doodle-svg plane-doodle" viewBox="0 0 160 120">
        <path d="M15 60 L145 15 L95 105 L72 70 Z" />
        <path d="M72 70 L145 15" />
        <path d="M72 70 L68 100" />
        <path d="M72 70 L115 58" />
      </svg>

      {/* Coffee Cup */}
      <svg className="doodle-svg coffee-doodle" viewBox="0 0 120 120">
        <path d="M25 45 L90 45 L82 95 L35 95 Z" />
        <path d="M90 55 Q112 52 105 72 Q101 82 85 78" />
        <path d="M42 32 Q35 20 45 12" />
        <path d="M60 32 Q53 20 63 12" />
        <path d="M78 32 Q71 20 81 12" />
        <path d="M20 101 Q58 110 98 101" />
      </svg>

      {/* Laptop */}
      <svg className="doodle-svg laptop-doodle" viewBox="0 0 180 130">
        <rect x="35" y="20" width="110" height="70" rx="5" />
        <path d="M20 105 L160 105 L145 118 L35 118 Z" />
        <path d="M62 78 L82 78" />
      </svg>

      {/* Plant */}
      <svg className="doodle-svg plant-doodle" viewBox="0 0 140 160">
        <path d="M45 80 Q25 50 40 35 Q60 50 55 78" />
        <path d="M70 75 Q70 35 95 28 Q100 55 76 78" />
        <path d="M58 80 Q55 45 65 20" />
        <path d="M62 75 L62 105" />
        <path d="M35 105 L90 105 L82 145 L45 145 Z" />
        <path d="M45 115 Q62 125 82 115" />
      </svg>

      {/* Small Stars */}
      <span className="star star-one">✦</span>
      <span className="star star-two">✧</span>
      <span className="star star-three">✦</span>

      <span className="tiny-star tiny-one">•</span>
      <span className="tiny-star tiny-two">•</span>
      <span className="tiny-star tiny-three">•</span>
      <span className="tiny-star tiny-four">•</span>
      <span className="tiny-star tiny-five">•</span>

    </main>
  );
}

export default Home;

