import AnnouncementTable from "@/components/Department/AnnouncementTable";
import DepartmentTableIdeaTopic from "@/components/Department/DepartmentTableIdeaTopic";
import { useGetDepartmentByIdQuery } from "@/redux/apiSlicers/Department";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react"
import Layout from "../../components/Layout/Index"

export default function Department() {
    // const router = useRouter()
    // const { id } = router.query
    const { data, isLoading, isSuccess } = useGetDepartmentByIdQuery(dep_id, {
        skip: !dep_id
    })
    console.log(data)

    return (
        <Layout>
            <Head>
                <title>GreenDea - {data?.name}</title>
            </Head>
            <div className="departmentWrapper">
                <h1 style={{
                    textAlign: "center",
                    fontSize: 32,
                    margin: "15px 0"
                }}>
                    {data?.name}
                </h1>
                {
                    isSuccess &&
                    <>
                        <AnnouncementTable department={{ id: data.id, name: data.name }} />
                        <DepartmentTableIdeaTopic department={{ id: data.id, name: data.name }} editable={false} />
                    </>

                }

            </div>
        </Layout>
    );
}




// export async function getStaticPaths() {
//     const res = await fetch(`${process.env.BE_URL}api/department`)
//     const deps = await res.json()
//     console.log(deps)

//     // Get the paths we want to pre-render based on posts
//     const paths = deps.map((dep) => ({
//         params: { id: dep.id },
//     }))
//     return {
//         paths,
//         fallback: 'blocking', // can also be true or 'blocking'
//     }
// }

// // `getStaticPaths` requires using `getStaticProps`
// export async function getStaticProps({ params }) {
//     const res = await fetch(`${process.env.BE_URL}api/department/${params.id}`)
//     const department = await res.json()

//     // Pass post data to the page via props
//     return {
//         props: {
//             department: department,
//             dep_id: params.id
//         },
//         revalidate: 10
//     }
// }