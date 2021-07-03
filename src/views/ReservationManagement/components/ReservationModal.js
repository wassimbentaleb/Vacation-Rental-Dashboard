import React, { useEffect } from 'react';
import moment from 'moment';
import { Form, Input, InputNumber, Button, Select, DatePicker, Col, Space, Divider } from 'antd'

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    }
}


function ReservationModal(props) {

    const { selectedRecord, onSubmit, onCancel } = props
    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const [form] = Form.useForm();

    const onFinish = (values) => {
        onSubmit(values)
        form.resetFields()
    }

    useEffect(() => {
        if (selectedRecord && typeof selectedRecord.period === "string") {
            // delete selectedRecord.period
            selectedRecord.period = selectedRecord.period.split(' - ')
            selectedRecord.period[0] = moment(selectedRecord.period[0])
            selectedRecord.period[1] = moment(selectedRecord.period[1])

            form.setFieldsValue(selectedRecord)
        }
    }, [selectedRecord])

    return (
        <div>
            <Form {...layout} form={form} name="nest-messages" onFinish={onFinish} >
                <Form.Item name='period' label="Period"
                    rules={[{ required: true, message: 'Please enter period!' }]} >
                    <RangePicker />
                </Form.Item>

                <Form.Item name='clientName' label="Client Name"
                    rules={[{ required: true, message: 'Please enter client name!' }]}  >
                    <Input />
                </Form.Item>

                <Form.Item name='clientPhone' label="Client Phone"
                    rules={[{ required: true, message: 'Please enter client phone!' }]}  >
                    <Input />
                </Form.Item>

                <Form.Item name='payed' label="Payed"
                    rules={[{ required: true, message: 'Please enter payed or not payed!' }]} >
                    <Select style={{ width: 100 }} >
                        <Option value="payed">Payed</Option>
                        <Option value="not payed">Not Payed</Option>
                    </Select>
                </Form.Item>

                <Divider />

                <Col span={12} offset={17}>
                    <Space >
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit">OK</Button>
                    </Space>
                </Col>
            </Form>
        </div>
    )
}

export default ReservationModal;