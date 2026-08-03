"use client";
import { useMemo, useState } from "react";
const categories=["전체","입문","장비","기술","훈련","스파링","체육관"];
const guides=[
["입문","처음 체육관에 갈 때 준비할 것","운동복부터 수건, 물, 손톱 정리까지 첫 수업 전에 챙길 기본 준비물을 한 번에 확인합니다.","첫날,준비물","4분","입문"],
["장비","복싱 글러브 선택 기준","온스별 용도와 손 크기, 백 훈련과 스파링용 글러브를 나눠 고르는 기준을 정리했습니다.","글러브,온스","6분","글러브"],
["장비","핸드랩 감는 법과 길이 고르기","손목과 너클을 보호하는 기본 순서, 2.5m·4m 랩의 차이와 세탁 팁을 모았습니다.","붕대,손목","5분","핸드랩"],
["기술","원투가 자꾸 밀리는 이유","스탠스, 체중 이동, 뒷발 회전에서 자주 생기는 문제와 혼자 점검하는 체크포인트입니다.","원투,스탠스","7분","원투"],
["훈련","주 3회 생활복싱 루틴","줄넘기·섀도·미트·샌드백을 체력에 맞춰 구성하는 60분 훈련 흐름을 살펴봅니다.","루틴,체력","8분","루틴"],
["스파링","첫 스파링 전 알아둘 매너","강도 조절, 장비 확인, 파트너와의 신호처럼 안전하게 즐기기 위한 기본 약속입니다.","안전,매너","5분","스파링"],
["체육관","나에게 맞는 복싱장 고르는 법","통학 거리뿐 아니라 수업 방식, 샤워 시설, 스파링 문화까지 체험 수업에서 볼 항목입니다.","등록,체험","6분","체육관"],
["훈련","줄넘기에서 종아리가 먼저 아플 때","착지 습관과 줄 길이를 확인하고 운동량을 안전하게 늘리는 방법을 모았습니다.","줄넘기,부상예방","4분","줄넘기"]];
const gallery="https://gall.dcinside.com/mgallery/board/lists/?id=bx";
export default function Home(){const[category,setCategory]=useState("전체");const[query,setQuery]=useState("");const filtered=useMemo(()=>guides.filter(g=>(category==="전체"||g[0]===category)&&g.join(" ").toLowerCase().includes(query.toLowerCase())),[category,query]);return <main>
<header className="topbar"><a className="brand" href="#top"><span className="mark">B</span><span>복싱아카이브</span></a><nav><a href="#guides">정보 모음</a><a href="#start">입문 가이드</a><a href={gallery} target="_blank">원문 갤러리 ↗</a></nav></header>
<section className="hero" id="top"><div className="eyebrow"><span>●</span> 생활복싱 마이너 갤러리 큐레이션</div><h1>흩어진 복싱 정보,<br/><em>링 위에 정리하다.</em></h1><p>장비 고르기부터 첫 스파링까지. 생활복싱 갤러리의 경험과 팁을 주제별로 모아 빠르게 찾아보세요.</p><label className="search"><span>⌕</span><input aria-label="정보 검색" placeholder="궁금한 내용을 검색하세요 — 예: 글러브, 원투, 스파링" value={query} onChange={e=>setQuery(e.target.value)}/><kbd>검색</kbd></label><div className="stats"><div><strong>7</strong><span>주제별 분류</span></div><div><strong>한눈에</strong><span>핵심 요약</span></div><div><strong>원문</strong><span>출처 바로가기</span></div></div></section>
<section className="start" id="start"><div><span className="section-no">01 — START HERE</span><h2>복싱이 처음이라면</h2><p>처음 시작할 때 가장 많이 찾는 정보만 순서대로 골랐습니다.</p></div><div className="steps">{[["01","체육관 고르기","좋은 복싱장의 기준","체육관"],["02","기본 장비 준비","글러브와 핸드랩","장비"],["03","첫 달 훈련","기초 체력과 루틴","훈련"]].map(s=><a href="#guides" key={s[0]} onClick={()=>setCategory(s[3])}><b>{s[0]}</b><span><strong>{s[1]}</strong><small>{s[2]}</small></span><i>→</i></a>)}</div></section>
<section className="library" id="guides"><div className="section-head"><div><span className="section-no">02 — ARCHIVE</span><h2>정보 모음</h2></div><p>갤러리의 반복되는 질문과 유용한 답변을<br/>찾기 쉬운 형태로 요약했습니다.</p></div><div className="filters">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="grid">{filtered.map((g,i)=><article key={g[1]}><div className="card-top"><span>{g[0]}</span><small>{g[4]} 읽기</small></div><h3>{g[1]}</h3><p>{g[2]}</p><div className="tags">{g[3].split(",").map(t=><span key={t}>#{t}</span>)}</div><a href={`${gallery}&s_type=search_subject_memo&s_keyword=${encodeURIComponent(g[5])}`} target="_blank">관련 원문 찾아보기 <span>↗</span></a><b className="card-no">{String(i+1).padStart(2,"0")}</b></article>)}</div>{!filtered.length&&<div className="empty">검색 결과가 없습니다. 다른 단어로 찾아보세요.</div>}</section>
<section className="note"><span>!</span><p><strong>함께 만드는 아카이브</strong> 이 사이트는 생활복싱 갤러리의 공개 게시물을 주제별로 찾기 쉽게 연결하는 비공식 큐레이션입니다. 글의 권리는 원작성자에게 있으며, 정확한 내용은 원문을 확인하세요.</p><a href={gallery} target="_blank">갤러리 가기 ↗</a></section>
<footer><a className="brand" href="#top"><span className="mark">B</span><span>복싱아카이브</span></a><p>Keep your hands up. Keep learning.</p><small>© 2026 BOXING ARCHIVE</small></footer></main>}
