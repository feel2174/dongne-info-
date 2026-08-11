import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ sido: string; sigungu: string }>;
}) {
  const raw = await params;
  const sido = decodeURIComponent(raw.sido);
  const sigungu = decodeURIComponent(raw.sigungu);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#16a34a",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            width: 120,
            height: 120,
            borderRadius: "9999px",
            background: "#facc15",
          }}
        />
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#fef9c3",
            display: "flex",
          }}
        >
          {sido}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 96,
            fontWeight: 800,
            color: "white",
            display: "flex",
          }}
        >
          {sigungu}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 36,
            fontWeight: 600,
            color: "#fef9c3",
            display: "flex",
          }}
        >
          재활용 쓰레기 버리는 날 · 종량제봉투 파는 곳
        </div>
      </div>
    ),
    { ...size }
  );
}
