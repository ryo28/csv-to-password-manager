import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <h1 className="text-2xl font-bold text-green-400 mb-6">
        プライバシーポリシー
      </h1>
      <p className="mb-4">
        当ツールでは、個人情報（氏名、メールアドレス、パスワード等）を収集、保存することは一切ありません。
      </p>
      <p className="mb-4">
        ユーザーがアップロードまたは貼り付けたCSVデータや変換結果は、すべてお使いの端末上（ブラウザ）で処理され、サーバーに送信・保存されることはありません。
      </p>
      <p className="mb-4">
        また、Google Analyticsなどのアクセス解析ツールも使用していません。
      </p>
      <p>
        ご不明な点がありましたら
        <Link
          href={"https://x.com/w_a59"}
          className="text-blue-500 hover:underline"
        >
          @w_a59
        </Link>
        までDMください。
      </p>
    </div>
  );
}
