const Project = require("../models/projectModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate("author", "name");
    res.status(200).send(projects);
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id })
      .populate("author", "name")
      .populate("comments.user", ["name", "profilePicture"]);
    res.status(200).send(project);
  } catch (error) {
    next(error);
  }
};

const addProject = async (req, res, next) => {
  try {
    const {
      title,
      image,
      description,
      calories,
      cookingTime,
      techStacks,
      longDescription
    } = req.body;
    if (
      !title ||
      !image ||
      !description ||
      !calories ||
      !cookingTime ||
      !techStacks.length
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }

    const newProject = { ...req.body, author: req.user };
    console.log(newProject);

    let data = new Project({
      title:newProject.title,
      description:newProject.description,
      image:newProject.image,
      calories:newProject.calories,
      cookingTime:newProject.cookingTime,
      techStacks:newProject.techStacks,
      longDescription:newProject.longDescription,
    });
    data.save();
    res.status(201).json({ success: "Project added successfully" });
    console.log("Saved");
  } catch (error) {
    next(error);
  }
};

// const addProject = async (req, res, next) => {
//   try {
//     const {
//       title,
//       image,
//       description,
//       calories,
//       cookingTime,
//       techStacks,
//       longDescription,
//     } = req.body;
//     console.log(req.body);
//     if (
//       !title ||
//       !image ||
//       !description ||
//       !calories ||
//       !cookingTime ||
//       !techStacks.length ||
//       !longDescription
//     ) {
//       console.log("insufficient data");
//       return res.status(422).json({ message: "Insufficient data" });
//     }
//     const projectData = req.body;
//     projectData.author = req.user;
//     console.log('sabkuch Sahi');
//     console.log(projectData);
//     const newProject = await new Project(projectData);
//     // await project.save();
//     console.log("Saved");
//     console.log(newProject);
//     res.status(201).json({ success: "Project added successfully" });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

const updateProject = async (req, res, next) => {
  try {
    const {
      title,
      image,
      description,
      calories,
      cookingTime,
      techStacks,
      longDescription,
    } = req.body;
    if (
      !title ||
      !image ||
      !description ||
      !calories ||
      !cookingTime ||
      !techStacks ||
      !longDescription
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const rateProject = async (req, res, next) => {
  try {
    const { rating } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Check if the user has already rated this project
    const existingRating = project.ratings.find((rate) =>
      rate.user.equals(req.user)
    );
    if (existingRating) {
      return res
        .status(400)
        .json({ error: "User has already rated this project" });
    }

    // Add the new rating
    project.ratings.push({ user: req.user, rating: rating });
    await project.save();

    res.status(201).json({ message: "Rating added successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;

    // Validate userId and commentText
    if (!comment) {
      return res.status(400).json({ error: "Comment is required." });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Add the new comment
    project.comments.push({ user: req.user, comment });
    await project.save();

    res.status(201).json({ message: "Comment added successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { projectId, commentId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const commentIndex = project.comments.findIndex((comment) =>
      comment._id.equals(commentId)
    );
    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found." });
    }

    project.comments.splice(commentIndex, 1);
    await project.save();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    next(error);
  }
};

const toggleFavoriteProject = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projectIndex = user.favorites.indexOf(req.params.id);
    if (projectIndex === -1) {
      // Project not present, add it to favorites
      user.favorites.push(req.params.id);
    } else {
      // Project already present, remove it from favorites
      user.favorites.splice(projectIndex, 1);
    }

    await user.save();

    const roles = Object.values(user.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          roles: roles,
          favorites: user.favorites,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(201).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProject,
  addProject,
  updateProject,
  rateProject,
  deleteProject,
  addComment,
  deleteComment,
  toggleFavoriteProject,
};
