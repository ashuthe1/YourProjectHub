import { apiSlice } from "../../redux/apiSlice";

export const ProjectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProject: builder.query({
      query: (ProjectId) => `/project/${ProjectId}`,
      providesTags: ["Projects"],
    }),
    getProjects: builder.query({
      query: () => "/Project",
      providesTags: ["Projects"],
    }),
    addProject: builder.mutation({
      query: (ProjectData) => ({
        url: "/Project",
        method: "POST",
        body: { ...ProjectData },
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation({
      query: (args) => {
        const { ProjectId, ...ProjectData } = args;
        return {
          url: `/project/${ProjectId}`,
          method: "PUT",
          body: { ...ProjectData },
        };
      },
      invalidatesTags: ["Projects"],
    }),
    rateProject: builder.mutation({
      query: (args) => {
        const { ProjectId, rating } = args;
        return {
          url: `/project/rate/${ProjectId}`,
          method: "PUT",
          body: { rating },
        };
      },
      invalidatesTags: ["Projects"],
    }),
    deleteProject: builder.mutation({
      query: (ProjectId) => ({
        url: `/project/${ProjectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
    commentProject: builder.mutation({
      query: (args) => {
        const { ProjectId, comment } = args;
        return {
          url: `/project/comment/${ProjectId}`,
          method: "PUT",
          body: { comment },
        };
      },
      invalidatesTags: ["Projects"],
    }),
    deleteCommentProject: builder.mutation({
      query: (args) => {
        const { ProjectId, commentId } = args;
        return {
          url: `/project/comment/${ProjectId}/${commentId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Projects"],
    }),
    toggleFavorite: builder.mutation({
      query: ({ ProjectId }) => {
        return {
          url: `/project/favorite/${ProjectId}`,
          method: "PUT",
        };
      },
      invalidatesTags: ["Projects"],
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
} = ProjectApiSlice;
