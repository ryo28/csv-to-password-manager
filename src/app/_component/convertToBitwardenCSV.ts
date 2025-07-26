import Papa from "papaparse";

type AuthenticatorRecord = {
  url: string;
  username: string;
  password: string;
};
// CSVをBitwarden形式に変換する関数
// 入力はCSV形式の文字列で、出力は変換後のCSV文字列と変換されたレコード数
export const convertToBitwardenCSV = (
  input: string, // CSV形式の文字列 csvText
): { csv: string; count: number } => {
  // 入力が空の場合はエラーを投げる
  if (!input.trim()) {
    throw new Error("CSVファイルが空です");
  }
  // Papa.parseを使ってCSVをjsのオブジェクトに変換
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
    const errorMessages = {
      TooManyFields: "列の数が多すぎます。想定より多くのカラムがあります。",
      TooFewFields: "列の数が不足しています。想定よりカラムが足りません。",
      UndetectableDelimiter: "区切り文字を判別できませんでした。",
      MissingQuotes: "引用符の対応関係が正しくありません。",
      InvalidQuotes: "不正な引用符の使用があります。",
      FieldMismatch: "フィールドの形式に不一致があります。",
    };
    const errorCode = parsed.errors[0].code;
    throw new Error(
      `CSVの解析エラー: ${errorMessages[errorCode] || "不明なエラー"}`,
    );
  }
  // 解析結果からデータを取得
  const authenticatorRecord = parsed.data as AuthenticatorRecord[];
  //authenticatorRecordは、CSVの各行を表すオブジェクトの配列
  //例
  // const records = [
  //   { url: "https: //a.com", username: "aaa", password: "123" },
  //   { url: "", username: "", password: "" },
  //   { url: "https: //b.com", username: "", password: "456" },
  // ];

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
  // 最初のレコードを取得　firstRowは最前列という意味
  const firstRow = authenticatorRecord[0];
  // filedには1つずつフィールド名が入る
  // filed = "url" のように
  // ループで回して、firstRowにそのフィールドが存在するか確認
  for (const field of requiredFields) {
    if (!(field in firstRow) || firstRow[field] === undefined) {
      throw new Error(
        `必須フィールド '${field}' が見つかりません。期待されるヘッダー: url,username,password`,
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

  const extractDomain = (url: string): string => {
    if (!url) return "Unknown";

    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return urlObj.hostname.replace(/^www\./, "");
    } catch {
      return url.replace(/^www\./, "");
    }
  };
  //authenticatorRecordは全ての行を表す配列で、各行はurl, username, passwordのプロパティを持つオブジェクト
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
  // csvRowsは、Bitwardenのインポート形式に変換されたデータの配列
  // 例:
  // const csvRows = [
  //   ["folder", "favorite", "type", "name", "notes", "fields", "reprompt", "login_uri", "login_username", "login_password", "login_totp"],
  //   ["", "", "login", "a.com", "", "", "", "https://a.com", "aaa", "123", ""],
  // ];

  // Papa.unparseを使ってjsをCSV形式の文字列に変換
  const csvOutput = Papa.unparse(csvRows, {
    quotes: false, //	全体にダブルクオートで囲わない。必要な時だけ囲む（例：カンマが含まれるなど）。
    quoteChar: '"', // 	クオートに使う文字。デフォルトは "（ダブルクオート）
    escapeChar: '"', //クオートの中に " が出てきたときのエスケープ文字（CSVでは "" にして表す）
    delimiter: ",", //区切り文字。通常はカンマ（,）
    header: false, //	ヘッダー行を出力しない。配列の1行目も普通のデータ行として扱う
    newline: "\n", //改行コード。\n（Unix系）または \r\n（Windows）が選べる
  });

  return {
    csv: csvOutput,
    count: csvRows.length - 1,
  };
};
