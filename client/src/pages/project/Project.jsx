import React, { useEffect } from "react";
import { AllCards, ComponentLoading } from "../../components";
import { useDispatch } from "react-redux";
import { setProjects } from "../../features/project/projectSlice";
import { useGetProjectsQuery } from "../../features/project/projectApiSlice";

const Project = () => {
  const { data, isLoading } = useGetProjectsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(setProjects(data));
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <ComponentLoading />
      ) : (
        <AllCards
          mainTitle={"Discover Open Source Projects!"}
          tagline={
            "Supercharge your open source contributions with Project Hub! Collabrate with other developers and build amazing projects."
          }
          type={"project"}
          data={data}
        />
      )}
    </>
  );
};

export default Project;
