import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import axios from "axios";
axios.defaults.withCredentials = true;

const dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const sendRequest = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true,
      });
      const data = await res.data;
      return data;
    } catch (error) {
      console.log(error.message);
      dispatch(logout());
      navigate("/");
    }
  };
  useEffect(() => {
    sendRequest().then((data) => setUser(data));
  }, []);

  return <div>{user && <h1>{user.name}'s </h1>}Dashboard</div>;
};

export default dashboard;
