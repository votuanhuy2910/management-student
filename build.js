// Chạy khi deploy trên Vercel: đọc biến môi trường -> ghi dist/config.js
const fs = require("fs");
const url = process.env.SUPABASE_URL || "";
const key = process.env.SUPABASE_PUBLISHABLE_KEY || "";
if (!url || !key)
    console.warn(
        "⚠ Thiếu SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY: app sẽ hiện form nhập tay.",
    );
if (key.startsWith("sb_secret_")) {
    console.error("✖ Không dùng secret key ở phía client!");
    process.exit(1);
}
fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist");
fs.copyFileSync("index.html", "dist/index.html");
fs.writeFileSync(
    "dist/config.js",
    "window.SCN_CONFIG=" + JSON.stringify({ url, key }) + ";",
);
console.log("✔ Đã tạo dist/");
