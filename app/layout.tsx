import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
const noto=Noto_Sans_KR({variable:"--font-noto",subsets:["latin"]});
export const metadata:Metadata={title:"복싱아카이브 — 생활복싱 정보 모음",description:"생활복싱 갤러리의 장비, 기술, 훈련, 스파링 정보를 주제별로 찾아보세요."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body className={noto.variable}>{children}</body></html>}
