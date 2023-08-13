import React, { useState } from "react";
import { Button } from "../../components";
import { photo } from "../../assets";
import { RxCross2 } from "react-icons/rx";
import uploadImage from "../../common/uploadImage";
import { LinearProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useAddProjectMutation } from "../../features/project/projectApiSlice";

const AddProject = () => {
  const [formDetails, setFormDetails] = useState({
    title: "",
    image: "",
    description: "",
    githubLink: "",
    liveLink: "",
    techStack: [],
    longDescription: [],
  });
  const [progress, setProgress] = useState(0);
  const [techStack, setTechStack] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [focused, setFocused] = useState({
    title: "",
    githubLink: "",
    liveLink: "",
    techStack: "",
  });
  const [addProject, { isLoading }] = useAddProjectMutation();

  const handleFocus = (e) => {
    setFocused({ ...focused, [e.target.id]: true });
  };

  const handleChange = (e) => {
    if (e.target.id === "image") {
      uploadImage(e, setProgress, setFormDetails, formDetails);
    } else {
      setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
    }
  };

  const addTechStack = () => {
    if (!techStack) {
      return toast.error("TechStack cannot be empty");
    }
    const updatedFormDetails = { ...formDetails };
    updatedFormDetails.techStack.push(techStack);
    setFormDetails(updatedFormDetails);
    setTechStack("");
  };

  const addLongDescription = () => {
    if (!longDescription) {
      return toast.error("LongDescription cannot be empty");
    }
    const updatedFormDetails = { ...formDetails };
    updatedFormDetails.longDescription.push(longDescription);
    setFormDetails(updatedFormDetails);
    setLongDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formDetails.image) return toast.error("Upload project image");
    if (!formDetails.techStack.length)
      return toast.error("TechStack cannot be empty");
    // if (!formDetails.longDescription.length)
    //   return toast.error("LongDescription cannot be empty");

    try {
      const project = await toast.promise(
        addProject({ ...formDetails }).unwrap(),
        {
          pending: "Please wait...",
          success: "Project added successfully",
          error: "Unable to add project",
        }
      );
      setFormDetails({
        title: "",
        image: "",
        description: "",
        githubLink: "",
        liveLink: "",
        techStack: [],
        longDescription: [],
      });
      setFocused({
        title: "",
        githubLink: "",
        liveLink: "",
        techStack: "",
      });
    } catch (error) {
      toast.error(error.data);
      console.error(error);
    }
  };

  return (
    <section className="box flex flex-col gap-6">
      <h2 className="font-bold text-xl">Add New Project</h2>
      <hr />
      <form
        className="flex flex-col-reverse md:flex-row gap-4 mt-10 justify-around"
        onSubmit={handleSubmit}
      >
        <div className="basis-1/2 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row justify-between">
            <label
              htmlFor="title"
              className="text-sm font-semibold mb-3 basis-1/2"
            >
              Project name
            </label>
            <div className="flex flex-col basis-1/2">
              <input
                type="text"
                onChange={handleChange}
                value={formDetails.title}
                id="title"
                name="title"
                onBlur={handleFocus}
                focused={focused.title.toString()}
                pattern={"^.{3,}$"}
                required
                aria-required="true"
                aria-describedby="title-error"
                placeholder="Enter project name"
                className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary"
              />
              <span
                id="title-error"
                className="hidden text-red-500 pl-2 text-sm mt-1"
              >
                Name should at least 3 characters long
              </span>
            </div>
          </div>
          <hr />
          <div className="flex flex-col sm:flex-row justify-between">
            <label
              htmlFor="description"
              className="text-sm font-semibold mb-3 basis-1/2"
            >
              Project description
            </label>
            <div className="flex flex-col basis-1/2">
              <textarea
                type="text"
                onChange={handleChange}
                value={formDetails.description}
                id="description"
                required
                name="description"
                rows="5"
                aria-required="true"
                placeholder="Enter your description here..."
                className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary w-full resize-none"
              ></textarea>
            </div>
          </div>
          <hr />
          <div className="flex flex-col sm:flex-row justify-between">
            <label
              htmlFor="githubLink"
              className="text-sm font-semibold mb-3 basis-1/2"
            >
             Github Link
            </label>
            <div className="flex flex-col basis-1/2">
              <input
                type="text"
                onChange={handleChange}
                value={formDetails.githubLink}
                id="githubLink"
                required
                name="githubLink"
                onBlur={handleFocus}
                focused={focused.githubLink.toString()}
                aria-required="true"
                aria-describedby="githubLink-error"
                placeholder="Enter Github Link"
                className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary"
              />
              <span
                id="githubLink-error"
                className="hidden text-red-500 pl-2 text-sm mt-1"
              >
                Project must have Github Link
              </span>
            </div>
          </div>
          <hr />
          <div className="flex flex-col sm:flex-row justify-between">
            <label
              htmlFor="liveLink"
              className="text-sm font-semibold mb-3 basis-1/2"
            >
              Live Link
            </label>
            <div className="flex flex-col basis-1/2">
              <input
                type="text"
                onChange={handleChange}
                value={formDetails.liveLink}
                id="liveLink"
                required
                name="liveLink"
                onBlur={handleFocus}
                focused={focused.liveLink.toString()}
                aria-required="true"
                aria-describedby="liveLink-error"
                placeholder="Enter live link"
                className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary"
              />
              <span
                id="liveLink-error"
                className="hidden text-red-500 pl-2 text-sm mt-1"
              >
                Must include live link
              </span>
            </div>
          </div>
          <hr />
          <div className="flex flex-col sm:flex-row justify-between">
            <label
              htmlFor="techStack"
              className="text-sm font-semibold mb-3 basis-1/2"
            >
              Tech Stack
            </label>
            <div className="flex flex-col basis-1/2">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 justify-between">
                  <input
                    type="text"
                    onChange={(e) => setTechStack(e.target.value)}
                    value={techStack}
                    id="techStack"
                    name="techStack"
                    onBlur={handleFocus}
                    focused={focused.techStack.toString()}
                    pattern={"^.{3,}$"}
                    aria-required="true"
                    aria-describedby="techStack-error"
                    placeholder="MongoDB, ExpressJs, React"
                    className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary w-full"
                  />
                  <Button
                    content={"Add"}
                    customCss={"rounded text-sm px-4 py-1"}
                    handleClick={addTechStack}
                  />
                </div>
                <ul className="flex flex-col gap-2">
                  {formDetails.techStack.map((ele) => (
                    <li
                      className="flex justify-between items-center shadow hover:shadow-md rounded p-2 gap-2"
                      key={ele}
                    >
                      {ele}
                      <RxCross2 className="cursor-pointer" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-4 justify-between">
            <div className="flex gap-1 justify-between items-center">
              <label
                htmlFor="longDescription"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Enter Long Description about Project!
              </label>
              <Button
                content={"Add"}
                customCss={"rounded text-sm px-4 py-1"}
                handleClick={addLongDescription}
              />
            </div>
            <div className="flex flex-col basis-1/2 gap-2">
              <textarea
                type="text"
                onChange={(e) => setLongDescription(e.target.value)}
                value={longDescription}
                id="longDescription"
                name="longDescription"
                rows="7"
                aria-required="true"
                placeholder="Write your steps here..."
                className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary w-full resize-none"
              ></textarea>
              {/* All added longDescription */}
              <ul className="flex flex-col gap-2">
                {formDetails.longDescription.map((ele, i) => (
                  <li
                    className="flex justify-between items-start gap-4 shadow hover:shadow-md rounded p-2"
                    key={`step-${i}`}
                  >
                    <div className="flex flex-col">
                      <h3 className="font-bold">Step {i + 1}</h3>
                      <p className="text-sm text-gray-700">{ele}</p>
                    </div>
                    <div>
                      <RxCross2
                        className="cursor-pointer"
                        size={20}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Button
            content={"Add project"}
            type={"submit"}
            customCss={"rounded px-4 py-1 max-w-max"}
            loading={isLoading}
          />
        </div>
        <hr className="block md:hidden mt-6" />
        {/* Upload project image */}
        <div className="basis-1/3 rounded-xl shadow-md hover:shadow-primary hover:shadow flex justify-center items-center w-full p-8 max-h-[300px]">
          <label
            htmlFor="image"
            className="font-bold cursor-pointer flex flex-col justify-center items-center w-full"
          >
            <div
              className={formDetails.image ? "w-[65%] mb-2" : "w-[30%] mb-6"}
            >
              {progress > 0 && progress < 100 ? (
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  color="warning"
                />
              ) : (
                <img
                  src={formDetails.image || photo}
                  alt="upload photo"
                  className="w-full "
                />
              )}
            </div>
            <p className="text-center">
              Drag your image here, or
              <span className="text-primary"> browse</span>
            </p>
          </label>
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      </form>
    </section>
  );
};

export default AddProject;
