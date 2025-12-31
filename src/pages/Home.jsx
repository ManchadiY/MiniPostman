import React, { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { VscClose, VscListFilter } from "react-icons/vsc";
import { CgChevronDown } from "react-icons/cg";
import { IoSaveOutline } from "react-icons/io5";
import ImportModal from "../components/ImportModal";
import axiosInstance from "../utils/axiosinstance";
import toast from "react-hot-toast";

// GET https://jsonplaceholder.typicode.com/posts
// POST https://jsonplaceholder.typicode.com/posts

const savedAPIData = [
  {
    id: 1,
    name: "Create Post",
    method: "post",
    url: "https://jsonplaceholder.typicode.com/posts",
    headers: [
      { key: "Content-Type", value: "application/json", enabled: true },
      { key: "Authorization", value: "Bearer demo-token-123", enabled: false },
    ],
    body: `{
  "title": "foo",
  "body": "bar",
  "userId": 1
}`,
  },

  {
    id: 2,
    name: "Get All Posts",
    method: "get",
    url: "https://jsonplaceholder.typicode.com/posts",
    headers: [{ key: "Accept", value: "application/json", enabled: true }],
    body: "",
  },

  {
    id: 3,
    name: "Get Single Post",
    method: "get",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    headers: [
      { key: "Accept", value: "application/json", enabled: true },
      { key: "Cache-Control", value: "no-cache", enabled: true },
    ],
    body: "",
  },

  {
    id: 4,
    name: "Update Post",
    method: "put",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    headers: [
      { key: "Content-Type", value: "application/json", enabled: true },
      { key: "Authorization", value: "Bearer demo-token-456", enabled: true },
    ],
    body: `{
  "id": 1,
  "title": "updated title",
  "body": "updated body content",
  "userId": 1
}`,
  },

  {
    id: 5,
    name: "Delete Post",
    method: "del",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    headers: [
      { key: "Authorization", value: "Bearer demo-token-789", enabled: true },
    ],
    body: "",
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
  const [recentTabs, setRecentTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const responseRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [userSavedReq, setUserSavedReq] = useState([]);

  async function getData() {
    try {
      const data = await axiosInstance.get("/api/v1/APiCall/");
      console.log("data", data);
      setUserSavedReq(data.data.apiCalls);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

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

  const loadSavedAPI = (api) => {
    setMethod(api.method);
    setUrl(api.url);
    setHeaders(api.headers || []);
    setBody(api.body || "");
    setResponse(null);
    setResponseHeaders(null);
    setActiveTabId(api.id);

    setRecentTabs((prev) => {
      const alreadyOpen = prev.some((t) => t.id === api.id);
      if (alreadyOpen) return prev;
      return [...prev, api];
    });
  };

  async function handleSave(api, header, body, method) {
    if (!api) {
      return toast.error("url is not defined ");
    }

    const reqbody = {
      description: "",
      method: method,
      url: api,
      headers: header,
      body: body,
      name: api,
    };
    console.log("reqbody", reqbody);

    try {
      setIsSaveLoading(true);
      const data = await axiosInstance.post("/api/v1/Apicall/", reqbody);
      if (data) {
        toast?.success("request saved ");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSaveLoading(false);
    }
  }

  return (
    <>
      <div className="container mx-auto h-screen flex flex-col overflow-hidden">
        <div className="flex justify-between ">
          <h1 className="text-2xl font-bold text-[#FE6C37]">mini-postman</h1>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="text-xl h-9 w-9 rounded-full border flex justify-center items-center"
          >
            <FiUser />
          </button>
        </div>
        <div className="flex flex-1 gap-5">
          <>
            <Sidebar
              setOpen={setOpen}
              onSelectSaved={loadSavedAPI}
              userSavedReq={userSavedReq}
            />
            <MobileSidebar
              open={mobileSidebarOpen}
              onClose={() => setMobileSidebarOpen(false)}
              onSelectSaved={loadSavedAPI}
              userSavedReq={userSavedReq}
              setOpen={setOpen}
            />
          </>
          <div className="flex-1 overflow-hidden flex flex-col">
            <div>
              <ul className="flex gap-1 overflow-x-auto h-10 border-b">
                {recentTabs.map((item) => (
                  <li
                    key={item.id}
                    title={item.name}
                    onClick={() => loadSavedAPI(item)}
                    className={`flex items-center gap-1 lg:gap-2 px-1.5 lg:px-3 cursor-pointer relative
          ${activeTabId === item.id ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  >
                    {activeTabId === item.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />
                    )}

                    <span
                      className={`lg:px-2 py-0.5 text-xs lg:text-sm font-semibold uppercase rounded ${
                        methodStyles[item.method.toLowerCase()]
                      }`}
                    >
                      {item.method}
                    </span>
                    <span className="text-xs lg:text-sm whitespace-nowrap">
                      {item.name.slice(0, 10)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecentTabs((prev) =>
                          prev.filter((t) => t.id !== item.id)
                        );
                        if (activeTabId === item.id) {
                          const remaining = recentTabs.filter(
                            (t) => t.id !== item.id
                          );
                          const last = remaining[remaining.length - 1];
                          if (last) {
                            loadSavedAPI(last);
                          } else {
                            setActiveTabId(null);
                            setUrl("");
                            setHeaders([]);
                            setBody("");
                          }
                        }
                      }}
                      className="ml-1 text-gray-400 hover:text-black"
                    >
                      <VscClose />
                    </button>
                  </li>
                ))}
              </ul>
              {/* <div className="my-3 flex justify-end"> */}
              <button
                onClick={() => handleSave(url, headers, body, method)}
                className="cursor-pointer flex items-center text-[#BDC1CA] text-xs lg:text-sm border border-[#BDC1CA] px-3 py-1.5 my-3"
              >
                <IoSaveOutline />
                {isSaveLoading ? "loading" : "save"}
              </button>
              {/* </div> */}
            </div>
            <div className="overflow-hidden flex-1 flex flex-col lg:gap-3">
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
      <ImportModal isOpen={open} onClose={() => setOpen((prev) => !prev)} />
    </>
  );
}

export default Home;

function Sidebar({ setOpen, onSelectSaved, userSavedReq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-sm lg:max-w-none lg:w-[320px] w-full hidden lg:block">
      <div className="h-10 py-2 w-full flex justify-between border-b">
        <h4 className="capitalize text-lg font-semibold">my workspace</h4>
        <div className="flex gap-2">
          {/* <button className="bg-[#EAEAEA] text-xs lg:text-sm px-3 flex items-center py-2 capitalize font-medium hover:bg-gray-300">
            new
          </button> */}
          <button
            onClick={() => setOpen(true)}
            className="bg-[#EAEAEA] text-xs lg:text-sm px-3 flex items-center py-2 capitalize font-medium hover:bg-gray-300"
          >
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
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="cursor-pointer"
          >
            <CgChevronDown />
          </button>
          Saved Request
        </div>
        {isOpen && (
          <ul>
            {userSavedReq.map((item, index) => (
              <li
                key={index}
                title={item.name}
                onClick={() => onSelectSaved(item)}
                className="flex items-center gap-3 border-b mb-1 cursor-pointer hover:bg-gray-100"
              >
                <span
                  className={`px-3 py-1 text-xs lg:text-sm font-semibold uppercase rounded-md ${
                    methodStyles[item.method.toLowerCase()]
                  }`}
                >
                  {item.method}
                </span>
                <span className="text-xs lg:text-sm break-all">
                  {item.name.slice(0, 20)}
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
          className={`uppercase focus:outline-none text-xs lg:text-sm ${
            methodStyles[selectedMethod.toLowerCase()]
          }`}
        >
          {methods.map((method) => (
            <option
              key={method}
              className={`${methodStyles[method.toLowerCase()]}`}
            >
              {method}
            </option>
          ))}
        </select>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com"
          className="flex-1 focus:outline-none ml-2 text-xs lg:text-sm"
        />
      </div>
      <button
        onClick={onSend}
        disabled={loading}
        className="bg-[#077BED] hover:bg-[#3f9af5] text-[#FFFFFF] font-medium capitalize py-1.5 lg:py-3 px-5 rounded-sm"
      >
        {loading ? "sending..." : "send"}
      </button>
    </div>
  );
}

function HeadersAndBody({ headers, setHeaders, body, setBody }) {
  const [activeTab, setActiveTab] = useState("headers");
  return (
    <div className="overflow-auto flex-1 max-h-60">
      <ul className="flex gap-7 border-b lg:mb-4">
        {["headers", "body"].map((t) => (
          <li
            key={t}
            onClick={() => setActiveTab(t)}
            className={`text-xs lg:text-sm capitalize cursor-pointer pb-2 ${
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
          className={`text-xs lg:text-sm capitalize cursor-pointer pb-2 ${
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
              className="text-xs lg:text-sm text-blue-600 hover:underline"
            >
              + Add Header
            </button>
          </div>
          <table className="w-full border-collapse text-xs lg:text-sm">
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
                  <td className="px-2 py-2 border-b text-center">
                    <button
                      onClick={() =>
                        setHeaders((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="text-gray-400 hover:text-red-500"
                      title="Remove header"
                    >
                      <VscClose />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "body" && (
        <div className="border border-gray-200 rounded-md overflow-auto">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full min-h-36 p-4 font-mono text-xs lg:text-sm focus:outline-none"
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

  return (
    <div className="border border-gray-200 rounded-md text-xs lg:text-sm flex-1">
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
        <div className="flex font-mono text-xs lg:text-sm h-full overflow-auto ">
          {/* <div className="bg-gray-50 text-gray-400 px-3 py-3 text-right select-none">
              {response &&
                Array.from({ length: response?.length }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
            </div> */}

          <pre className="flex-1 px-4 py-3 overflow-auto h-40 lg:h-60 text-wrap">
            {response && JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {activeTab === "headers" && (
        <table className="w-full text-xs lg:text-sm">
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

function MobileSidebar({
  open,
  onClose,
  onSelectSaved,
  userSavedReq,
  setOpen,
}) {
  const [isOpen, setIsOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-lg flex flex-col animate-slideIn">
        <div className="h-12 px-4 flex items-center justify-between border-b">
          <h4 className="font-semibold text-lg">My Workspace</h4>
          <button onClick={onClose}>
            <VscClose size={22} />
          </button>
        </div>

        <div className="flex gap-2 px-4 py-3 border-b">
          <button
            onClick={() => setOpen(true)}
            className="bg-[#EAEAEA] text-sm px-3 py-2 rounded"
          >
            Import
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <CgChevronDown />
            </button>
            <span className="text-sm font-medium">Saved Responses</span>
          </div>
          {isOpen && (
            <ul className="space-y-1">
              {userSavedReq?.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    onSelectSaved(item);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
                >
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold uppercase rounded ${
                      methodStyles[item?.method?.toLowerCase()]
                    }`}
                  >
                    {item.method}
                  </span>
                  <span className="text-sm">{item.name.slice(0, 20)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
