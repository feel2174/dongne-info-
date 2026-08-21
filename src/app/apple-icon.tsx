import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const bold = await readFile(join(process.cwd(), "assets/fonts/pt-extrabold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(150deg, #22c55e 0%, #16a34a 100%)",
          fontFamily: "Pretendard",
          fontSize: 110,
          fontWeight: 800,
          color: "#facc15",
        }}
      >
        우
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: bold, weight: 800, style: "normal" }] }
  );
}
