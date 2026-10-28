import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { T, usePreferences } from "@/context/Preferences";
import background from "../assets/hero-background.png";
import darkBackground from "../assets/hero-background-dark.png";
import "./Hero.css";

export default function Hero() {
  const { t } = useTranslation();
  const { theme } = usePreferences();
  return (
    <section className="editorial-hero" aria-labelledby="editorial-hero-title">
      <div className="editorial-hero__image" data-aos="fade-in" data-aos-duration="1000" data-aos-once="true" data-aos-offset="0">
        <img src={theme === 'dark' ? darkBackground : background} alt="" width="1672" height="941" fetchPriority="high" />
      </div>
      <div className="editorial-hero__inner container mx-auto px-5 md:px-8 lg:px-16">
        <div className="editorial-hero__content">
          <p className="editorial-hero__eyebrow" data-aos="fade-up" data-aos-delay="0" data-aos-duration="700" data-aos-easing="ease-out-cubic" data-aos-once="true" data-aos-offset="0"><span aria-hidden="true" />{t("hero.tag")}</p>
          <h1 id="editorial-hero-title" className="editorial-hero__title" data-aos="fade-up" data-aos-delay="100" data-aos-duration="700" data-aos-easing="ease-out-cubic" data-aos-once="true" data-aos-offset="0">{t("hero.title")}</h1>
          <p className="editorial-hero__description" data-aos="fade-up" data-aos-delay="200" data-aos-duration="700" data-aos-easing="ease-out-cubic" data-aos-once="true" data-aos-offset="0"><T>Discover curated fashion trends and handpicked seasonal styles.</T></p>
          <div className="editorial-hero__actions" data-aos="fade-up" data-aos-delay="300" data-aos-duration="700" data-aos-easing="ease-out-cubic" data-aos-once="true" data-aos-offset="0">
            <Link to="/shop" className="editorial-hero__shop">{t("hero.shopNow")}<span><ArrowUpRight size={22} className="rtl:-scale-x-100" aria-hidden="true" /></span></Link>
            <Link to="/collection" className="editorial-hero__collections">{t("hero.exploreCollections")}<ArrowRight size={17} className="rtl:rotate-180" aria-hidden="true" /></Link>
          </div>
          <div className="editorial-hero__signature" data-aos="fade-up" data-aos-delay="400" data-aos-duration="700" data-aos-easing="ease-out-cubic" data-aos-once="true" data-aos-offset="0" aria-hidden="true"><span>01</span><span /><T>FASHION</T></div>
        </div>
      </div>
    </section>
  );
}
