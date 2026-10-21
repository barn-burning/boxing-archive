"use client";
import { useMemo, useState } from "react";
import album from "../data/album.json";
import "./album.css";

const gallery = "https://gall.dcinside.com/mgallery/board/lists/?id=bx";
const categories = ["전체", "장비", "꿀팁", "치료·재활", "만화"];
const activePosts = album.posts.filter(p => p.status === "active");

export default function Home() {
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("");
  const filtered = useMemo(() => activePosts.filter(p =>
    (category === "전체" || p.categories.includes(category)) &&
    (!collection || p.collections.includes(collection)) &&
    `${p.title} ${p.categories.join(" ")} ${p.collections.map(id => album.collections.find(c => c.id === id)?.title).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [category, query, collection]);
  function reset() { setCategory("전체"); setQuery(""); setCollection(""); }
  return <main>
    <header className="topbar"><a className="brand" href="#top"><span className="mark">B</span><span>복싱아카이브</span></a><nav><a href="#guides">정보앨범</a><a href="#start">모음집</a><a href={gallery} target="_blank" rel="noopener noreferrer">원문 갤러리 ↗</a></nav></header>
    <section className="hero" id="top">
      <div className="eyebrow"><span>●</span> 생활복싱 마이너 갤러리 큐레이션</div>
      <h1>흩어진 복싱 정보,<br/><em>링 위에 정리하다.</em></h1>
      <p>갤러리에서 직접 모아둔 장비 사용기, 꿀팁, 재활 경험과 만화. 정보앨범에 담긴 글을 한곳에서 찾아보세요.</p>
      <label className="search"><span>⌕</span><input aria-label="정보 검색" placeholder="제목·장비명·모음집 검색 — 예: 위닝, 글러브, 복싱화" value={query} onChange={e => setQuery(e.target.value)}/></label>
      <div className="stats"><div><strong>{activePosts.length}</strong><span>중복 제외한 링크</span></div><div><strong>{album.collections.length}</strong><span>확인한 모음글</span></div><div><strong>{album.updatedAt.slice(0,10)}</strong><span>마지막 수동 갱신</span></div></div>
    </section>
    <section className="start" id="start">
      <div><span className="section-no">01 — COLLECTIONS</span><h2>갤러리가 모은 정보</h2><p>운영자가 정리한 모음글을 따라 수집합니다.<br/>주제를 선택해 관련 글을 찾아보세요.</p></div>
      <div className="steps">{[["장비", "장비 사용기", "글러브·복싱화·보호장비"], ["꿀팁", "복싱 꿀팁", "기본·훈련·실전"], ["치료·재활", "치료와 재활", "갤러리 이용자의 경험담"], ["만화", "복싱 만화", "생복이들의 카툰"]].map((s,i) => <a key={s[0]} href="#guides" onClick={() => { reset(); setCategory(s[0]); }}><b>0{i+1}</b><span><strong>{s[1]}</strong><small>{s[2]}</small></span><i>→</i></a>)}</div>
    </section>
    <section className="library" id="guides">
      <div className="section-head"><div><span className="section-no">02 — ARCHIVE</span><h2>정보앨범</h2></div><p>모음글 본문에 연결된 실제 게시물입니다.<br/>카드에서 DC 원문으로 바로 이동하세요.</p></div>
      <div className="filters" role="group" aria-label="카테고리">{categories.map(c => <button key={c} className={category === c ? "active" : ""} aria-pressed={category === c} onClick={() => { setCategory(c); setCollection(""); }}>{c}</button>)}</div>
      <div className="album-toolbar"><label>모음집 <select value={collection} onChange={e => setCollection(e.target.value)}><option value="">모든 모음집</option>{album.collections.filter(c => category === "전체" || c.category === category).map(c => <option value={c.id} key={c.id}>{c.title}</option>)}</select></label><span role="status">{filtered.length}개 결과</span><button onClick={reset}>필터 초기화</button></div>
      <div className="grid">{filtered.map(p => <article key={p.id}>
        <div className="card-top"><span>{p.categories.join(" · ")}</span><small>{p.kind === "collection" ? "모음글" : "정보글"}</small></div>
        <h3>{p.title}</h3><p className="provenance">수록: {p.collections.map(id => album.collections.find(c => c.id === id)?.title).filter(Boolean).join(" · ")}</p>
        <div className="tags"><span>DC #{p.id}</span></div><a href={p.url} target="_blank" rel="noopener noreferrer">DC 원문 보기 ↗</a>
      </article>)}</div>
      {!filtered.length && <div className="empty">검색 결과가 없습니다. 다른 단어로 찾아보세요.</div>}
    </section>
    <section className="note"><span>!</span><p><strong>갤러리의 경험을 연결합니다</strong>생활복싱 정보앨범에서 선정한 링크를 수동으로 갱신합니다. 제목과 수록 모음집을 제공하며 내용은 원문에서 확인할 수 있습니다. 치료·재활 글은 이용자의 개인 경험입니다.</p><a href={album.sourceUrl} target="_blank" rel="noopener noreferrer">정보앨범 원본 ↗</a></section>
    <footer><a className="brand" href="#top"><span className="mark">B</span><span>복싱아카이브</span></a><p>Keep your hands up. Keep learning.</p><small>© 2026 BOXING ARCHIVE</small></footer>
  </main>;
}
