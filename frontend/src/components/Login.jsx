import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendReq = async () => {
    try {
      const userData = {
        email: data.email,
        password: data.password,
      };
      const res = await axios.post("https://promanage-backend-i7zo.onrender.com/api/login", userData);
      const result = await res.data;
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await sendReq();
    if (user) {
      dispatch(login());
      navigate("/");
    }
  };

  return (
    <div className="mt-7">
      <div className="w-1/3 m-auto ">
        <span className="flex justify-center text-2xl">Login</span>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email
            <Input
              name="email"
              type="email"
              className="outline mt-3"
              value={data.email}
              onChange={(e) => handleChange(e)}
              placeholder="Enter your email"
            />
          </label>
          <label htmlFor="password">
            Password
            <Input
              name="password"
              type="password"
              className="outline mt-3"
              value={data.password}
              onChange={(e) => handleChange(e)}
              placeholder="Enter your password"
            />
          </label>
          <Button className="border-2" type="submit">
            Login
          </Button>
        </form>
        <span className="flex justify-center my-6 gap-2">
          Don't have an Account
          <Link to="/signup">
            <span className="text-blue-700 underline"> Signup</span>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
