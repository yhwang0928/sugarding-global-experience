import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, HandHeart, Heart, Menu, Pause, Play, X } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from 'react-simple-maps';
import worldData from 'world-atlas/countries-110m.json';
import { features, flavors, markets } from './data';
import './styles.css';

const cx = (...classes) => classes.filter(Boolean).join(' ');

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function Reveal({ children, className = '', delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const elementRef = useRef(null);
  useEffect(() => {
    const node = elementRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={cx('reveal', className, visible && 'is-visible')}
      style={{ '--delay': `${delay}ms` }}
      ref={elementRef}
    >
      {children}
    </div>
  );
}

function BrandMark({ light = false }) {
  return (
    <a className={cx('brand-mark', light && 'brand-mark--light')} href="#top" aria-label="回到首頁">
      <strong>糖鼎</strong><span>SUGAR DING</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <BrandMark />
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? '關閉選單' : '開啟選單'} aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </button>
      <nav className={cx('site-nav', open && 'is-open')} aria-label="主要選單">
        <a href="#story" onClick={close}>品牌特色</a>
        <a href="#care" onClick={close}>照顧與公益</a>
        <a href="#flavors" onClick={close}>多重風味</a>
        <a href="#world" onClick={close}>全球通路</a>
        <a href="https://www.gingertw.com/" target="_blank" rel="noreferrer" onClick={close}>前往官網 <ArrowUpRight size={16} /></a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <Header />
      <div className="steam steam--one" aria-hidden="true" />
      <div className="steam steam--two" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">一塊黑糖　　一段陪伴</p>
        <h1><span>把台灣的熬煮</span><span>帶進世界日常</span></h1>
        <p className="hero-lead"><span>一沖即飲</span><span>多種風味　各自完整</span></p>
        <a className="text-link" href="#flavors">看看口味 <ArrowDown size={17} /></a>
      </div>
      <div className="hero-media" aria-label="糖鼎黑糖飲與原料情境圖">
        <img src="/assets/hero-tea-ritual.webp" alt="熱黑糖飲 黑糖磚 老薑與紅棗" />
        <span className="hero-media-ring hero-media-ring--one" />
        <span className="hero-media-ring hero-media-ring--two" />
      </div>
      <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>世界裡的一杯糖鼎</span></div>
    </section>
  );
}

function Story() {
  return (
    <section className="section story" id="story">
      <Reveal className="story-visual">
        <img src="/assets/flavor-story.webp" alt="糖鼎五種風味原料與黑糖磚" loading="lazy" />
        <span>五種風味　各自完整</span>
      </Reveal>
      <div className="story-content">
        <Reveal className="section-heading">
          <p className="eyebrow">產品特色</p>
          <h2><span>時間熬好</span><span>日常就簡單</span></h2>
        </Reveal>
        <div className="feature-list">
          {features.map((feature, index) => (
            <Reveal key={feature.title} className="feature-row" delay={index * 100}>
              <span className="feature-number">0{index + 1}</span>
              <div><h3>{feature.title}</h3><p>{feature.body}</p></div>
              <i className="feature-line" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Care() {
  return (
    <section className="section care" id="care">
      <Reveal className="section-heading care-heading">
        <p className="eyebrow">Care becomes care</p>
        <h2><span>先把自己照顧好</span><span>再把溫暖留給更多人</span></h2>
        <p>照顧不是停在自己身上<br />當心裡有了餘裕　善意就能繼續往外走</p>
      </Reveal>

      <div className="care-journey" aria-label="從自我照顧延伸到公益關懷">
        <Reveal className="care-card care-card--self">
          <span className="care-card__icon"><Heart aria-hidden="true" /></span>
          <p>給自己</p>
          <h3>一杯溫熱<br />留一點時間給自己</h3>
          <small>照顧身體　也照顧日常</small>
        </Reveal>

        <div className="care-current" aria-hidden="true">
          <span className="care-current__line" />
          <i className="care-current__drop" />
          <i className="care-current__ring care-current__ring--one" />
          <i className="care-current__ring care-current__ring--two" />
        </div>

        <Reveal className="care-card care-card--others" delay={180}>
          <span className="care-card__icon"><HandHeart aria-hidden="true" /></span>
          <p>給別人</p>
          <h3>把日常的餘裕<br />化成對社會的關心</h3>
          <small>關懷他人　連結更多善意</small>
        </Reveal>
      </div>

      <Reveal className="care-promise" delay={260}>
        <span>公益行動</span>
        <p>從一個人開始<br />讓照顧成為一群人的力量</p>
        <small>合作內容與行動成果將持續公開</small>
      </Reveal>
    </section>
  );
}

function FlavorStage({ flavor }) {
  return (
    <div className="flavor-stage" style={{ '--flavor': flavor.color }} key={flavor.id}>
      <div className="flavor-halo" />
      <img className="flavor-image" src="/assets/flavor-cube-only.webp" alt={`${flavor.name}黑糖磚`} loading="lazy" />
      <div className="ingredient-orbits" aria-hidden="true">
        {flavor.particles.map((particle, index) => (
          <span
            className={`orbit-track orbit-track--${index + 1}`}
            key={`${particle}-${index}`}
          >
            <i className={`ingredient-particle ingredient-particle--${particle}`} />
          </span>
        ))}
      </div>
      <span className="flavor-spark flavor-spark--1" />
      <span className="flavor-spark flavor-spark--2" />
      <span className="flavor-spark flavor-spark--3" />
    </div>
  );
}

function Flavors() {
  const [active, setActive] = useState(flavors[0].id);
  const flavor = flavors.find((item) => item.id === active);
  useEffect(() => {
    flavors.forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
  }, []);
  return (
    <section className="section flavors" id="flavors">
      <Reveal className="section-heading section-heading--center">
        <p className="eyebrow">不是混在一起　　是多種選擇</p>
        <h2><span>每種風味</span><span>都有自己的主角</span></h2>
      </Reveal>
      <div className="flavor-layout">
        <FlavorStage flavor={flavor} />
        <div className="flavor-copy" key={`${flavor.id}-copy`}>
          <p className="flavor-note">{flavor.note}</p>
          <h3>{flavor.name}</h3>
          <p>{flavor.description}</p>
          <div className="flavor-tags">{flavor.ingredients.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </div>
      <div className="flavor-picker" role="tablist" aria-label="選擇口味">
        {flavors.map((item, index) => (
          <button
            key={item.id}
            className={cx('flavor-option', item.id === active && 'is-active')}
            style={{ '--option-color': item.color }}
            onClick={() => setActive(item.id)}
            role="tab"
            aria-selected={item.id === active}
          >
            <span className="flavor-option__art"><img src={item.image} alt="" /></span>
            <span className="flavor-option__copy"><small>風味 {String(index + 1).padStart(2, '0')}</small><strong>{item.short}</strong></span>
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

function MarketPanel({ market }) {
  return (
    <div className="market-panel" key={market.id} aria-live="polite">
      <div className="panel-grab" />
      <div className="panel-heading">
        <div><p>{market.en}</p><h3>{market.name}</h3></div>
        <strong>{market.channels.length ? `${market.channels.length} 個通路品牌` : '已進入市場'}</strong>
      </div>
      {market.channels.length ? (
        <div className="channel-list">
          {market.channels.map((channel, index) => (
            <div className="channel-item" key={channel.name} style={{ '--item-delay': `${index * 38}ms` }}>
              <span className={cx('channel-logo', channel.logoTheme === 'dark' && 'channel-logo--dark')}><img src={channel.logo} alt={`${channel.name} logo`} loading="lazy" /></span>
              <p>{channel.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="channel-empty">
          <span className="empty-pulse" />
          <p>糖鼎已走進{market.name}<br />通路名單整理中</p>
        </div>
      )}
    </div>
  );
}

function WorldMap() {
  const [activeId, setActiveId] = useState('taiwan');
  const [playing, setPlaying] = useState(true);
  const active = useMemo(() => markets.find((market) => market.id === activeId), [activeId]);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!playing || reduced) return undefined;
    const timer = window.setInterval(() => {
      setActiveId((current) => markets[(markets.findIndex((market) => market.id === current) + 1) % markets.length].id);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  const selectMarket = (id) => {
    setPlaying(false);
    setActiveId(id);
  };

  return (
    <section className="section world" id="world">
      <Reveal className="section-heading section-heading--world">
        <p className="eyebrow">Global presence</p>
        <h2><span>從台灣出發</span><span>走進六個市場</span></h2>
        <p>讓好口味　在全世界都能品嚐</p>
      </Reveal>
      <div className="map-shell">
        <button className="motion-toggle" onClick={() => setPlaying(!playing)} aria-label={playing ? '暫停自動輪播' : '播放自動輪播'}>
          {playing ? <Pause size={14} /> : <Play size={14} />}{playing ? '暫停' : '播放'}
        </button>
        <div className="map-wrap" aria-label="糖鼎全球市場互動地圖">
          <ComposableMap projectionConfig={{ scale: 138 }} width={800} height={480}>
            <ZoomableGroup center={[10, 8]} zoom={1} minZoom={1} maxZoom={1}>
              <g className="map-depth-layer" transform="translate(0 5)">
                <Geographies geography={worldData}>
                  {({ geographies }) => geographies.map((geo) => {
                    const market = markets.find((item) => item.geoId === String(geo.id));
                    return (
                      <Geography
                        key={`depth-${geo.rsmKey}`}
                        geography={geo}
                        className="map-country-depth"
                        style={{ fill: market ? '#5c2835' : '#76534b', outline: 'none' }}
                        tabIndex={-1}
                      />
                    );
                  })}
                </Geographies>
              </g>
              <Geographies geography={worldData}>
                {({ geographies }) => geographies.map((geo) => {
                  const geoId = String(geo.id);
                  const market = markets.find((item) => item.geoId === geoId);
                  const isMarket = Boolean(market);
                  const isSelected = active.geoId === geoId;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      className={cx('map-country', isMarket && 'is-market', isSelected && 'is-selected')}
                      style={{ fill: isSelected ? '#ffd16f' : (market?.mapColor || '#d8cdb8'), outline: 'none' }}
                      tabIndex={-1}
                    />
                  );
                })}
              </Geographies>
              {active.id !== 'taiwan' && (
                <Line
                  from={markets[0].coordinates}
                  to={active.coordinates}
                  stroke="#d48930"
                  strokeWidth={2.2}
                  fill="transparent"
                  strokeLinecap="round"
                  className="market-route"
                />
              )}
              {markets.map((market) => (
                <Marker key={market.id} coordinates={market.coordinates}>
                  <g
                    className={cx('map-marker', activeId === market.id && 'is-active', market.id === 'taiwan' && 'is-origin')}
                    onClick={() => selectMarket(market.id)}
                    onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && selectMarket(market.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`選擇${market.name}`}
                  >
                    <circle className="marker-pulse" r="13" />
                    <circle className="marker-core" r="7" />
                    <circle className="marker-dot" r="2.4" />
                    {activeId === market.id && <text y="-15" textAnchor="middle">{market.name}</text>}
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
          <div className="route-light" key={activeId} aria-hidden="true" />
        </div>
        <div className="market-picker" role="tablist" aria-label="選擇市場">
          {markets.map((market) => (
            <button
              className={cx('market-option', activeId === market.id && 'is-active')}
              key={market.id}
              onClick={() => selectMarket(market.id)}
              role="tab"
              aria-selected={activeId === market.id}
            >
              <span><img src={market.icon} alt={`${market.name}代表地標`} /></span><small>{market.name}</small>
            </button>
          ))}
        </div>
        <MarketPanel market={active} />
      </div>
    </section>
  );
}

function Closing() {
  return (
    <footer className="closing">
      <div className="closing-glow" />
      <Reveal>
        <p className="eyebrow">From Taiwan　With warmth</p>
        <h2><span>下一杯</span><span>想在哪裡遇見糖鼎</span></h2>
        <p>找商品　看靈感　一起走向更多地方</p>
        <div className="closing-actions">
          <a href="https://www.gingertw.com/" target="_blank" rel="noreferrer">前往官方網站 <ArrowUpRight size={18} /></a>
          <a href="https://www.youtube.com/@%E7%B3%96%E9%BC%8E%E9%BB%91%E7%B3%96" target="_blank" rel="noreferrer">觀看 YouTube <ArrowUpRight size={18} /></a>
        </div>
      </Reveal>
      <div className="footer-bottom">
        <BrandMark light />
        <p>陪伴讓一切美好</p>
        <small>© {new Date().getFullYear()} SUGAR DING</small>
      </div>
    </footer>
  );
}

function App() {
  return <><Hero /><main><Story /><Care /><Flavors /><WorldMap /></main><Closing /></>;
}

createRoot(document.getElementById('root')).render(<App />);
