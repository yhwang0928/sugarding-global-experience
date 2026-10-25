import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Award, HandHeart, Heart, Menu, Pause, Play, ShieldCheck, Sprout, Users, X } from 'lucide-react';
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

function BrandMark({ light = false, href = '#top' }) {
  return (
    <a className={cx('brand-mark', light && 'brand-mark--light')} href={href} aria-label="回到首頁">
      <strong>糖鼎</strong><span>SUGAR DING</span>
    </a>
  );
}

function Header({ page = 'home', light = false }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);
  const close = () => setOpen(false);
  const homeLink = page === 'about' ? '/' : '#top';
  const sectionLink = (hash) => (page === 'about' ? `/${hash}` : hash);
  return (
    <header className={cx('site-header', light && 'site-header--light')}>
      <BrandMark light={light} href={homeLink} />
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? '關閉選單' : '開啟選單'} aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </button>
      <nav className={cx('site-nav', open && 'is-open')} aria-label="主要選單">
        <a href="/about" onClick={close}>關於糖鼎</a>
        <a href={sectionLink('#story')} onClick={close}>品牌特色</a>
        <a href={sectionLink('#care')} onClick={close}>照顧與公益</a>
        <a href={sectionLink('#flavors')} onClick={close}>多重風味</a>
        <a href={sectionLink('#world')} onClick={close}>全球通路</a>
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
        <p className="eyebrow hero-eyebrow">真材實料　　一顆剛好</p>
        <h1><span>一顆黑糖磚</span><span>沖成一大杯</span></h1>
        <p className="hero-lead"><span>甜度退後</span><span>食材的風味　才喝得出來</span></p>
        <a className="text-link" href="#difference">為什麼是糖鼎 <ArrowDown size={17} /></a>
      </div>
      <div className="hero-media" aria-label="糖鼎黑糖飲與原料情境圖">
        <img src="/assets/hero-tea-ritual.webp" alt="熱黑糖飲 黑糖磚 老薑與紅棗" />
        <span className="hero-media-ring hero-media-ring--one" />
        <span className="hero-media-ring hero-media-ring--two" />
      </div>
      <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>一杯剛好的真材實料</span></div>
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

function ValueStory() {
  return (
    <section className="section value-story" id="difference" aria-labelledby="value-story-title">
      <Reveal className="value-story__visual">
        <div className="value-cup" aria-hidden="true">
          <div className="value-cup__steam"><i /><i /><i /></div>
          <div className="value-cup__glass">
            <div className="value-cup__tea" />
            <img src="/assets/flavor-cube-only.webp" alt="" />
          </div>
          <div className="value-cup__measure">
            <span><b>400</b> ml</span>
            <span><b>300</b></span>
            <span><b>200</b></span>
            <span><b>100</b></span>
          </div>
        </div>
        <p>建議沖泡水量　300–400ml</p>
      </Reveal>

      <div className="value-story__content">
        <Reveal className="section-heading">
          <p className="eyebrow">一顆剛好</p>
          <h2 id="value-story-title"><span>不是買一顆糖</span><span>是買一杯真實風味</span></h2>
          <p>一顆定量　不用秤不用猜<br />沖成一大杯　仍然喝得到食材主角</p>
        </Reveal>

        <div className="value-metrics">
          <Reveal className="value-metric" delay={80}>
            <strong>30<small>g</small></strong><span>一顆定量</span>
          </Reveal>
          <Reveal className="value-metric" delay={150}>
            <strong>7<small>杯</small></strong><span>剛好一週</span>
          </Reveal>
          <Reveal className="value-metric" delay={220}>
            <strong>23<small>元</small></strong><span>每杯約</span>
          </Reveal>
        </div>

        <Reveal className="value-note" delay={280}>
          <p><span>甜度退後</span><strong>食材風味向前</strong></p>
          <small>以小包7入官方售價160元換算<br />實際售價依各通路活動為準</small>
        </Reveal>
      </div>
    </section>
  );
}

