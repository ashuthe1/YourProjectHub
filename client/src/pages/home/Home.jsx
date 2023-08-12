import React from "react";
import { Hero, HomeCategories, Subscribe } from "../../components";
import { useGetProjectsQuery } from "../../features/project/projectApiSlice";
import { useGetBlogsQuery } from "../../features/blog/blogApiSlice";

const Home = () => {
  const projects = useGetProjectsQuery();
  const blogs = useGetBlogsQuery();

  return (
    <>
      <Hero />
      <HomeCategories
        title={"project"}
        data={projects?.data}
        isLoading={projects?.isLoading}
      />
      <Subscribe />
      <HomeCategories
        title={"blog"}
        data={blogs?.data}
        isLoading={blogs?.isLoading}
      />
    </>
  );
};

export default Home;
