import { combineReducers } from "redux";
import message from "./message.reducer";
import loading from "./loading.reducer";

const fuseReducers = combineReducers({
  message,
  loading,
});

export default fuseReducers;
