import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, Menu, Pause, Play, X } from 'lucide-react';
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
        <a href="#flavors" onClick={close}>多重風味</a>
        <a href="#world" onClick={close}>全球通路</a>
        <a href="https://www.gingertw.com/" target="_blank" rel="noreferrer" onClick={close}>前往官網 <ArrowUpRight size={16} /></a>
      </nav>
    </header>
  );
}

function CountryIcon({ id }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg className="country-icon" viewBox="0 0 64 64" aria-hidden="true">
      {id === 'taiwan' && <g {...common}>
        <path d="M32 5v7M28 12h8l1.5 5h-11L28 12ZM25 17h14l-2 6H27l-2-6ZM27 23h10l2 6H25l2-6ZM25 29h14l-2 6H27l-2-6ZM27 35h10l2 6H25l2-6ZM25 41h14l-2 7H27l-2-7Z" />
        <path d="M28 48h8v8M23 56h18" />
      </g>}
      {id === 'usa' && <g {...common}>
        <path d="M24 55h23M27 50h17l2 5H25l2-5ZM29 39h13l2 11H27l2-11Z" />
        <path d="M31 39l-2-11 4-4 5 3 2 12M33 24l-1-5M32 19a4 4 0 1 1 8 0c0 2-1.8 4-4 4" />
        <path d="M37 27l5-8M42 19l2-7M44 12l3-3M44 12l4 1M44 12l-1-4M48 9l2 2M42 9l2-1" />
        <path d="M32 19l-3-1M33 16l-2-3M37 15v-4M40 16l2-3" />
      </g>}
      {id === 'japan' && <g {...common}>
        <circle cx="47" cy="17" r="7" />
        <path d="M7 49l18-25 8 12 6-8 18 21H7Z" />
        <path d="M17 36l8-12 5 8 3 4M10 49h44" />
      </g>}
      {id === 'malaysia' && <g {...common}>
        <path d="M17 53h14M33 53h14M20 17h8v36H18l2-36ZM36 17h8l2 36H34l2-36Z" />
        <path d="M22 17l2-8 2 8M38 17l2-8 2 8M21 26h8M20 34h10M19 42h12M35 26h10M35 34h10M34 42h12" />
        <path d="M29 32h7v6h-7M24 9V5M40 9V5" />
      </g>}
      {id === 'singapore' && <g {...common}>
        <path d="M14 49h36M17 45h8V25h-8v20ZM28 45h8V25h-8v20ZM39 45h8V25h-8v20Z" />
        <path d="M12 21c8 2 18-3 27-1 5 1 9 0 13-3l-2 8H15l-3-4Z" />
        <path d="M11 54c7-4 14 4 21 0s14 4 21 0" />
      </g>}
      {id === 'hongkong' && <g {...common}>
        <path d="M31 11v36M31 15c-7 3-13 10-16 20h16V15ZM33 17c8 4 13 10 16 18H33V17Z" />
        <path d="M12 40h40l-5 9H18l-6-9ZM23 49l4 5h14l4-5" />
        <path d="M9 56c7-4 14 4 23 0s16 4 23 0" />
        <path d="M41 13l4 4-4 4M48 10l5 5-5 5" />
      </g>}
    </svg>
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

function FlavorStage({ flavor }) {
  return (
    <div className="flavor-stage" style={{ '--flavor': flavor.color }} key={flavor.id}>
      <div className="flavor-halo" />
      <img className="flavor-image" src={flavor.image} alt={`${flavor.name}黑糖磚與原料`} loading="lazy" />
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
            onClick={() => setActive(item.id)}
            role="tab"
            aria-selected={item.id === active}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>{item.short}
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
            <div className="channel-item" key={channel} style={{ '--item-delay': `${index * 38}ms` }}>
              <span>{String(index + 1).padStart(2, '0')}</span><p>{channel}</p>
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
        <p>點選國家　讓圖釘帶你抵達</p>
      </Reveal>
      <div className="map-shell">
        <button className="motion-toggle" onClick={() => setPlaying(!playing)} aria-label={playing ? '暫停自動輪播' : '播放自動輪播'}>
          {playing ? <Pause size={14} /> : <Play size={14} />}{playing ? '暫停' : '播放'}
        </button>
        <div className="map-wrap" aria-label="糖鼎全球市場互動地圖">
          <ComposableMap projectionConfig={{ scale: 138 }} width={800} height={480}>
            <ZoomableGroup center={[10, 8]} zoom={1} minZoom={1} maxZoom={1}>
              <Geographies geography={worldData}>
                {({ geographies }) => geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} className="map-country" tabIndex={-1} />
                ))}
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
              <span><CountryIcon id={market.id} /></span><small>{market.name}</small>
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
  return <><Hero /><main><Story /><Flavors /><WorldMap /></main><Closing /></>;
}

createRoot(document.getElementById('root')).render(<App />);
