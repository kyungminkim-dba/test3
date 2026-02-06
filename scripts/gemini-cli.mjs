#!/usr/bin/env node
/**
 * Gemini CLI - Claude Code 보조 도구
 * 사용법: node scripts/gemini-cli.mjs "질문 내용"
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ GOOGLE_API_KEY 또는 GEMINI_API_KEY 환경 변수를 설정하세요.");
  console.error("   export GOOGLE_API_KEY='your-api-key'");
  process.exit(1);
}

const question = process.argv.slice(2).join(" ");

if (!question) {
  console.error("❌ 질문을 입력하세요.");
  console.error("   사용법: node scripts/gemini-cli.mjs '질문 내용'");
  process.exit(1);
}

async function askGemini(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n📝 Gemini 응답:\n");
    console.log(text);

  } catch (error) {
    console.error("❌ Gemini API 오류:", error.message);
    process.exit(1);
  }
}

askGemini(question);
