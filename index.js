#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error("변환할 파일 또는 디렉토리를 지정해주세요.");
    process.exit(1);
}

const target = args[0];
const transformPath = path.resolve(__dirname, "./transform.js");

// jscodeshift 명령어 실행
const command = `npx jscodeshift -t ${transformPath} ${target} --extensions=js,jsx,ts,tsx`;

try {
    console.log(`실행 중: ${command}`);
    execSync(command, { stdio: "inherit" });
} catch (error) {
    console.error("변환 도중 오류가 발생했습니다:", error.message);
    process.exit(1);
}
