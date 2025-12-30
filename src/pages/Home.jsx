import React, { useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { VscListFilter } from "react-icons/vsc";
import { CgChevronDown } from "react-icons/cg";
import { IoSaveOutline } from "react-icons/io5";

// GET https://jsonplaceholder.typicode.com/posts
// POST https://jsonplaceholder.typicode.com/posts

const apiData = [
  {
    method: "post",
    api: "https://dev.workved.com/brandOverview/lg",
  },
  {
    method: "get",
    api: "https://dev.workved.com/brandOverview/lg",
  },
  {
    method: "del",
    api: "https://dev.workved.com/brandOverview/lg",
  },
  {
    method: "put",
    api: "https://dev.workved.com/brandOverview/lg",
  },
  {
    method: "post",
    api: "https://dev.workved.com/brandOverview/lg",
  },
];
const methodStyles = {
  get: "text-[#027F31]",
  post: "text-[#AC7A04]",
  put: "text-[#0A58BA]",
  del: "text-[#973027]",
};
const methods = ["get", "put", "del", "post"];

function Home() {
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
  // const [requests, setRequests] = useState([
  //   {
  //     method: "get",
  //     url: "",
  //     headers: [
  //       { key: "Content-Type", value: "application/json", enabled: true },
  //     ],
  //     body: `{"name": "Add your name in the body"}`,
  //     response: null,
  //     responseHeaders: null,
  //     loading: false,
  //   },
  // ]);
  // const [activeIndex, setActiveIndex] = useState(0); // default first request is active

  // const handleSend = async (index) => {
  //   const newRequests = [...requests];
  //   const req = newRequests[index];
  //   req.loading = true;
  //   req.response = null;
  //   setRequests(newRequests);

  //   try {
  //     const headerObj = {};
  //     req.headers.forEach((h) => {
  //       if (h.enabled && h.key) headerObj[h.key] = h.value;
  //     });

  //     const res = await fetch(req.url, {
  //       method: req.method.toUpperCase(),
  //       headers: headerObj,
  //       body: req.method.toLowerCase() === "get" ? undefined : req.body,
  //     });

  //     const text = await res.text();
  //     let data;
  //     try {
  //       data = JSON.parse(text);
  //       console.log(data);
  //     } catch {
  //       data = text;
  //     }

  //     const hdrs = {};
  //     res.headers.forEach((v, k) => (hdrs[k] = v));

  //     updateRequest(index, { response: data, responseHeaders: hdrs });
  //   } catch (err) {
  //     updateRequest(index, { response: { error: err.message } });
  //   } finally {
  //     updateRequest(index, { loading: false });
  //   }
  // };

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

  // function updateRequest(index, updatedFields) {
  //   const newRequests = [...requests];
  //   newRequests[index] = { ...newRequests[index], ...updatedFields };
  //   console.log(newRequests[index]);

  //   setRequests(newRequests);
  // }
  // const activeRequest = requests[activeIndex];
  return (
    <div className="container h-screen flex flex-col">
      {/* <div className="flex justify-end">
        <img src="" alt="" className="h-12 w-12 rounded-full bg-gray-400" />
      </div> */}
      <div className="flex flex-1 gap-5">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <div className="h-14 py-2 border-b">
            {/* <ul className="flex gap-1">
              {apiData.slice(0, 3).map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 border-r mb-1 pr-2"
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
            </ul> */}
            {/* <div className="flex items-center gap-2 my-2">
              {requests.map((req, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 border rounded text-sm ${
                    activeIndex === index && "bg-gray-400"
                  } `}
                  onClick={() => setActiveIndex(index)}
                >
                  Request {index + 1}
                </button>
              ))}

              <button
                className="px-3 py-1 border rounded text-sm text-blue-600"
                onClick={() =>
                  setRequests([
                    ...requests,
                    {
                      method: "get",
                      url: "",
                      headers: [
                        {
                          key: "Content-Type",
                          value: "application/json",
                          enabled: true,
                        },
                      ],
                      body: `{"name": "Add your name in the body"}`,
                      response: null,
                      responseHeaders: null,
                      loading: false,
                    },
                  ])
                }
              >
                + Add Request
              </button>
            </div> */}
          </div>
          <div className="my-3 flex justify-between">
            {/* <p className="text-[#BDC1CA] text-sm">
              REST API basics:CRUD,test & variable /{" "}
              <span className="font-medium text-[#171A1F]">Post data</span>
            </p> */}
            <button className="cursor-pointer flex items-center text-[#BDC1CA] text-sm border border-[#BDC1CA] px-3 py-1.5">
              <IoSaveOutline />
              save
            </button>
          </div>
          {/* <div className="space-y-3">
            <APIInput
              selectedMethod={activeRequest.method}
              setSelectedMethod={(method) =>
                updateRequest(activeIndex, { method })
              }
              url={activeRequest.url}
              setUrl={(url) => updateRequest(activeIndex, { url })}
              onSend={() => handleSend(activeIndex)}
              loading={activeRequest.loading}
            />

            <HeadersAndBody
              headers={activeRequest.headers}
              setHeaders={(headers) => updateRequest(activeIndex, { headers })}
              body={activeRequest.body}
              setBody={(body) => updateRequest(activeIndex, { body })}
            />

            <APIResponse
              loading={activeRequest.loading}
              response={activeRequest.response}
              responseHeaders={activeRequest.responseHeaders}
            />
          </div> */}
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
            <APIResponse
              loading={loading}
              response={response}
              responseHeaders={responseHeaders}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="max-w-sm lg:max-w-none lg:w-[320px] w-full">
      <div className="h-10 py-2 w-full flex justify-between border-b">
        <div className="flex gap-2">
          <FiUser size={25} />
          <h4 className="capitalize text-lg font-semibold">my workspace</h4>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#EAEAEA] text-sm px-3 flex items-center py-2 capitalize font-medium hover:bg-gray-300">
            new
          </button>
          <button className="bg-[#EAEAEA] text-sm px-3 flex items-center py-2 capitalize font-medium hover:bg-gray-300">
            import
          </button>
        </div>
      </div>
      <div className="flex items-center gap-5 my-3">
        <BsPlus size={25} color="#6B6B6B" />
        <div className="border border-[#EDEDED] flex-1 px-2 py-0.5">
          <VscListFilter size={23} color="#6B6B6B" />
        </div>
        <PiDotsThreeOutlineLight color="#6B6B6B" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <CgChevronDown />
          </button>
          REST API basics:CRUD,test & variable
        </div>
        {isOpen && (
          <ul>
            {apiData.map((item, index) => (
              <li key={index} className="flex items-center gap-3 border-b mb-1">
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
      <div className="flex-1 border border-[#A6A6A6] rounded flex p-2">
        <select
          name="method"
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className={`uppercase focus:outline-none text-sm ${methodStyles[selectedMethod]}`}
        >
          {methods.map((method) => (
            <option key={method} className={`${methodStyles[method]}`}>
              {method}
            </option>
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
        className="bg-[#077BED] hover:bg-[#3f9af5] text-[#FFFFFF] font-medium capitalize py-3 px-5 rounded-sm"
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
            className={`text-sm capitalize cursor-pointer pb-2 ${
              activeTab === "headers" &&
              t === "headers" &&
              "text-black border-b-2 border-black font-medium "
            } ${
              activeTab === "body" &&
              t === "body" &&
              "text-black border-b-2 border-black font-medium "
            } `}
          >
            {t}
          </li>
        ))}
        {/* <li onClick={() => setActiveTab("headers")}>headers</li> */}
        {/* <li
          onClick={() => setActiveTab("body")}
          className={`text-sm capitalize cursor-pointer pb-2 ${
            activeTab === "body"
              ? "text-black border-b-2 border-black font-medium"
              : "text-[#9095A1]"
          }`}
        >
          body
        </li> */}
      </ul>

      {activeTab === "headers" && (
        <>
          <div className="px-4 py-2">
            <button
              onClick={() =>
                setHeaders([...headers, { key: "", value: "", enabled: true }])
              }
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Header
            </button>
          </div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {headers.map((h, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b">
                    <input
                      type="checkbox"
                      checked={h.enabled}
                      onChange={(e) => {
                        const copy = [...headers];
                        copy[i].enabled = e.target.checked;
                        setHeaders(copy);
                      }}
                    />
                  </td>

                  <td className="px-3 py-2 border-b font-medium">
                    <input
                      type="text"
                      value={h.key}
                      onChange={(e) => {
                        const copy = [...headers];
                        copy[i].key = e.target.value;
                        setHeaders(copy);
                      }}
                      placeholder="Header Key"
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </td>

                  <td className="px-3 py-2 border-b truncate max-w-xs">
                    <input
                      type="text"
                      value={h.value}
                      onChange={(e) => {
                        const copy = [...headers];
                        copy[i].value = e.target.value;
                        setHeaders(copy);
                      }}
                      placeholder="Header Value"
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </td>

                  <td className="px-3 py-2 border-b text-gray-400">
                    Description
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "body" && (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full min-h-36 p-4 font-mono text-sm focus:outline-none"
            placeholder={`{
  "name": "Add your name in the body"
}`}
          />
        </div>
      )}
    </div>
  );
}

function APIResponse({ loading, response, responseHeaders }) {
  const [activeTab, setActiveTab] = useState("body");

  console.log("response", response);

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden text-sm ">
      <div className="flex gap-6 px-4 pt-3 border-b">
        {["body", "headers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-orange-500 text-black font-medium"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "body" && (
        <>
          <div className="flex font-mono text-sm h-96">
            {/* <div className="bg-gray-50 text-gray-400 px-3 py-3 text-right select-none">
              {response &&
                Array.from({ length: response?.length }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
            </div> */}

            <pre className="flex-1 px-4 py-3 overflow-auto">
              {response && JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </>
      )}

      {activeTab === "headers" && (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-2 border-b">Key</th>
              <th className="text-left px-4 py-2 border-b">Value</th>
            </tr>
          </thead>
          <tbody>
            {responseHeaders &&
              Object.entries(responseHeaders).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b font-medium">{key}</td>
                  <td className="px-4 py-2 border-b text-gray-700">{value}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
