import { useGetUserByEmailQuery } from '@/redux/apiSlicers/User'
import { Empty, Skeleton, Spin } from 'antd'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Layout from "../components/Layout/Index"
import Admin from "../components/Privilege/Admin"
import Coordinatior from "../components/Privilege/Coordinator"
import Manager_Head from "../components/Privilege/Manager_Head"


export default function Privilege() {
    const [role, setRole] = useState(null)
    const { data: session, status } = useSession()
    const { data: User, isLoading, isSuccess } = useGetUserByEmailQuery(session?.user.email, {
        skip: !status === "authenticated"
    })
    useEffect(() => {
        if (isSuccess) {
            setRole(User?.Role?.name)
        }
    }, [isSuccess])

    return (
        <Layout>
            <div className='privilegeWrapper'>
                {role === null && <Spin tip="Loading" size="large" style={{ margin: "300px auto 0 auto" }} />}
                {role === "admin" && <Admin role={role} />}
                {role === "coordinator" && <Coordinatior />}
                {["manager", "head"].includes(role) && <Manager_Head role={role} />}
            </div>
        </Layout>
    )
}