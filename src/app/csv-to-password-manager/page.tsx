"use client";

import React, { useState } from "react";
import Papa from "papaparse";

type AuthenticatorRecord = {
  url: string;
  username: string;
  password: string;
};

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
  // CSVファイルの選択ハンドラー
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //選択した最初のファイルをfile変数に格納
    const file = e.target.files?.[0];
    //ファイルが選択されていない場合は何もしない
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // ファイルをテキストとして読み込む
      const csvText = await file.text();
      // CSVをBitwarden形式に変換
      const result = convertToBitwardenCSV(csvText);
      setConvertedCsv(result.csv);
      setRecordCount(result.count);
      setFileName(file.name.replace(/\.[^/.]+$/, "") + "_bitwarden.csv");
    } catch (err) {
      setError(err instanceof Error ? err.message : "変換に失敗しました");
      setConvertedCsv(null);
    } finally {
      setIsLoading(false);
    }
  };
  // CSVをBitwarden形式に変換する関数
  // 入力はCSV形式の文字列で、出力は変換後のCSV文字列と変換されたレコード数
  const convertToBitwardenCSV = (
    input: string
  ): { csv: string; count: number } => {
    // 入力が空の場合はエラーを投げる
    if (!input.trim()) {
      throw new Error("CSVファイルが空です");
    }

    const parsed = Papa.parse(input, {
      header: true,
      // ヘッダー行を含む
      skipEmptyLines: true,
      // 動的型付けを無効にする
      dynamicTyping: false,
      // ヘッダーの変換 ヘッダーを小文字に変換し、前後の空白を削除
      transformHeader: (header) => header.trim().toLowerCase(),
    });
    // 解析結果のエラーをチェック
    if (parsed.errors.length > 0) {
      throw new Error(`CSVの解析エラー: ${parsed.errors[0].message}`);
    }
    // 解析結果からデータを取得
    const authenticatorRecord = parsed.data as AuthenticatorRecord[];

    // データが空の場合はエラーを投げる
    if (!authenticatorRecord || authenticatorRecord.length === 0) {
      throw new Error("有効なデータが見つかりません");
    }

    // 必要なフィールドの検証
    // url, username, password が存在するか確認
    const requiredFields: (keyof AuthenticatorRecord)[] = [
      "url",
      "username",
      "password",
    ];
    const firstRow = authenticatorRecord[0];
    // filedには1つずつフィールド名が入る
    // filed = "url" のように
    // ループで回して、firstRowにそのフィールドが存在するか確認
    for (const field of requiredFields) {
      if (!(field in firstRow) || firstRow[field] === undefined) {
        throw new Error(
          `必須フィールド '${field}' が見つかりません。期待されるヘッダー: url,username,password`
        );
      }
    }

    // Bitwardenの形式に変換
    const bitwardenHeaders = [
      "folder",
      "favorite",
      "type",
      "name",
      "notes",
      "fields",
      "reprompt",
      "login_uri",
      "login_username",
      "login_password",
      "login_totp",
    ];

    const dataRows = authenticatorRecord
      // フィルタリングして、url:https: //example.com, username: user, password: pass のようなレコードのみを抽出
      .filter((record) => record.url || record.username || record.password)
      .map((record) => {
        const name = extractDomain(record.url || "Unknown");
        return [
          "",
          "",
          "login",
          name,
          "",
          "",
          "",
          record.url || "",
          record.username || "",
          record.password || "",
          "",
        ];
      });

    const csvRows = [bitwardenHeaders, ...dataRows];

    const csvOutput = Papa.unparse(csvRows, {
      quotes: false,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ",",
      header: false,
      newline: "\n",
    });

    return {
      csv: csvOutput,
      count: csvRows.length - 1,
    };
  };

  const extractDomain = (url: string): string => {
    if (!url) return "Unknown";

    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return urlObj.hostname.replace(/^www\./, "");
    } catch {
      return url.replace(/^www\./, "");
    }
  };

  const downloadConvertedCsv = () => {
    if (!convertedCsv) return;

    const blob = new Blob([convertedCsv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetConverter = () => {
    setConvertedCsv(null);
    setError(null);
    setRecordCount(0);
    setFileName("bitwarden_import.csv");
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Microsoft Authenticator → Bitwarden変換
        </h1>
        <p className="text-gray-600 mb-6">
          Microsoft
          AuthenticatorのCSVファイルをBitwardenにインポート可能な形式に変換します
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CSVファイルを選択
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isLoading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              期待される形式: url,username,password
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">変換中...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {convertedCsv && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-700">
                  変換完了: {recordCount}件のレコードが変換されました
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={downloadConvertedCsv}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  CSVをダウンロード
                </button>
                <button
                  onClick={resetConverter}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm font-medium"
                >
                  リセット
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  プレビュー
                </h3>
                <div className="bg-gray-50 rounded-md p-3 max-h-96 overflow-auto">
                  <div className="text-xs text-gray-800 font-mono">
                    {convertedCsv.split("\n").map((line, index) => (
                      <div
                        key={index}
                        className="py-1 border-b border-gray-200 last:border-b-0"
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  全{convertedCsv.split("\n").length}行を表示
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
