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

function SugarCube({ small = false }) {
  return (
    <div className={cx('sugar-cube', small && 'sugar-cube--small')} aria-hidden="true">
      <span className="cube-face cube-face--front" />
      <span className="cube-face cube-face--top" />
      <span className="cube-face cube-face--side" />
      <i className="cube-glow" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <Header />
      <div className="steam steam--one" aria-hidden="true" />
      <div className="steam steam--two" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">一塊黑糖 · 一段陪伴</p>
        <h1><span>把台灣的熬煮，</span><span>放進世界的日常。</span></h1>
        <p className="hero-lead">糖鼎把時間熬進一塊黑糖磚。多重風味各自完整，一沖即飲，也把熟悉的溫暖帶往六個市場。</p>
        <a className="text-link" href="#flavors">探索風味 <ArrowDown size={17} /></a>
      </div>
      <div className="hero-object" aria-label="黑糖磚動態示意">
        <div className="orbit orbit--a" />
        <div className="orbit orbit--b" />
        <SugarCube />
        <span className="ingredient ingredient--ginger">薑</span>
        <span className="ingredient ingredient--date">棗</span>
        <span className="ingredient ingredient--tea">茶</span>
      </div>
      <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>世界裡的一杯糖鼎</span></div>
    </section>
  );
}

function Story() {
  return (
    <section className="section story" id="story">
      <Reveal className="section-heading">
        <p className="eyebrow">產品特色</p>
        <h2>把複雜的熬煮，<br />收進簡單的一杯。</h2>
        <p>真正的便利，不該犧牲風味。糖鼎把比例、火候與時間先做好，讓每一次沖泡都穩定，也保留各種原料應有的個性。</p>
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
    </section>
  );
}

function FlavorStage({ flavor }) {
  return (
    <div className="flavor-stage" style={{ '--flavor': flavor.color }} key={flavor.id}>
      <div className="flavor-halo" />
      <div className="flavor-cube"><SugarCube small /></div>
      {flavor.ingredients.map((item, index) => (
        <span className={`flavor-ingredient flavor-ingredient--${index + 1}`} key={item}>{item}</span>
      ))}
      <span className="flavor-spark flavor-spark--1" />
      <span className="flavor-spark flavor-spark--2" />
      <span className="flavor-spark flavor-spark--3" />
    </div>
  );
}

function Flavors() {
  const [active, setActive] = useState(flavors[0].id);
  const flavor = flavors.find((item) => item.id === active);
  return (
    <section className="section flavors" id="flavors">
      <Reveal className="section-heading section-heading--center">
        <p className="eyebrow">不是多合一，是多種選擇</p>
        <h2>每個口味，<br />都有自己的主角。</h2>
      </Reveal>
      <div className="flavor-layout">
        <FlavorStage flavor={flavor} />
        <div className="flavor-copy" key={`${flavor.id}-copy`}>
          <p className="flavor-note">{flavor.note}</p>
          <h3>{flavor.name}</h3>
          <p>{flavor.description}</p>
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
          <p>糖鼎已走進{market.name}。<br />完整通路名單整理中，敬請期待。</p>
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
        <h2>糖鼎，正在世界各地被看見。</h2>
        <p>點選下方國家，對應圖釘會放大；跟著從台灣出發的琥珀光線，找到離你最近的糖鼎。</p>
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
              <span>{market.symbol}</span><small>{market.name}</small>
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
        <p className="eyebrow">From Taiwan, with warmth.</p>
        <h2>下一杯，<br />想在哪裡遇見糖鼎？</h2>
        <p>尋找商品、觀看沖泡靈感，或與糖鼎一起把台灣的味道帶到更多地方。</p>
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
