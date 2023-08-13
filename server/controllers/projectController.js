const Project = require("../models/projectModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const getAllProjects = async (req, res, next) => {
  try {
    const recipes = await Project.find()
      .sort({ createdAt: -1 })
      .populate("author", "name");
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const recipe = await Project.findOne({ _id: req.params.id })
      .populate("author", "name")
      .populate("comments.user", ["name", "profilePicture"]);
    res.status(200).send(recipe);
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
      techStack,
      longDescription,
    } = req.body;
    if (
      !title ||
      !image ||
      !description ||
      !calories ||
      !cookingTime ||
      !techStack.length
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }
    const recipe = Project({ ...req.body, author: req.user });
    await recipe.save();
    res.status(201).json({ success: "Project added successfully" });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const {
      title,
      image,
      description,
      calories,
      cookingTime,
      techStack,
      longDescription,
    } = req.body;
    if (
      !title ||
      !image ||
      !description ||
      !calories ||
      !cookingTime ||
      !techStack ||
      !longDescription
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }
    const recipe = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

const rateProject = async (req, res, next) => {
  try {
    const { rating } = req.body;

    const recipe = await Project.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Check if the user has already rated this recipe
    const existingRating = recipe.ratings.find((rate) =>
      rate.user.equals(req.user)
    );
    if (existingRating) {
      return res
        .status(400)
        .json({ error: "User has already rated this recipe" });
    }

    // Add the new rating
    recipe.ratings.push({ user: req.user, rating: rating });
    await recipe.save();

    res.status(201).json({ message: "Rating added successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const recipe = await Project.findOneAndDelete({ _id: req.params.id });
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

    const recipe = await Project.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Add the new comment
    recipe.comments.push({ user: req.user, comment });
    await recipe.save();

    res.status(201).json({ message: "Comment added successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { recipeId, commentId } = req.params;

    const recipe = await Project.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Project not found." });
    }

    const commentIndex = recipe.comments.findIndex((comment) =>
      comment._id.equals(commentId)
    );
    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found." });
    }

    recipe.comments.splice(commentIndex, 1);
    await recipe.save();

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

    const recipeIndex = user.favorites.indexOf(req.params.id);
    if (recipeIndex === -1) {
      // Project not present, add it to favorites
      user.favorites.push(req.params.id);
    } else {
      // Project already present, remove it from favorites
      user.favorites.splice(recipeIndex, 1);
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
