import { useReducer } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

// Initial state for the reducer
const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  showPassword: false,
  showConfirm: false,
};

// Reducer function to handle state updates
function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_SHOW_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "TOGGLE_SHOW_CONFIRM":
      return { ...state, showConfirm: !state.showConfirm };
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
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };
  return (
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
  );
}

export default function SignupPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example validation
    if (state.password !== state.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    console.log("Form Submitted:", state);
    // dispatch({ type: "RESET" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-center text-lg font-semibold mb-1">
          Create an account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Explore the Minipostman
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            placeholder="Enter Your Username"
            value={state.username}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "username",
                value: e.target.value,
              })
            }
          />
          <InputField
            type="email"
            placeholder="Enter Your Email"
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
          <InputField
            isPassword
            placeholder="Confirm Password"
            value={state.confirmPassword}
            showValue={state.showConfirm}
            toggleShow={() => dispatch({ type: "TOGGLE_SHOW_CONFIRM" })}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "confirmPassword",
                value: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="w-full cursor-pointer bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-700 font-medium hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 | Designed and coded with ❤️ by Yuvraj Manchadi
        </p>
      </div>
    </div>
  );
}
