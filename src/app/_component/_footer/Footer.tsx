import Link from "next/link";

export function Footer() {
  return (
    <footer className="h-16 w-full border-t border-slate-600 text-xs text-slate-300">
      <div className="text-center mt-8 text-gray-600 pb-5">
        <div className="flex items-center mt-4 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-gray-500 text-xs">|</span>
          </div>
          <div className="w-1/2 text-right pr-4">
            <Link
              href="/disclaimer"
              className="text-xs text-gray-500 hover:text-green-400 transition-colors"
            >
              免責事項
            </Link>
          </div>
          <div className="w-1/2 text-left pl-4">
            <Link
              href="/privacy-policy"
              className="text-xs text-gray-500 hover:text-green-400 transition-colors"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          &copy; {new Date().getFullYear()} AUTHENTICATOR_CONVERTER Contact:
          <Link
            href={"https://x.com/w_a59"}
            className="text-blue-500 hover:underline"
          >
            @w_a59
          </Link>
        </p>
      </div>
    </footer>
  );
}
