import { apiSlice } from "../../redux/apiSlice";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProject: builder.query({
      query: (projectId) => `/project/${projectId}`,
      providesTags: ["projects"],
    }),
    getProjects: builder.query({
      query: () => "/project",
      providesTags: ["projects"],
    }),
    addProject: builder.mutation({
      query: (projectData) => ({
        url: "/project",
        method: "POST",
        body: { ...projectData },
      }),
      invalidatesTags: ["projects"],
    }),
    updateProject: builder.mutation({
      query: (args) => {
        const { projectId, ...projectData } = args;
        return {
          url: `/project/${projectId}`,
          method: "PUT",
          body: { ...projectData },
        };
      },
      invalidatesTags: ["projects"],
    }),
    rateProject: builder.mutation({
      query: (args) => {
        const { projectId, rating } = args;
        return {
          url: `/project/rate/${projectId}`,
          method: "PUT",
          body: { rating },
        };
      },
      invalidatesTags: ["projects"],
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `/project/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["projects"],
    }),
    commentProject: builder.mutation({
      query: (args) => {
        const { projectId, comment } = args;
        return {
          url: `/project/comment/${projectId}`,
          method: "PUT",
          body: { comment },
        };
      },
      invalidatesTags: ["projects"],
    }),
    deleteCommentProject: builder.mutation({
      query: (args) => {
        const { projectId, commentId } = args;
        return {
          url: `/project/comment/${projectId}/${commentId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["projects"],
    }),
    toggleFavorite: builder.mutation({
      query: ({ projectId }) => {
        return {
          url: `/project/favorite/${projectId}`,
          method: "PUT",
        };
      },
      invalidatesTags: ["projects"],
    }),
  }),
});

export const {
  useGetProjectQuery,
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useRateProjectMutation,
  useDeleteProjectMutation,
  useCommentProjectMutation,
  useDeleteCommentProjectMutation,
  useToggleFavoriteMutation,
} = projectApiSlice;
