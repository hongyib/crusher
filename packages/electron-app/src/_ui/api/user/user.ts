import React from "react";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import useRequest from "../../utils/useRequest";
import { getUserInfoAPIRequest } from "./user.requests";
import { useNavigate } from "react-router-dom";
import { getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { useStore } from "react-redux";

export function useUser() {
  const { data: userInfo, error } = useRequest(getUserInfoAPIRequest);
  const navigate = useNavigate();
  const store = useStore();

  React.useEffect(() => {
    if(userInfo && !userInfo.isUserLoggedIn){
      const userInfoRedux = getUserAccountInfo(store.getState());
      console.log("User info redux", userInfoRedux);
      if(userInfoRedux && userInfoRedux.token) {
          // Invalid crdentials error. Logout
          return navigate("/invalid_creds_error");
      }
      return navigate("/login");
    }
  }, [userInfo]);
  const projects = React.useMemo(() => {
    if(userInfo && userInfo.projects) {
      return userInfo.projects;
    }
    return null;
  }, [userInfo]);

  return { userInfo, projects, error: error  };
}
