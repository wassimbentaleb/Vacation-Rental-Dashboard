import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Col, Space, Divider, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from '../../../config/axios'

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    }
}

function HomeModalContent(props) {

    const { selectedRecord, onSubmit } = props
    const [fileList, setFileList] = useState([])
    const [form] = Form.useForm();

    const onFinish = (values) => {
        onSubmit(values)
        form.resetFields()
        setFileList([])
    }



    const handleFileListChange = (data) => {
        setFileList(data.fileList)
    }

    const handleUploadAction = (options) => {
        const data = new FormData()
        data.append('file', options.file)

        const config = {
            "headers": {
                "content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s'
            }
        }

        axios.post('/upload', data, config)
            .then((res) => {
                options.onSuccess(res.data.url, options.file)

                const lastFileItem = fileList[fileList.length - 1]
                lastFileItem.url = res.data.url
                lastFileItem.status = 'done'

                const newFileList = [...fileList.slice(0, -1), lastFileItem]

                setFileList(newFileList)
            })
            .catch(err => {
                console.log(err);
            })

    }

    useEffect(() => {
        if (selectedRecord) {
            const photosList = selectedRecord.photos.map((item, index) => {
                return { uid: index, url: item }
            })

            setFileList(photosList)
            form.setFieldsValue(selectedRecord)
        }
    }, [selectedRecord])

    return (
        <div>
            <Form {...layout} form={form} name="nest-messages" onFinish={onFinish} >
                <Form.Item
                    name='referance'
                    label="Referance"
                    rules={[{ required: true, message: 'Please enter referance!' }]} >
                    <Input />
                </Form.Item>

                <Form.Item
                    name='region'
                    label="Region"
                    rules={[{ required: true, message: 'Please enter region!' }]}  >
                    <Input />
                </Form.Item>

                <Form.Item
                    name='type'
                    label="Type"
                    rules={[{ required: true, message: 'Please enter type!' }]}  >
                    <Input />
                </Form.Item>

                <Form.Item
                    name='price'
                    label="Price"
                    rules={[{ required: true, message: 'Please enter price!' }]}  >
                    <InputNumber />
                </Form.Item>

                <Form.Item name='photos' label="Photos">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleFileListChange}
                        customRequest={handleUploadAction}
                    >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </Upload>
                </Form.Item>

                <Form.Item name='description' label="Description">
                    <Input.TextArea />
                </Form.Item>

                <Divider />

                <Col span={12} offset={17}>
                    <Space >
                        <Button onClick={props.onCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit">OK</Button>
                    </Space>
                </Col>
            </Form>
        </div>
    )
}

export default HomeModalContent;