export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <h1 className="text-2xl font-bold text-green-400 mb-6">免責事項</h1>
      <p className="mb-4">
        当ツールは、AuthenticatorなどのCSV形式のパスワードデータをBitwardenのインポート形式に変換するための無料の非公式ツールです。
      </p>
      <p className="mb-4">
        変換結果の正確性、安全性については可能な限り注意を払っていますが、その完全性、有効性を保証するものではありません。
      </p>
      <p className="mb-4">
        本ツールの使用により発生したいかなる損害（データの損失、漏洩、セキュリティ上の問題等）について、当方は一切の責任を負いません。
      </p>
      <p className="mb-4">
        変換処理はすべてお使いのブラウザ上（ローカル環境）で行われ、パスワード等の情報は外部サーバーには一切送信されません。
      </p>
    </div>
  );
}
