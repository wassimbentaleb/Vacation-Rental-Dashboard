import React, { useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { Table, Input, Button, Space, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, SettingOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import ReservationModal from './components/ReservationModal'
import axios from '../../config/axios'

function ReservationManagement(props) {

    // -------------- State definition

    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [data, setData] = useState([])

    // -------------- Variable definition
    let searchInput

    // -------------- Handle table search functions

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={'Search ${dataIndex}'}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0])
                            setSearchedColumn(dataIndex)
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890FF' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#FFC069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    })

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
    }

    // -------------- Add Modal functions

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const handleAddReservation = async (values) => {

        const fromDate = values.period[0].format("DD/MM/YYYY")
        const toDate = values.period[1].format("DD/MM/YYYY")
        values.period = fromDate + ' - ' + toDate

        const response = await axios.post('/reservation', values)

        const newReservation = response.data
        const newData = [...data, newReservation]

        setData(newData)
        setIsModalVisible(false);
    }

    // -------------- Edit Modal functions
    const showEditModal = (record) => {
        setSelectedRecord({ ...record })
        setIsEditModalVisible(true)
    }

    const handleCancelEditModal = () => {
        setIsEditModalVisible(false)
    }

    const handleEditReservation = async (values) => {

        const fromDate = values.period[0].format("DD/MM/YYYY")
        const toDate = values.period[1].format("DD/MM/YYYY")
        values.period = fromDate + ' - ' + toDate

        values._id = selectedRecord._id
        const response = await axios.put('/reservation/' + values._id, values)

        const newData = [...data]
        const index = newData.findIndex((item) => { return item._id === selectedRecord._id })

        values.referance = newData[index].referance
        newData[index] = values
        setData(newData)

        setIsEditModalVisible(false)
        setSelectedRecord(null)
    }



    const confirm = (record) => {
        Modal.confirm({
            title: ' Delete home',
            icon: <ExclamationCircleOutlined />,
            content: 'This action is not reversible, are you sure to continue',
            okText: 'OK',
            cancelText: 'Cancel',
            onOk: () => { handleDeleteHome(record) }
        });
    }

    const columns = [
        {
            title: 'Referance',
            dataIndex: 'referance',
            key: 'referance',
            width: '10%',
            ...getColumnSearchProps('referance'),
        },
        {
            title: 'Period',
            dataIndex: 'period',
            key: 'period',
            width: '20%',
            ...getColumnSearchProps('period'),
        },
        {
            title: 'Client Name',
            dataIndex: 'clientName',
            key: 'clientName',
            ...getColumnSearchProps('clientName'),
            width: '15%',
        },
        {
            title: 'Client Phone',
            dataIndex: 'clientPhone',
            key: 'clientPhone',
            width: '15%',
            ...getColumnSearchProps('clientPhone'),
        },
        {
            title: 'Payed',
            dataIndex: 'payed',
            key: 'payed',
            width: '20%',
            ...getColumnSearchProps('payed'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" shape="circle" icon={<SettingOutlined />} onClick={() => { showEditModal(record) }} />
                    <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => { confirm(record) }} />
                </Space>
            ),
        },
    ]

    // ----------------- Delete functions
    const handleDeleteHome = async (record) => {

        const response = await axios.delete('/reservation/' + record._id)

        // step 1 : update the data
        const newData = data.filter((reservation) => {
            return reservation._id !== record._id
        })
        // step 2 : set new data to state
        setData(newData)
    }


    const handleGetReservations = async () => {
        console.log('Componenet is mounting');

        await axios.get('/verifyAccess')
        const response = await axios.get('/reservations')
        setData(response.data)
    }

    useEffect(() => {
        handleGetReservations()
    }, [])

    return (
        <div>
            <div style={{ float: 'right' }}>
                <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={showModal}>
                    Add Reservation
                </Button>
            </div>

            <br />
            <br />

            <Table columns={columns} dataSource={data.reverse()} rowKey="_id" />

            <Modal title="Add new reservation" visible={isModalVisible} footer={null} onCancel={handleCancel} >
                <ReservationModal onSubmit={(values) => { handleAddReservation(values) }} onCancel={handleCancel} />
            </Modal>

            <Modal title="Edit reservation" visible={isEditModalVisible} footer={null} onCancel={handleCancelEditModal}>
                <ReservationModal selectedRecord={selectedRecord} onSubmit={(values) => { handleEditReservation(values) }} onCancel={handleCancelEditModal} />
            </Modal>
        </div>
    )
}

export default ReservationManagement;