import { useState, useEffect } from "react";

interface HistoryItem {
  expression: string;
  result: string;
}

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [resetDisplay, setResetDisplay] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<string[]>([]);

  useEffect(() => {
    const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    setNumbers(nums);
  }, []);

  const handleNumber = (value: string) => {
    if (resetDisplay) {
      setDisplay(value);
      setResetDisplay(false);
    } else {
      setDisplay((prev) => (prev === "0" ? value : prev + value));
    }
  };

  const handleOperator = (operator: string) => {
    setDisplay((prev) => prev + " " + operator + " ");
    setResetDisplay(false);
  };

  const handleClear = () => {
    setDisplay("0");
    setResetDisplay(false);
  };

  const handleEquals = () => {
    try {
      const result = eval(display.replace(/×/g, "*").replace(/÷/g, "/"));
      const resultString = String(result);

      setHistory((prev) => [
        { expression: display, result: resultString },
        ...prev,
      ]);

      setDisplay(resultString);
      setResetDisplay(true);
    } catch {
      setDisplay("Error");
      setResetDisplay(true);
    }
  };

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center bg-gray-100">
      <div className="flex rounded-xl bg-white shadow-lg">
        {/* Calculator */}
        <div className="w-64 p-4">
          <div className="mb-4 rounded bg-black p-3 text-right text-xl font-mono">
            {display}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handleClear}
              className="col-span-2 rounded bg-red-400 p-2 text-white"
            >
              C
            </button>
            <button
              onClick={() => handleOperator("÷")}
              className="rounded bg-gray-300 p-2"
            >
              ÷
            </button>
            <button
              onClick={() => handleOperator("×")}
              className="rounded bg-gray-300 p-2"
            >
              ×
            </button>

            {numbers.slice(0, 3).map((n) => (
              <button
                key={n}
                onClick={() => handleNumber(n)}
                className="rounded bg-gray-100 p-2"
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => handleOperator("-")}
              className="rounded bg-gray-300 p-2"
            >
              -
            </button>

            {numbers.slice(3, 6).map((n) => (
              <button
                key={n}
                onClick={() => handleNumber(n)}
                className="rounded bg-gray-100 p-2"
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => handleOperator("+")}
              className="rounded bg-gray-300 p-2"
            >
              +
            </button>

            {numbers.slice(6, 9).map((n) => (
              <button
                key={n}
                onClick={() => handleNumber(n)}
                className="rounded bg-gray-100 p-2"
              >
                {n}
              </button>
            ))}
            <button
              onClick={handleEquals}
              className="row-span-2 rounded bg-blue-500 p-2 text-white"
            >
              =
            </button>

            <button
              onClick={() => handleNumber(numbers[9])}
              className="col-span-2 rounded bg-gray-100 p-2"
            >
              {numbers[9]}
            </button>
            <button
              onClick={() => handleNumber(".")}
              className="rounded bg-gray-100 p-2"
            >
              .
            </button>
          </div>
        </div>

        {/* History Panel */}
        <div className="w-64 border-l bg-gray-50 p-3">
          <h2 className="mb-2 text-sm font-semibold text-gray-600">History</h2>
          <div className="space-y-2 overflow-y-auto max-h-96 text-sm">
            {history.length === 0 && (
              <p className="text-gray-400">No calculations yet</p>
            )}
            {history.map((item, index) => (
              <div key={index} className="rounded bg-white p-2 shadow-sm">
                <div className="text-gray-500 text-right">
                  {item.expression}{" "}
                </div>
                <div className="text-black text-2xl text-right text-font-bold">
                  {item.result}{" "}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
