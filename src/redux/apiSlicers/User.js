import { apiSlice } from "./_index";

const TypeName = "User"
const TypeAPI = "user"

const extendedApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => TypeAPI,
            providesTags: [TypeName]
        }),
        getUserByEmail: builder.query({
            query: (email) => `${TypeAPI}/${email}`,
            providesTags: [TypeName]
        }),
        updateUser: builder.mutation({
            query: (item) => ({
                url: `${TypeAPI}/update/${item.id}`,
                method: 'PUT',
                body: item,
            }),
            invalidatesTags: ["TypeName"]
        }),

    }),
    overrideExisting: false,
})

export const { useGetUsersQuery, useGetUserByEmailQuery } = extendedApi;