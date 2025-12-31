import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ImportModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const [text, setText] = useState();
  const [error, setError] = useState("");

  function parseCurlToJson(curlText) {
    if (!curlText.trim().toLowerCase().startsWith("curl")) return null;

    // Normalize: remove line-continuation slashes but keep newlines for body
    const normalized = curlText.replace(/\\\n/g, "\n");

    const result = {
      id: 1,
      name: "Create Request",
      method: "get",
      url: "",
      headers: [],
      body: "",
    };

    /* ---------------- URL (MOST IMPORTANT FIX) ---------------- */
    const urlMatch = normalized.match(/https?:\/\/[^\s'"]+/i);

    if (urlMatch) {
      result.url = urlMatch[0];
    }

    /* ---------------- METHOD ---------------- */
    const methodMatch =
      normalized.match(/--request\s+(\w+)/i) || normalized.match(/-X\s+(\w+)/i);

    if (methodMatch) {
      result.method = methodMatch[1].toLowerCase();
    } else if (/--data|-d|--data-raw/.test(normalized)) {
      result.method = "post";
    }

    /* ---------------- HEADERS ---------------- */
    const headerRegex = /--header\s+['"]([^:]+):\s*([\s\S]*?)['"]/gi;
    let headerMatch;

    while ((headerMatch = headerRegex.exec(normalized)) !== null) {
      const key = headerMatch[1].trim();
      const value = headerMatch[2].trim();

      result.headers.push({
        key,
        value,
        enabled: !key.toLowerCase().includes("authorization"),
      });
    }

    /* ---------------- BODY (MULTILINE SAFE) ---------------- */
    const bodyMatch =
      normalized.match(/--data-raw\s+['"]([\s\S]*)$/i) ||
      normalized.match(/-d\s+['"]([\s\S]*)$/i);

    if (bodyMatch) {
      result.body = bodyMatch[1].trim();
    }

    console.log("result", result);

    return [result];
  }

  function parseJsonArrayToRequests(jsonText) {
    let parsed;
    console.log("json file", jsonText);

    // 1️⃣ Validate JSON
    try {
      parsed = JSON.parse(jsonText);
      console.log("parsed", parsed);
    } catch (err) {
      toast.error("not a json file");
      return {
        valid: false,
        error: "Invalid JSON format",
      };
    }

    // 2️⃣ Normalize to array
    const requests = Array.isArray(parsed) ? parsed : [parsed];

    const formattedRequests = [];
    const errors = [];

    // 3️⃣ Process each object
    requests.forEach((req, index) => {
      if (!req.url || !req.method) {
        errors.push({
          index,
          error: "Missing required fields: url or method",
        });
        return;
      }

      // Headers → array
      const headers = [];
      if (req.headers && typeof req.headers === "object") {
        for (const key in req.headers) {
          headers.push({
            key,
            value: String(req.headers[key]),
            enabled: !key.toLowerCase().includes("authorization"),
          });
        }
      }

      // Body → string
      let body = "";
      if (req.body) {
        body =
          typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body, null, 2);
      }

      formattedRequests.push({
        id: Date.now() + index,
        name: req.name || `Imported Request ${index + 1}`,
        method: req.method.toLowerCase(),
        url: req.url,
        headers,
        body,
      });
    });

    return {
      valid: formattedRequests.length > 0,
      data: formattedRequests,
      errors,
    };
  }

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Validate JSON file
  const validateFile = (file) => {
    if (!file) return false;

    if (
      file.type !== "application/json" &&
      !file.name.toLowerCase().endsWith(".json")
    ) {
      setError("Only JSON files are allowed");
      return false;
    }

    setError("");
    return true;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      console.log("Valid JSON file:", file);
      // handle upload / parse here
    }
  };

  // Drag handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      console.log("Dropped JSON file:", file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        className="relative w-[90%] max-w-3xl rounded-xl bg-white p-6 shadow-lg"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste cURL"
          className="w-full rounded-md border border-blue-500 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Drop Area */}
        <div
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="mt-6 flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-blue-500"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            ⬇️
          </div>

          <p className="text-lg font-semibold text-gray-700">
            Drop JSON file here
          </p>

          <p className="mt-1 text-sm text-gray-500">
            or click to{" "}
            <span className="text-blue-600 hover:underline">
              browse JSON files
            </span>
          </p>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
        <div className="flex justify-around items-center">
          <button onClick={() => parseCurlToJson(text)}>check</button>
          <button onClick={() => parseJsonArrayToRequests(text)}>
            json file
          </button>
        </div>
      </div>
    </div>
  );
}
