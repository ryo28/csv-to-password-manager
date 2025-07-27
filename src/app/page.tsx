"use client";

import React, { useState, useRef } from "react";
import { convertToBitwardenCSV } from "./_component/convertToBitwardenCSV";
import { DownloadConvertedCsv } from "./_component/DownloadConvertedCsv";
import { PreviewOfConverted } from "./_component/PreviewOfConverted";
import Image from "next/image";
import nextConfig from "../../next.config.mjs";
const BASE_PATH = nextConfig.basePath || "";

export default function HomePage() {
  //変換後のCSVデータ
  const [convertedCsv, setConvertedCsv] = useState<string | null>(null);
  //ダウンロードするCSVファイル名
  const [fileName, setFileName] = useState<string>("bitwarden_import.csv");
  //ローディング状態
  const [isLoading, setIsLoading] = useState(false);
  //エラーメッセージ
  const [error, setError] = useState<string | null>(null);
  //変換されたレコード数
  const [recordCount, setRecordCount] = useState<number>(0);

  // ファイルinputのref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // CSVファイルの選択ハンドラー
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    try {
      const csvText = await file.text();
      // CSVをBitwarden形式に変換して結果を取得
      const result = convertToBitwardenCSV(csvText);
      setConvertedCsv(result.csv);
      setRecordCount(result.count);
      // ファイル名から拡張子を除去して新しいファイル名を設定
      // 例: "example.csv" → "example_bitwarden.csv"
      //正規表現　最初に見つけたドットからドットと/を含まない文字列を最後まで空にする
      setFileName(file.name.replace(/\.[^/.]+$/, "") + "_bitwarden.csv");
    } catch (err) {
      setError(err instanceof Error ? err.message : "変換に失敗しました");
      setConvertedCsv(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 変換した値をリセットする関数
  const resetConverter = () => {
    setConvertedCsv(null);
    setError(null);
    setRecordCount(0);
    setFileName("bitwarden_import.csv");
    // ファイルinputの値もリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // スタイル定義
  const baseTextStyle =
    "font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 animate-pulse whitespace-nowrap";
  // スマホサイズのスタイル
  const miniSizeStyle = `${baseTextStyle} text-base block sm:hidden mb-4`;
  // PCサイズのスタイル
  const pcSizeStyle = `${baseTextStyle} sm:text-3xl hidden sm:block mb-2`;

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-gray-900 rounded-lg shadow-2xl border border-green-500/30 p-4 sm:p-8 backdrop-blur-sm">
          {/* タイトルセクション */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col items-center w-full">
              <span className={`${miniSizeStyle}`}>
                ╔══════════════════════════════════╗
              </span>

              <span className={pcSizeStyle}>
                ╔══════════════════════════════════════╗
              </span>

              <h1 className="sm:text-3xl font-bold text-green-400 mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] text-center flex items-center gap-2">
                <span>
                  <Image
                    src={`${BASE_PATH}/logo.png`}
                    width={500}
                    height={500}
                    alt="ロゴ"
                    className="w-5 h-5 sm:w-12 sm:h-12 mr-2 inline-block"
                  />
                </span>
                &gt; AUTHENTICATOR_CONVERTER
              </h1>
              <span className={miniSizeStyle}>
                ╚══════════════════════════════════╝
              </span>
              <span className={pcSizeStyle}>
                ╚══════════════════════════════════════╝
              </span>
            </div>
            <p className="text-cyan-300 text-base sm:text-lg">
              [!] Microsoft Authenticator → Bitwarden 変換システム
            </p>
            <p className="text-gray-400 mt-2 text-xs sm:text-base">
              &gt; CSVファイルをBitwardenインポート形式に変換します
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* ファイル選択 */}
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <label
                htmlFor="csv-file-input"
                className="block text-sm font-medium text-cyan-300 mb-3"
              >
                &gt; CSVファイルを選択
              </label>
              <input
                id="csv-file-input"
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isLoading}
                className="block w-full text-sm text-green-400 
                file:mr-4 file:py-2 sm:file:py-3 file:px-4 sm:file:px-6 file:rounded-md
                file:text-sm file:font-semibold file:bg-green-500/10 
                file:text-green-400 file:border-0 file:border-green-500/50
                hover:file:bg-green-500/20 hover:file:shadow-[0_0_10px_rgba(34,197,94,0.5)]
                disabled:opacity-50 file:transition-all file:duration-300
                bg-gray-900 border border-gray-700 rounded-md p-2 sm:p-3"
              />

              <div className="flex gap-2">
                <p className="text-xs text-gray-500 mt-2">[必須形式]</p>
                <p className="text-xs text-gray-500 mt-2">
                  url,username,password <br />
                  https://example.com,user1,pass1
                </p>
              </div>
            </div>

            {/* ローディング */}
            {isLoading && (
              <div className="flex items-center space-x-2 sm:space-x-3 text-cyan-400 bg-gray-800 rounded-lg p-3 sm:p-4 border border-cyan-500/20">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-cyan-400"></div>
                <span className="text-xs sm:text-sm animate-pulse">
                  [処理中] データを変換しています...
                </span>
              </div>
            )}

            {/* エラー時 */}
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3 sm:p-4 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <p className="text-xs sm:text-sm text-red-300">
                  [エラー] {error}
                </p>
              </div>
            )}

            {/* 成功時 */}
            {convertedCsv && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-green-900/50 border border-green-500/50 rounded-lg p-3 sm:p-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <p className="text-xs sm:text-sm text-green-300">
                    [success] 変換成功: {recordCount}件のレコードを処理しました
                  </p>
                </div>

                {/* ボタン */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <DownloadConvertedCsv
                    csvData={convertedCsv}
                    fileName={fileName}
                  />
                  <button
                    onClick={resetConverter}
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md 
                 hover:from-red-500 hover:to-red-400 text-xs sm:text-sm font-bold
                 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]
                 transition-all duration-300 transform hover:scale-105"
                  >
                    &gt; リセット
                  </button>
                </div>
                {/* プレビューを表示 */}
                <PreviewOfConverted convertedCsv={convertedCsv} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
