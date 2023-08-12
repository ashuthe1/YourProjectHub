import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import dateFormat from "../../common/dateFormat";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import { useToggleFavoriteMutation } from "../../features/project/projectApiSlice";
import {
  selectCurrentToken,
  setCredentials,
} from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import ShareButton from "../shareButton/ShareButton";

const SingleCard = ({ singleData, type }) => {
  const user = useSelector(selectCurrentToken)
    ? jwtDecode(useSelector(selectCurrentToken)).UserInfo
    : null;
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [toggleFavorite] = useToggleFavoriteMutation();

  const formattedDate = dateFormat(singleData?.createdAt);
  const sumOfRatings = singleData?.ratings.reduce(
    (sum, item) => sum + item.rating,
    0
  );
  const averageRating =
    sumOfRatings === 0 ? 0 : sumOfRatings / singleData?.ratings.length;

  const handleToggleFavorite = async () => {
    try {
      if (!user) {
        toast.error("You must sign in first");
        return navigate("/auth/signin");
      }
      const userData = await toast.promise(
        toggleFavorite({ projectId: singleData._id }).unwrap(),
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

  return (
    <div className="flex flex-col gap-1 justify-between shadow hover:shadow-lg rounded">
      {/* Card Top */}
      <div className="flex flex-col justify-between h-full ">
        <div className="relative h-full w-full">
          {/* Only for singleData */}
          {/* Favorite & share button */}
          {type === "project" && (
            <div className="absolute top-2 right-0 flex flex-col gap-2 p-2 bg-light rounded-l-lg">
              {user?.favorites?.some((ele) => ele === singleData._id) ? (
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
                url={`${import.meta.env.VITE_BASE_URL}/project/${
                  singleData?._id
                }`}
              />
            </div>
          )}
          {/* Card image */}
          <img
            src={singleData?.image}
            alt={singleData?.title}
            className="w-full object-cover object-center rounded-t"
          />
          {/* Overlay */}
          <div className="absolute bottom-0 left-0 w-full backdrop-blur-sm bg-[#fffcf5d3] p-4 flex justify-between">
            <h4 className="font-bold">{singleData?.author?.name}</h4>
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>
        {/* Card Bottom details */}
        <div className="flex flex-col gap-3 p-4">
          {/* Card heading */}
          <h4 className="font-bold text-lg">{singleData?.title}</h4>
          {/* Card description */}
          <p className="text-sm">
            {singleData?.description.substring(0, 100)}...
          </p>
          {/* Card rating */}
          {type === "project" && (
            <Rating
              value={averageRating}
              readOnly
              size={"medium"}
            />
          )}
        </div>
      </div>
      {/* Read more link */}
      {type === 'project' && (<Link
        to={`/project/${singleData?._id}`}
        className="flex gap-2 items-center p-4 mt-4 max-w-max hover:border-primary hover:text-primary"
      >
        Read more
        <BsArrowUpRight />
      </Link>)}

      {type === 'blog' && (<Link
        to={`/blog/${singleData?._id}`}
        className="flex gap-2 items-center p-4 mt-4 max-w-max hover:border-primary hover:text-primary"
      >

        Read more
        <BsArrowUpRight />
      </Link>)}
    </div>
  );
};

export default SingleCard;
