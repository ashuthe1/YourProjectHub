import { lazy } from "react";

const Home = lazy(() => import("./home/Home"));
const Contact = lazy(() => import("./contact/Contact"));
const Profile = lazy(() => import("./profile/Profile"));

const Error = lazy(() => import("./message/Error"));
const CheckoutSuccess = lazy(() => import("./message/CheckoutSuccess"));
const CheckoutFailure = lazy(() => import("./message/CheckoutFailure"));

const Project = lazy(() => import("./project/Project"));
const SingleProject = lazy(() => import("./project/SingleProject"));
const SavedProjects = lazy(() => import("./project/SavedProjects"));
const AddProject = lazy(() => import("./project/AddProject"));
const MyProjects = lazy(() => import("./project/MyProjects"));
const EditProject = lazy(() => import("./project/EditProject"));

const Blogs = lazy(() => import("./blogs/Blogs"));
const AddBlog = lazy(() => import("./blogs/AddBlog"));
const SingleBlog = lazy(() => import("./blogs/SingleBlog"));
const MyBlogs = lazy(() => import("./blogs/MyBlogs"));
const EditBlog = lazy(() => import("./blogs/EditBlog"));

const Users = lazy(() => import("./dashboard/Users"));
const DashboardProjects = lazy(() => import("./dashboard/DashboardProjects"));
const DashboardBlogs = lazy(() => import("./dashboard/DashboardBlogs"));

const SignIn = lazy(() => import("./auth/SignIn"));
const SignUp = lazy(() => import("./auth/SignUp"));

export {
  Home,
  Contact,
  Profile,
  Project,
  SingleProject,
  SavedProjects,
  AddProject,
  MyProjects,
  EditProject,
  Blogs,
  AddBlog,
  SingleBlog,
  MyBlogs,
  EditBlog,
  Users,
  DashboardProjects,
  DashboardBlogs,
  Error,
  CheckoutSuccess,
  CheckoutFailure,
  SignIn,
  SignUp,
};
