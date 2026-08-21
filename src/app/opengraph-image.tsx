import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
// 2x resolution (120:63 ratio) — vector-sourced, stays crisp when scaled up.
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default async function Image() {
  const [extrabold, medium] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/pt-extrabold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/pt-medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 200px",
          background: "#06271A",
          backgroundImage:
            "radial-gradient(circle at 80% 26%, rgba(34,197,94,0.50), transparent 52%), radial-gradient(circle at 12% 98%, rgba(250,204,21,0.18), transparent 46%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 150,
            right: 130,
            width: 620,
            height: 620,
            borderRadius: 620,
            background:
              "radial-gradient(circle at 38% 34%, rgba(134,239,172,0.50), rgba(22,163,74,0.05) 62%, transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 250,
            right: 250,
            width: 420,
            height: 420,
            borderRadius: 420,
            border: "3px solid rgba(187,247,208,0.26)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            width: 176,
            height: 176,
            borderRadius: 42,
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(150deg, #22c55e 0%, #16a34a 100%)",
            boxShadow: "0 46px 88px rgba(22,163,74,0.55), inset 0 3px 0 rgba(255,255,255,0.4)",
            marginBottom: 52,
            fontFamily: "Pretendard",
            fontWeight: 800,
            fontSize: 104,
            color: "#FFFFFF",
          }}
        >
          우
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderRadius: 999,
            background: "rgba(34,197,94,0.16)",
            border: "1px solid rgba(134,239,172,0.35)",
            padding: "14px 30px",
            marginBottom: 32,
            fontSize: 40,
            fontFamily: "Pretendard",
            fontWeight: 500,
            color: "#BBF7D0",
          }}
        >
          <div style={{ display: "flex", width: 18, height: 18, borderRadius: 18, background: "#facc15" }} />
          재활용 · 종량제봉투 · 분리배출
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 150,
            fontFamily: "Pretendard",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: -5,
            lineHeight: 1.06,
            wordBreak: "keep-all",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 58,
            fontFamily: "Pretendard",
            fontWeight: 500,
            color: "#A7C4B5",
            maxWidth: 1600,
            lineHeight: 1.35,
            wordBreak: "keep-all",
          }}
        >
          재활용 쓰레기 버리는 날 · 종량제봉투 파는 곳
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: extrabold, weight: 800, style: "normal" },
        { name: "Pretendard", data: medium, weight: 500, style: "normal" },
      ],
    }
  );
}
