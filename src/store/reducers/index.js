import { combineReducers } from "redux";
import fuseReducers from "./fuse/index";

const createReducer = (asyncReducers) =>
  combineReducers({
    fuseReducers,

    ...asyncReducers,
  });

export default createReducer;
