import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { T } from "@/context/Preferences";
import background from "../assets/hero-background.png";
import "./Hero.css";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="editorial-hero" aria-labelledby="editorial-hero-title">
      <div className="editorial-hero__image">
        <img src={background} alt="" width="1672" height="941" fetchPriority="high" />
      </div>
      <div className="editorial-hero__inner container mx-auto px-5 md:px-8 lg:px-16">
        <div className="editorial-hero__content">
          <p className="editorial-hero__eyebrow"><span aria-hidden="true" />{t("hero.tag")}</p>
          <h1 id="editorial-hero-title" className="editorial-hero__title">{t("hero.title")}</h1>
          <p className="editorial-hero__description"><T>Discover curated fashion trends and handpicked seasonal styles.</T></p>
          <div className="editorial-hero__actions">
            <Link to="/shop" className="editorial-hero__shop">{t("hero.shopNow")}<span><ArrowUpRight size={22} className="rtl:-scale-x-100" aria-hidden="true" /></span></Link>
            <Link to="/collection" className="editorial-hero__collections">{t("hero.exploreCollections")}<ArrowRight size={17} className="rtl:rotate-180" aria-hidden="true" /></Link>
          </div>
          <div className="editorial-hero__signature" aria-hidden="true"><span>01</span><span /><T>FASHION</T></div>
        </div>
      </div>
    </section>
  );
}
