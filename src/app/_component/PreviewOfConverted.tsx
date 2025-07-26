export function PreviewOfConverted({ convertedCsv }: { convertedCsv: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-green-500/20">
      <h3 className="text-base sm:text-lg font-bold text-cyan-300 mb-3 sm:mb-4">
        &gt; データプレビュー
      </h3>
      <div className="bg-black rounded-md p-3 sm:p-4 max-h-64 sm:max-h-96 overflow-auto border border-green-500/30 shadow-inner">
        {/* 変換されたCSVデータを行ごとに表示 */}
        {/* 各行は行番号とともに表示 */}
        <div className="text-xs text-green-400 font-mono leading-relaxed">
          {convertedCsv.split("\n").map((line, index) => (
            <div
              key={index}
              className="py-1 border-b border-green-500/10 last:border-b-0 hover:bg-green-500/5 transition-colors flex"
            >
              <span className="text-gray-500 mr-2 sm:mr-3 flex-shrink-0">
                {String(index + 1).padStart(3, "0")}:
              </span>
              <span className="text-green-400 whitespace-nowrap">{line}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 sm:mt-3">
        {/* 改行ごとに配列に格納してデータの数を表示 */}
        [INFO] 全{convertedCsv.split("\n").length}行のデータを表示中
      </p>
    </div>
  );
}
