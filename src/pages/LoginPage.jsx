import { useReducer, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";

// Initial state
const initialState = {
  email: "",
  password: "",
  showPassword: false,
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_SHOW_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Reusable Input Component
function InputField({
  type = "text",
  placeholder,
  value,
  onChange,
  isPassword = false,
  showValue,
  toggleShow,
  label,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={isPassword ? (showValue ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {isPassword && (
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            onClick={toggleShow}
          >
            {showValue ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Example login logic
    toast.success("hello");
    console.log("Login Form Submitted:", state);

    const data = { email: state?.email, password: state?.password };
    try {
      setisloading(true);
      const response = await axiosInstance.post(`/api/v1/auth/login`, data);
      console.log(response);
      const { jwt } = response.data;

      if (jwt) {
        toast.success("User logged in");
        sessionStorage.setItem("token", jwt);
        navigate("/minipostman");
      }
    } catch (e) {
      console.error(e);
      if (e?.response?.data.msg === "Email already exists") {
        toast.error("user already exists");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setisloading(false);
    }

    console.log("Form Submitted:", state);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-6">
          Hi, Welcome Back! <span className="text-yellow-500">👋</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            value={state.email}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "email",
                value: e.target.value,
              })
            }
          />

          <InputField
            label="Password"
            isPassword
            placeholder="Enter Your Password"
            value={state.password}
            showValue={state.showPassword}
            toggleShow={() => dispatch({ type: "TOGGLE_SHOW_PASSWORD" })}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "password",
                value: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 transition"
          >
            {isloading ? "loading" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-700 font-medium hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 | Designed and coded with ❤️ by Yuvraj Manchadi
        </p>
      </div>
    </div>
  );
}
