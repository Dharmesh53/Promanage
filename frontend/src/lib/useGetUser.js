import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import axios from "axios";

const getUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return sendRequest;
};

export default getUser;
