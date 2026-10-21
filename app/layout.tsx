import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
const noto=Noto_Sans_KR({variable:"--font-noto",subsets:["latin"]});
export const metadata:Metadata={title:"생복갤 아카이브 — 생활복싱 정보 모음",description:"생활복싱 갤러리의 장비 사용기와 꿀팁을 주제·브랜드별로 찾아보세요."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body className={noto.variable}>{children}</body></html>}
