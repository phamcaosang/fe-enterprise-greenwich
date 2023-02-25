import React, { useState, useEffect } from 'react'
import locale from "antd/lib/date-picker/locale/vi_VN";
import "dayjs/locale/vi"
import { GrView } from "react-icons/gr"
import { LikeOutlined, DislikeOutlined, MessageOutlined, } from '@ant-design/icons';
import { Badge, Button, DatePicker, Divider, Dropdown, Form, Input, message, Modal, Select, Space, Table, Tag } from 'antd';
import { useGetTopicsQuery, useUpdateTopicMutation } from '@/redux/apiSlicers/Topic';
import { ParseDate } from '@/utils/dataParser';
import { validateMessages } from '@/utils/validateMessage';
import dayjs from 'dayjs';
const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);


const ModalEdit = ({ isModalOpen, setIsModalOpen, dataView, setDataView }) => {
    const [updateTopic, { isLoading }] = useUpdateTopicMutation()
    const dateFormat = 'DD MMM, YYYY'
    const [form] = Form.useForm()
    const handleSubmit = (values) => {
        const submitData = {
            id: dataView.id,
            name: values.name,
            openDate: values.date[0].$d,
            closureDateIdea: values.date[1].$d,
            closureDateTopic: values.closureDateTopic.$d
        }
        console.log(submitData)
        updateTopic(submitData).unwrap().then(res => {
            form.resetFields()
            setIsModalOpen(false)
            setDataView(null)
            message.success("Topic Updated")
        }).catch(res => {
            console.log(res)
            message.error("Failed to update topic")
        })
    }
    useEffect(() => {
        console.log(dataView)
        form.setFieldsValue({
            department: dataView?.Department.name,
            name: dataView?.name,
            date: [dayjs(dataView?.openDate, 'YYYY-MM-DD'), dayjs(dataView?.closureDateIdea, 'YYYY-MM-DD')],
            closureDateTopic: dayjs(dataView?.closureDateTopic, 'YYYY-MM-DD')
        })
    }, [dataView])

    return <Modal title="EDIT TOPIC" open={isModalOpen} onCancel={() => setIsModalOpen(false)} width={600}
        footer={[
            <Button key="Close" onClick={() => setIsModalOpen(false)}>Close</Button>,
            <Button key="Save" type='primary' onClick={() => form.submit()}
                loading={isLoading}
            >Save Changes</Button>,
        ]}
    >
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form} onFinish={handleSubmit} validateMessages={validateMessages}>
            <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                <Input disabled />
            </Form.Item>
            <Form.Item label="Topic Name" name="name" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Idea Dates" name="date" rules={[{ required: true }]}>
                <DatePicker.RangePicker locale={locale} format={'DD MMM, YYYY'} />
            </Form.Item>
            <Form.Item label="Close Date Topic" name="closureDateTopic" rules={[{ required: true }]}>
                <DatePicker locale={locale} format={dateFormat} />
            </Form.Item>
        </Form>
    </Modal >
}


export default function DepartmentTable({ department, editable = false }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataView, setDataView] = useState(null)
    const { data, isLoading } = useGetTopicsQuery(undefined, {
        selectFromResult: ({ data, isLoading }) => ({
            isLoading,
            data: department === true ? data : data?.filter(i => i.Department?.id === department.id)
        })
    })
    const expandedRowRender = () => {
        const columns = [
            {
                title: 'Idea',
                dataIndex: 'idea',
                key: 'idea',
                width: "40%",
            },
            {
                title: 'Submittor',
                dataIndex: 'creator',
                key: 'creator',
                width: "15%"
            },
            {
                title: 'Submit Date',
                dataIndex: 'date',
                key: 'date',
                width: "15%"
            },
            {
                title: "Reaction",
                dataIndex: 'reaction',
                key: 'reaction',
                width: "20%",
                render: () => (
                    <Space size="middle">
                        <IconText icon={GrView} text="1000" key="list-vertical-view-o" />
                        <IconText icon={LikeOutlined} text="150" key="list-vertical-like-o" />
                        <IconText icon={DislikeOutlined} text="30" key="list-vertical-dislike-o" />
                        <IconText icon={MessageOutlined} text="500" key="list-vertical-message" />
                    </Space>
                ),
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                key: 'operation',
                width: "10%",
                render: () => (
                    <Space size="middle">
                        <a>View Detail</a>

                        {/* <a>Stop</a> */}
                        {/* <Dropdown
                            menu={{
                                items,
                            }}
                        >
                            <a>
                                More <DownOutlined />
                            </a>
                        </Dropdown> */}
                    </Space>
                ),
            },
        ];
        const data = [];
        for (let i = 0; i < 3; ++i) {
            data.push({
                key: i.toString(),
                idea: "This is idea description for topic, i want to go to Thailand trip since the variety of food",
                date: '2014-12-24 23:12:00',
                creator: 'pcs@gmail.com',
                upgradeNum: 'Upgraded: 56',
            });
        }
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };
    const additionalColumns = department === true ? [
        {
            title: 'Department',
            dataIndex: 'Department',
            key: 'Department',
            width: "15%",
            render: (value, record) => {
                return <>
                    {value.name}
                </>
            }
        },
    ] : []

    const columns = [
        {
            title: 'Topic',
            dataIndex: 'name',
            key: 'name',
            width: "30%"
        },
        {
            title: 'Creator',
            dataIndex: 'User',
            key: 'User',
            width: "15%",
            render: (value, record) => {
                return <>
                    {value.name}
                </>
            }
        },
        ...additionalColumns,
        {
            title: 'Open Date',
            dataIndex: 'openDate',
            key: 'openDate',
            width: "15%",
            render: (value, record) => {
                return <>{ParseDate(value)}</>
            }
        },
        {
            title: 'Close Date Idea',
            dataIndex: 'closureDateIdea',
            key: 'closureDateIdea',
            width: "15%",
            render: (value, record) => {
                return <>{ParseDate(value)}</>
            }
        },
        {
            title: 'Close Date Topic',
            dataIndex: 'closureDateTopic',
            key: 'closureDateTopic',
            width: "15%",
            render: (value, record) => {
                return <>{ParseDate(value)}</>
            }
        },
        editable ? {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: "10%",
            render: (value, record) => {
                return <>
                    <Tag color="blue" style={{ cursor: "pointer" }}
                        onClick={() => {
                            setDataView(record)
                            setIsModalOpen(true)
                        }}
                    >Edit</Tag>
                </>
            }
        } : {}

    ];
    console.log(data)

    return (
        <>
            <Divider>
                <span style={{ fontSize: 24 }}>
                    Table Of Topics And Ideas
                </span>
            </Divider>
            <Table
                pagination={{ pageSize: 5 }}
                loading={isLoading}
                style={{
                    width: "100%"
                }}
                columns={columns}
                expandable={{
                    expandedRowRender,
                    defaultExpandedRowKeys: ['0'],
                }}
                dataSource={data}
                rowKey={(record) => record.id}
            />
            <ModalEdit isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} dataView={dataView} setDataView={setDataView} />
        </>
    )
}