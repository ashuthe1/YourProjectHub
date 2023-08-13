import React, { useState } from "react";
import {
  Comment,
  Button,
  Input,
  ShareButton,
  NoData,
  ComponentLoading,
} from "../../components";
import { IoMailOutline } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
import { LuChefHat } from "react-icons/lu";
import { BsStopwatch, BsGithub } from "react-icons/bs";
import { LiaWeightSolid } from "react-icons/lia";
import { AiOutlineHeart, AiFillHeart, AiOutlineUser } from "react-icons/ai";
import {FaLaptopCode} from "react-icons/fa";
import {
  useGetProjectQuery,
  useRateProjectMutation,
  useCommentProjectMutation,
  useDeleteCommentProjectMutation,
  useToggleFavoriteMutation,
  useDeleteProjectMutation,
} from "../../features/project/projectApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Rating, IconButton, Menu, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import {
  selectCurrentToken,
  setCredentials,
} from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { MoreVert } from "@mui/icons-material";

const SingleProject = () => {
  const [rating, setRating] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const { data, ...rest } = useGetProjectQuery(id);
  const [rateProject] = useRateProjectMutation();
  const [commentProject, { isLoading }] = useCommentProjectMutation();
  const [deleteComment] = useDeleteCommentProjectMutation();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const user = useSelector(selectCurrentToken)
    ? jwtDecode(useSelector(selectCurrentToken)).UserInfo
    : null;

  const [formDetails, setFormDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });

  const sumOfRatings = data?.ratings.reduce(
    (sum, item) => sum + item.rating,
    0
  );
  const averageRating =
    sumOfRatings === 0 ? 0 : sumOfRatings / data?.ratings.length;

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
  };

  const handleRating = async (event, newValue) => {
    try {
      if (!user) {
        toast.error("You must sign in first");
        return navigate("/auth/signin");
      }
      setRating(newValue);
      await toast.promise(
        rateProject({ rating: newValue, projectId: id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Rating added successfully",
          error: "You have already rating this project",
        }
      );
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(
        commentProject({ projectId: id, comment: formDetails.message }).unwrap(),
        {
          pending: "Please wait...",
          success: "Comment added",
          error: "Could not add comment",
        }
      );
      setFormDetails({ ...formDetails, message: "" });
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  const handleDeleteComment = async (_id) => {
    try {
      await toast.promise(
        deleteComment({ projectId: id, commentId: _id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Comment deleted",
          error: "Could not delete comment",
        }
      );
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (!user) {
        toast.error("You must sign in first");
        return navigate("/auth/signin");
      }

      const userData = await toast.promise(
        toggleFavorite({ projectId: id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Favorites updated",
          error: "Unable to update favorites",
        }
      );
      dispatch(setCredentials({ ...userData }));
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuDelete = () => {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteProject(data?._id);
      navigate("/project");
    }
    setAnchorEl(null);
  };

  return (
    <>
      {rest?.isLoading ? (
        <ComponentLoading />
      ) : (
        <section className="box flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Project image */}
            <div className="basis-1/3">
              <img
                src={data?.image}
                alt={data?.title}
                className="rounded w-full"
              />
            </div>
            {/* Project details */}
            <div className="basis-2/3 flex flex-col gap-2">
              <div className="flex justify-between">
                <h2 className="font-bold text-xl md:text-3xl">{data?.title}</h2>
                {data?.author?._id === user?.userId && (
                  <>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? "long-menu" : undefined}
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      size="small"
                      onClick={handleMenu}
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      MenuListProps={{
                        "aria-labelledby": "long-button",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleMenuClose}
                    >
                      <MenuItem>
                        <Link to={`/project/edit/${id}`}>Edit</Link>
                      </MenuItem>
                      <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
                    </Menu>
                  </>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="flex gap-2 items-center font-semibold">
                  <LuChefHat className="text-primary" />
                  {data?.author?.name}
                </p>
                <div className="flex gap-2 p-2 bg-light rounded-l-lg">
                  {user?.favorites?.some((ele) => ele === id) ? (
                    <AiFillHeart
                      className="text-2xl text-red-500 cursor-pointer"
                      onClick={handleToggleFavorite}
                    />
                  ) : (
                    <AiOutlineHeart
                      className="text-2xl text-red-500 cursor-pointer"
                      onClick={handleToggleFavorite}
                    />
                  )}
                  <ShareButton
                    url={`${import.meta.env.VITE_BASE_URL}/project/${data?._id}`}
                  />
                </div>
              </div>
              {/* Project rating */}
              <Rating
                value={averageRating}
                size={"medium"}
                readOnly
              />
              <p className="my-4">{data?.description}</p>
              {/* Project time & cals */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between w-2/3 mx-auto">
                <div className="flex flex-col gap-1 items-center text-gray-800">
                  <BsGithub className="text-5xl" />
                  <h3 className="font-bold text-xl text-primary">Github Link</h3>
                  <p>{data?.githubLink}</p>
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <FaLaptopCode className="text-5xl text-gray-800" />
                  <h3 className="font-bold text-xl text-primary">
                    Live Link
                  </h3>
                  <p>{data?.liveLink}</p>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="flex flex-col md:flex-row gap-4">
            {/* Project TechStack */}
            <div className="basis-1/3 flex flex-col gap-4 border-b-2 md:border-b-0 pb-4 md:pb-0 md:border-r-2 border-gray-200 items-center">
              <h3 className="font-bold text-2xl">Tech Stack</h3>
              <ol className="flex flex-col gap-2 list-decimal ml-5">
                {data?.techStack?.map((techStack, i) => (
                  <li key={`techStack-${i + 1}`}>{techStack}</li>
                ))}
              </ol>
            </div>
            {/* Project LongDescription */}
            <div className="basis-2/3 flex flex-col gap-4">
              <h3 className="font-bold text-2xl">Long Description</h3>
              <ul className="ml-2 flex flex-col gap-4">
                {data?.longDescription?.map((longDescription, i) => (
                  <li key={`longDescription-${i + 1}`}>
                    <h4 className="font-bold text-xl">Step {i + 1}</h4>
                    <p className="ml-2">{longDescription}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <hr />
          {/* Rate project */}
          {!data?.ratings?.some((obj) => obj.user === user?.userId) && (
            <>
              <div className="my-6 w-full sm:w-2/3 md:w-1/2 mx-auto flex justify-between gap-6">
                <h3 className="font-bold text-2xl">Rate the project</h3>
                <Rating
                  size={"large"}
                  precision={0.25}
                  value={rating}
                  onChange={handleRating}
                />
              </div>
              <hr />
            </>
          )}
          {/* Project comment form */}
          <div className="my-10 w-full sm:w-2/3 md:w-1/2 mx-auto flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Leave a Reply</h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <Input
                type={"text"}
                id={"name"}
                icon={<AiOutlineUser />}
                handleChange={handleChange}
                value={formDetails.name}
                label={"Name"}
                placeholder={"John Doe"}
              />
              <Input
                type={"email"}
                id={"email"}
                icon={<IoMailOutline />}
                handleChange={handleChange}
                value={formDetails.email}
                label={"Email"}
                placeholder={"example@abc.com"}
              />
              <div className="flex flex-col relative ">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold mb-3"
                >
                  Comment
                </label>
                <textarea
                  onChange={handleChange}
                  value={formDetails.message}
                  id="message"
                  rows={4}
                  required
                  aria-required="true"
                  placeholder="Leave a comment..."
                  className="py-2 px-4 border bg-gray-100 rounded-lg focus:outline outline-primary"
                />
              </div>
              <Button
                content={"Post comment"}
                icon={<FaRegPaperPlane />}
                type={"submit"}
                customCss={"rounded-lg gap-3 max-w-max"}
                loading={isLoading}
              />
            </form>
          </div>
          <hr />
          {/* Project comments */}
          <div className="w-full sm:w-4/5 mx-auto flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Comments</h3>
            {data?.comments?.length ? (
              <div className="flex flex-col gap-6">
                {data?.comments?.map((comment) => (
                  <Comment
                    key={comment?._id}
                    comment={comment}
                    userId={user?.userId}
                    handleDeleteComment={handleDeleteComment}
                  />
                ))}
              </div>
            ) : (
              <NoData text={"Comments"} />
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default SingleProject;