function BrandProof() {
  return (
    <section className="section brand-proof" aria-labelledby="brand-proof-title">
      <Reveal className="section-heading brand-proof__heading">
        <p className="eyebrow">The reasons to believe</p>
        <h2 id="brand-proof-title"><span>不只好喝</span><span>還有被選擇的證明</span></h2>
      </Reveal>

      <div className="proof-grid">
        <Reveal className="proof-card proof-card--volume">
          <div className="proof-101-photo" aria-hidden="true">
            <img src="/assets/taipei-101-photo.jpg" alt="" loading="lazy" />
          </div>
          <p className="proof-card__label">每月出貨量</p>
          <p className="proof-number"><strong>1.5</strong><span>座<br />台北 101</span></p>
          <h3>一次次被選擇<br />就是市場給口味的回答</h3>
          <small>依品牌每月出貨量換算</small>
        </Reveal>

        <Reveal className="proof-card proof-card--world" delay={110}>
          <div className="proof-orbit" aria-hidden="true">
            {markets.map((market, index) => <i key={market.id} style={{ '--market-index': index }} />)}
            <b>6</b>
          </div>
          <p className="proof-card__label">六個市場　已經品嚐</p>
          <h3>從台灣出發<br />讓好口味串連全世界</h3>
          <div className="proof-markets">{markets.map((market) => <span key={market.id}>{market.name}</span>)}</div>
          <a href="#world">看看糖鼎走到哪裡 <ArrowDown size={17} /></a>
        </Reveal>

        <Reveal className="proof-card proof-card--quality" delay={220}>
          <span className="proof-quality-mark"><ShieldCheck aria-hidden="true" /></span>
          <p className="proof-card__label">從第一批到每一批</p>
          <h3>品質不是選項<br />是唯一考量</h3>
          <p>商品送驗 SGS / FSI<br />從原料挑選到包裝　每一道都嚴格管理</p>
          <div className="proof-quality-facts">
            <span>真材實料</span><span>薑茶零添加香精香料</span>
          </div>
          <span className="proof-quality-line"><i /><i /><i /><i /></span>
        </Reveal>
      </div>
    </section>
  );
}

