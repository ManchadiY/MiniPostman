import { useState, useRef } from "react";
import { BsPlus } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { VscListFilter } from "react-icons/vsc";
import { CgChevronDown } from "react-icons/cg";
import { IoSaveOutline } from "react-icons/io5";

const apiData = [
  { method: "post", api: "https://dev.workved.com/brandOverview/lg" },
  { method: "get", api: "https://dev.workved.com/brandOverview/lg" },
  { method: "del", api: "https://dev.workved.com/brandOverview/lg" },
];

const methodStyles = {
  get: "text-[#027F31]",
  post: "text-[#AC7A04]",
  put: "text-[#0A58BA]",
  del: "text-[#973027]",
};

const methods = ["get", "put", "del", "post"];

export default function MiniPostman() {
  const [method, setMethod] = useState("get");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([
    { key: "Content-Type", value: "application/json", enabled: true },
  ]);
  const [body, setBody] = useState(`{
  "name": "Add your name in the body"
}`);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);
  const responseRef = useRef(null);

  const handleSend = async () => {
    try {
      setLoading(true);
      setResponse(null);

      const headerObj = {};
      headers.forEach((h) => {
        if (h.enabled && h.key) headerObj[h.key] = h.value;
      });

      const res = await fetch(url, {
        method: method.toUpperCase(),
        headers: headerObj,
        body: method !== "get" ? body : undefined,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      setResponse(data);
      const hdrs = {};
      res.headers.forEach((v, k) => (hdrs[k] = v));
      setResponseHeaders(hdrs);

      setTimeout(
        () => responseRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container h-screen flex flex-col ">
      <div className="flex justify-end">
        <img src="" alt="" className="h-12 w-12 rounded-full bg-gray-400" />
      </div>

      <div className="flex flex-1 gap-5 border border-t border-[#ccc]">
        <Sidebar />

        <div className="flex-1">
          <div className="h-10 py-2 border-b">
            <ul className="flex gap-1">
              {apiData.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 border-r pr-2"
                >
                  <span
                    className={`px-3 py-1 text-sm font-semibold uppercase rounded-md ${
                      methodStyles[item.method]
                    }`}
                  >
                    {item.method}
                  </span>
                  <span className="text-sm break-all">
                    {item.api.slice(0, 20)}...
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="my-3 flex justify-between">
            <button className="flex items-center text-[#BDC1CA] text-sm border border-[#BDC1CA] px-3 py-1.5">
              <IoSaveOutline /> save
            </button>
          </div>

          <div className="space-y-3">
            <APIInput
              selectedMethod={method}
              setSelectedMethod={setMethod}
              url={url}
              setUrl={setUrl}
              onSend={handleSend}
              loading={loading}
            />
            <HeadersAndBody
              headers={headers}
              setHeaders={setHeaders}
              body={body}
              setBody={setBody}
            />
            <div ref={responseRef}>
              <APIResponse
                loading={loading}
                response={response}
                responseHeaders={responseHeaders}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="max-w-sm w-full">
      <div className="h-10 py-2 w-full flex justify-between border-b">
        <div className="flex gap-2">
          <FiUser size={25} />
          <h4 className="capitalize text-lg font-semibold">my workspace</h4>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#EAEAEA] text-sm px-3 py-2">new</button>
          <button className="bg-[#EAEAEA] text-sm px-3 py-2">import</button>
        </div>
      </div>
      <div className="flex items-center gap-5 my-3">
        <BsPlus size={25} color="#6B6B6B" />
        <div className="border flex-1 px-2 py-0.5">
          <VscListFilter size={23} color="#6B6B6B" />
        </div>
        <PiDotsThreeOutlineLight color="#6B6B6B" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setIsOpen(!isOpen)}>
            <CgChevronDown />
          </button>
          REST API basics
        </div>
        {isOpen && (
          <ul>
            {apiData.map((item, index) => (
              <li key={index} className="flex gap-3 border-b mb-1">
                <span
                  className={`px-3 py-1 text-sm font-semibold uppercase rounded-md ${
                    methodStyles[item.method]
                  }`}
                >
                  {item.method}
                </span>
                <span className="text-sm break-all">
                  {item.api.slice(0, 40)}...
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function APIInput({
  selectedMethod,
  setSelectedMethod,
  url,
  setUrl,
  onSend,
  loading,
}) {
  return (
    <div className="flex gap-5">
      <div className="flex-1 border rounded flex p-2">
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="uppercase focus:outline-none text-sm"
        >
          {methods.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com"
          className="flex-1 focus:outline-none ml-2"
        />
      </div>
      <button
        onClick={onSend}
        disabled={loading}
        className="bg-[#077BED] text-white py-3 px-5 rounded-sm"
      >
        {loading ? "sending..." : "send"}
      </button>
    </div>
  );
}

function HeadersAndBody({ headers, setHeaders, body, setBody }) {
  const [activeTab, setActiveTab] = useState("headers");
  return (
    <div>
      <ul className="flex gap-7 border-b mb-4">
        {["headers", "body"].map((t) => (
          <li
            key={t}
            onClick={() => setActiveTab(t)}
            className="cursor-pointer pb-2"
          >
            {t}
          </li>
        ))}
      </ul>

      {activeTab === "headers" && (
        <>
          <button
            onClick={() =>
              setHeaders([...headers, { key: "", value: "", enabled: true }])
            }
            className="mb-2 text-sm text-blue-600"
          >
            + Add Header
          </button>
          <table className="w-full text-sm">
            <tbody>
              {headers.map((h, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="checkbox"
                      checked={h.enabled}
                      onChange={(e) => {
                        const c = [...headers];
                        c[i].enabled = e.target.checked;
                        setHeaders(c);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      value={h.key}
                      onChange={(e) => {
                        const c = [...headers];
                        c[i].key = e.target.value;
                        setHeaders(c);
                      }}
                      className="w-full"
                    />
                  </td>
                  <td>
                    <input
                      value={h.value}
                      onChange={(e) => {
                        const c = [...headers];
                        c[i].value = e.target.value;
                        setHeaders(c);
                      }}
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "body" && (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full min-h-36 p-4 font-mono"
        />
      )}
    </div>
  );
}

function APIResponse({ loading, response, responseHeaders }) {
  if (loading) return <p className="text-blue-600 p-4">Loading response...</p>;

  if (!response)
    return (
      <div className="border p-3 font-mono text-sm text-gray-400">
        Response will appear here after sending request.
      </div>
    );

  return (
    <div className="border p-3 font-mono text-sm">
      <pre>{JSON.stringify(response, null, 2)}</pre>
      {responseHeaders && <pre>{JSON.stringify(responseHeaders, null, 2)}</pre>}
    </div>
  );
}
