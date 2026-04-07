import { Gift, Play } from "lucide-react";

const StarterpaketPage = () => {
  return (
    <div className="ginshi_section">
      {/* Page Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Gift size={14} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Starterpaket</span>
          <span className="ginshi_section_header_subtitle">
            Sichere dir kostenlose Starter-Gegenstände für deinen Dienstbeginn
          </span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="starter_banner">
        <div className="starter_banner_glow" />
        <div className="ginshi_corner_tl" />
        <div className="ginshi_corner_br" />

        <div className="starter_banner_icon">
          <Gift size={28} />
        </div>
        <div className="starter_banner_text">
          <h3 className="starter_banner_title">Dein Einstieg beginnt hier</h3>
          <p className="starter_banner_desc">
            Schaue dir das untenstehende Video vollständig an und du erhältst
            einige Starter-Gegenstände, die dir den Einstieg in den Dienst
            deutlich vereinfachen. Die Gegenstände werden dir automatisch
            gutgeschrieben.
          </p>
        </div>
      </div>

      {/* Video Embed */}
      <div className="starter_video_wrapper">
        <div className="starter_video_frame">
          <div className="ginshi_corner_tl" />
          <div className="ginshi_corner_br" />

          {/* Replace the src below with your YouTube embed URL */}
          <iframe
            className="starter_video_iframe"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Starterpaket Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Decorative overlay corners */}
          <div className="starter_video_scanline" />
        </div>

        <div className="starter_video_label">
          <Play size={12} />
          <span>Video ansehen um das Starterpaket freizuschalten</span>
        </div>
      </div>
    </div>
  );
};

export default StarterpaketPage;
