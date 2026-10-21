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
    <header className="topbar"><a className="brand" href="#top"><span className="mark">B</span><span>복싱아카이브</span></a><nav><a href="#guides">정보앨범</a><a href={gallery} target="_blank" rel="noopener noreferrer">원문 갤러리 ↗</a></nav></header>
    <section className="hero" id="top">
      <div className="eyebrow"><span>●</span> 생활복싱 마이너 갤러리 큐레이션</div>
      <h1>생복갤 정보 조회하기</h1>
      <p>장비 사용기 · 꿀팁 · 치료와 재활 · 만화</p>
      <small className="album-meta">{activePosts.length}개 링크 · {album.collections.length}개 모음집 · 갱신 {album.updatedAt.slice(0,10)}</small>
    </section>
    <section className="library" id="guides">
      <label className="search"><span aria-hidden="true">⌕</span><input aria-label="정보 검색" placeholder="제목·장비명 검색 — 예: 위닝, 글러브, 복싱화" value={query} onChange={e => setQuery(e.target.value)}/></label>
      <div className="filters" role="group" aria-label="카테고리">{categories.map(c => <button key={c} className={category === c ? "active" : ""} aria-pressed={category === c} onClick={() => { setCategory(c); setCollection(""); }}>{c}</button>)}</div>
      <div className="album-toolbar"><label>모음집 <select value={collection} onChange={e => setCollection(e.target.value)}><option value="">모든 모음집</option>{album.collections.filter(c => category === "전체" || c.category === category).map(c => <option value={c.id} key={c.id}>{c.title}</option>)}</select></label><span role="status">{filtered.length}개 결과</span><button onClick={reset}>필터 초기화</button></div>
      <div className="grid">{filtered.map(p => <article key={p.id}>
        <div className="card-top"><span>{p.categories.join(" · ")}</span><small>{p.kind === "collection" ? "모음글" : "정보글"}</small></div>
        <h3>{p.title}</h3><p className="provenance">수록: {p.collections.map(id => album.collections.find(c => c.id === id)?.title).filter(Boolean).join(" · ")}</p>
        <div className="tags"><span>DC #{p.id}</span></div><a href={p.url} target="_blank" rel="noopener noreferrer">DC 원문 보기 ↗</a>
      </article>)}</div>
      {!filtered.length && <div className="empty">검색 결과가 없습니다. 다른 단어로 찾아보세요.</div>}
    </section>
    <footer><a className="brand" href="#top"><span className="mark">B</span><span>복싱아카이브</span></a><p>Keep your hands up. Keep learning.</p><small>© 2026 BOXING ARCHIVE</small></footer>
  </main>;
}
