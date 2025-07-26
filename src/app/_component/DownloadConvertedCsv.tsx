"use client";
import { useRef } from "react";

export function DownloadConvertedCsv({
  csvData,
  fileName,
}: {
  csvData: string;
  fileName: string;
}) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const handleDownload = () => {
    //インスタンス化されたBlobを作成してCSVデータを格納
    const blob = new Blob([csvData], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    //ダウンロードリンクを自動で実行
    if (anchorRef.current) {
      anchorRef.current.href = url;
      anchorRef.current.download = fileName;
      anchorRef.current.click();
    }
    // URLを解放
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="bg-gradient-to-r from-green-600 to-green-500 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:from-green-500 hover:to-green-400 text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)]
transition-all duration-300 transform hover:scale-105"
      >
        &gt; ダウンロード
      </button>
      {/* 非表示の a タグ */}
      <a ref={anchorRef} style={{ display: "none" }} />
    </>
  );
}
