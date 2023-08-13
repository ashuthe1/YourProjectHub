import React from "react";
import { AllCards, ComponentLoading } from "../../components";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useGetProjectsQuery } from "../../features/project/projectApiSlice";

const index = () => {
  const { data, isLoading } = useGetProjectsQuery();

  const favorites = useSelector(selectCurrentToken)
    ? jwtDecode(useSelector(selectCurrentToken)).UserInfo.favorites
    : null;

  const updatedData = data?.filter((obj) =>
    favorites?.includes(obj._id.toString())
  );

  return (
    <>
      {isLoading ? (
        <ComponentLoading />
      ) : (
        <AllCards
          mainTitle={"Your Faviourate Projects!"}
          tagline={
            "Welcome to your personal space. Here you can find all your saved projects."
          }
          type={"project"}
          data={updatedData}
        />
      )}
    </>
  );
};

export default index;