function AboutTeaser() {
  return (
    <section className="section about-teaser" aria-labelledby="about-teaser-title">
      <Reveal className="about-teaser__media">
        <img src="/assets/about/about-founder.jpg" alt="台灣黑糖與原料" loading="lazy" />
        <span>ABOUT<br />SUGAR DING</span>
      </Reveal>
      <Reveal className="about-teaser__copy" delay={120}>
        <p className="eyebrow">關於糖鼎</p>
        <h2 id="about-teaser-title"><span>從照顧最重要的人</span><span>開始一個品牌</span></h2>
        <p>糖鼎誕生於一份陪伴家人的心意<br />從台灣甘蔗開始　把真材實料熬進每一塊黑糖</p>
        <a className="round-link" href="/about">走進糖鼎的故事 <ArrowRight size={18} /></a>
      </Reveal>
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
          <div className="care-card__media"><img src="/assets/hero-tea-ritual.webp" alt="為自己沖一杯溫熱黑糖飲" loading="lazy" /></div>
          <div className="care-card__body">
            <span className="care-card__icon"><Heart aria-hidden="true" /></span>
            <p>給自己</p>
            <h3>一杯溫熱<br />留一點時間給自己</h3>
            <small>照顧身體　也照顧日常</small>
          </div>
        </Reveal>

        <div className="care-current" aria-hidden="true">
          <span className="care-current__line" />
          <i className="care-current__drop" />
          <i className="care-current__ring care-current__ring--one" />
          <i className="care-current__ring care-current__ring--two" />
        </div>

        <Reveal className="care-card care-card--others" delay={180}>
          <div className="care-card__media"><img src="/assets/about/about-charity-2019.jpg" alt="糖鼎參與育幼院關懷活動" loading="lazy" /></div>
          <div className="care-card__body">
            <span className="care-card__icon"><HandHeart aria-hidden="true" /></span>
            <p>給別人</p>
            <h3>把日常的餘裕<br />化成對社會的關心</h3>
            <small>實際參與公益　讓善意走進更多日常</small>
          </div>
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
        <p className="eyebrow">今天想喝什麼</p>
        <h2><span>五種風味</span><span>五種不同日常</span></h2>
      </Reveal>
      <div className="flavor-layout">
        <FlavorStage flavor={flavor} />
        <div className="flavor-copy" key={`${flavor.id}-copy`}>
          <p className="flavor-note">{flavor.note}</p>
          <h3>{flavor.name}</h3>
          <p>{flavor.description}</p>
          <p className="flavor-moment">適合　{flavor.moment}</p>
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

function Closing({ about = false }) {
  return (
    <footer className="closing">
      <div className="closing-glow" />
      <Reveal>
        <p className="eyebrow">From Taiwan　With warmth</p>
        <h2>{about ? <><span>故事從家人開始</span><span>溫暖繼續往世界走</span></> : <><span>下一杯</span><span>想在哪裡遇見糖鼎</span></>}</h2>
        <p>{about ? '認識風味　尋找通路　讓照顧成為每一天的日常' : '找商品　看靈感　一起走向更多地方'}</p>
        <div className="closing-actions">
          {about && <a href="/#flavors">認識糖鼎風味 <ArrowRight size={18} /></a>}
          {!about && <a href="https://www.gingertw.com/" target="_blank" rel="noreferrer">前往官方網站 <ArrowUpRight size={18} /></a>}
          <a href={about ? '/#world' : 'https://www.youtube.com/@%E7%B3%96%E9%BC%8E%E9%BB%91%E7%B3%96'} target={about ? undefined : '_blank'} rel={about ? undefined : 'noreferrer'}>{about ? '查看全球通路' : '觀看 YouTube'} {about ? <ArrowRight size={18} /> : <ArrowUpRight size={18} />}</a>
        </div>
      </Reveal>
      <div className="footer-bottom">
        <BrandMark light href="/" />
        <p>陪伴讓一切美好</p>
        <small>© {new Date().getFullYear()} SUGAR DING</small>
      </div>
    </footer>
  );
}

function AboutPage() {
  useEffect(() => {
    document.title = '關於糖鼎｜糖鼎 SUGAR DING';
  }, []);

  return (
    <div className="about-page">
      <section className="about-hero" id="top">
        <Header page="about" light />
        <picture className="about-hero__image">
          <source media="(max-width: 899px)" srcSet="/assets/about/about-hero-alt.jpg" />
          <img src="/assets/about/about-hero.jpg" alt="糖鼎黑糖飲與黑糖磚" />
        </picture>
        <div className="about-hero__shade" />
        <div className="about-hero__copy">
          <p>ABOUT SUGAR DING</p>
          <h1><span>關於糖鼎</span><span>一份想照顧家人的心</span></h1>
        </div>
        <a className="about-hero__back" href="/"><ArrowLeft size={18} /> 回到首頁</a>
      </section>

      <main>
        <section className="section about-origin">
          <Reveal className="about-origin__heading">
            <p className="eyebrow">創業故事</p>
            <h2><span>因為在乎</span><span>所以不願將就</span></h2>
          </Reveal>
          <Reveal className="about-origin__copy" delay={100}>
            <p>看見重要的人每個月都承受身體不適<br />創辦人吳寰宇想找到一種溫柔而日常的陪伴</p>
            <p>從老糖師口中認識台灣甘蔗<br />才發現一塊色澤琥珀　口感溫潤的黑糖<br />也能承載一份真實的照顧</p>
          </Reveal>
          <Reveal className="about-origin__image" delay={180}>
            <img src="/assets/about/about-founder.jpg" alt="台灣黑糖塊與木碗" loading="lazy" />
            <span>從台灣甘蔗開始</span>
          </Reveal>
        </section>

        <section className="section about-belief">
          <div className="about-belief__rings" aria-hidden="true" />
          <Reveal className="about-belief__art">
            <img src="/assets/about/about-sugar.png" alt="糖鼎黑糖" loading="lazy" />
          </Reveal>
          <Reveal className="about-belief__copy" delay={120}>
            <p className="eyebrow">愛的濃縮</p>
            <h2><span>單純</span><span>從來不簡單</span></h2>
            <p>小小一塊黑糖磚<br />凝聚的是對家人的關心<br />也是糖鼎做每一項選擇的起點</p>
          </Reveal>
        </section>

        <section className="section about-craft">
          <Reveal className="about-craft__copy">
            <p className="eyebrow">品牌初衷</p>
            <h2><span>誠信做糖</span><span>回到食材原本的味道</span></h2>
            <p>選用台灣栽種甘蔗<br />不靠香精與糖精調製風味</p>
            <p>產品上市前經過團隊反覆試飲<br />唯有自己願意買　願意分享給家人<br />才值得交到顧客手上</p>
          </Reveal>
          <Reveal className="about-craft__image" delay={140}>
            <img src="/assets/about/about-tasting.jpg" alt="糖鼎團隊進行產品試飲" loading="lazy" />
          </Reveal>
        </section>

        <section className="section about-quality">
          <Reveal className="section-heading about-quality__heading">
            <p className="eyebrow">品質把關</p>
            <h2><span>讓承諾</span><span>經得起檢驗</span></h2>
          </Reveal>
          <Reveal className="about-quality__award" delay={100}>
            <img src="/assets/about/about-award.jpg" alt="Monde Selection 世界品質評鑑評審" loading="lazy" />
            <div><Award aria-hidden="true" /><p>2019 Monde Selection</p><strong>最頂級金獎</strong></div>
          </Reveal>
          <div className="quality-promises" aria-label="糖鼎品質承諾">
            {[
              [ShieldCheck, '拒絕香精', '讓食材說話'],
              [Sprout, '無添加糖精', '保留單純味道'],
              [ShieldCheck, '農藥零檢出', '自主定期檢驗'],
            ].map(([Icon, title, body], index) => (
              <Reveal className="quality-promise" delay={160 + index * 80} key={title}>
                <Icon aria-hidden="true" /><h3>{title}</h3><p>{body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section about-dream">
          <Reveal className="section-heading about-dream__heading">
            <p className="eyebrow">品牌夢想</p>
            <h2><span>從照顧女性</span><span>走向對世界友善</span></h2>
            <p>把自己顧好　同時也能照顧到其他人<br />這不只是一句話　而是糖鼎持續採取的行動</p>
          </Reveal>
          <div className="dream-grid">
            {[
              [Heart, '定期公益活動', '把溫暖送到需要陪伴的地方'],
              [HandHeart, '持續志工服務', '讓每次參與累積成長久關係'],
              [Users, '支持二度就業女性', '創造能重新出發的友善工作機會'],
            ].map(([Icon, title, body], index) => (
              <Reveal className="dream-card" delay={100 + index * 90} key={title}>
                <span><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section about-impact">
          <Reveal className="section-heading about-impact__heading">
            <p className="eyebrow">小小力量 × 每一個人</p>
            <h2><span>讓照顧</span><span>真正走進行動</span></h2>
          </Reveal>
          <div className="impact-list">
            {[
              ['2019', '育幼院關懷活動', '/assets/about/about-charity-2019.jpg'],
              ['2021', '伊甸基金會參訪活動', '/assets/about/about-charity-2021.jpg'],
              ['2022', '志工淨灘活動', '/assets/about/about-charity-2022.jpg'],
            ].map(([year, title, image], index) => (
              <Reveal className="impact-card" delay={index * 90} key={year}>
                <div><img src={image} alt={title} loading="lazy" /></div>
                <p>{year}</p><h3>{title}</h3>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Closing about />
    </div>
  );
}

function App() {
  const isAboutPage = window.location.pathname.replace(/\/+$/, '') === '/about';
  useEffect(() => {
    if (!isAboutPage) document.title = '糖鼎 SUGAR DING｜台灣黑糖走進世界日常';
  }, [isAboutPage]);
  if (isAboutPage) return <AboutPage />;
  return <><Hero /><main><Story /><ValueStory /><BrandProof /><AboutTeaser /><Care /><Flavors /><WorldMap /></main><Closing /></>;
}

createRoot(document.getElementById('root')).render(<App />);
