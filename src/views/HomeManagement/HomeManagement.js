import React, { useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { Table, Input, Button, Space, DatePicker, Modal, Calendar, Row } from 'antd';
import { SearchOutlined, PlusOutlined, CalendarOutlined, UnorderedListOutlined, SettingOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import HomeModalContent from './components/HomeModalContent'
import axios from '../../config/axios'



function HomeManagement(props) {

    // -------------- State definition

    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isCalenderModalVisible, setIsCalenderModalVisible] = useState(false);
    const [data, setData] = useState([])



    // -------------- Variable definition


    const { RangePicker } = DatePicker
    let searchInput


    // -------------- Handle table search functions

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
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
        clearFilters()
        setSearchText('')
    }


    // -------------- Handle componenet mounting

    const handleGetHomes = async () => {
        console.log('Componenet is mounting')

        await axios.get('/verifyAccess')
        const response = await axios.get('/homes')
        setData(response.data)
    }

    useEffect(() => {
        handleGetHomes()
    }, [])


    // -------------- Add Modal functions

    const showAddModal = () => {
        setIsAddModalVisible(true);
    }

    const handleCancelAddModal = () => {
        setIsAddModalVisible(false);
    }

    const handleAddHome = async (values) => {
        if (values.photos)
            values.photos = values.photos.fileList.map(item => item.response || item.url)

        const response = await axios.post('/home', values)

        const newHome = response.data
        const newData = [...data, newHome]

        setData(newData)
        setIsAddModalVisible(false);
    }


    // -------------- Edit Modal functions

    const showEditModal = (record) => {
        setSelectedRecord(record)
        setIsEditModalVisible(true)
    }

    const handleCancelEditModal = () => {
        setIsEditModalVisible(false);
    }

    const handleEditHome = async (values) => {
        if (values.photos.fileList)
            values.photos = values.photos.fileList.map(item => item.response || item.url)

        values._id = selectedRecord._id
        const response = await axios.put('/home/' + values._id, values)
        const newData = [...data]
        const index = newData.findIndex((item) => { return item._id === selectedRecord._id })

        newData[index] = values
        setData(newData)

        console.log(values)
        setIsEditModalVisible(false)
        setSelectedRecord(null)
    }

    // -------------- Calender Modal functions

    const showCalenderModal = () => {
        setIsCalenderModalVisible(true)
    }

    const handleCancelCalenderModal = () => {
        setIsCalenderModalVisible(false);
    }

    const onPanelChange = (value, mode) => {
        console.log(value, mode);
    }


    // -------------- Delete functions

    const handleDeleteHome = async (record) => {

        const response = await axios.delete('/home/' + record._id)

        // step 1 : update the data
        const newData = data.filter((home) => {
            return home._id !== record._id
        })

        // step 2 : set new data to state
        setData(newData)
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
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
            width: '20%',
            ...getColumnSearchProps('region'),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            ...getColumnSearchProps('type'),
            width: '10%',
        },
        {
            title: 'Price/Night',
            dataIndex: 'price',
            key: 'price',
            width: '15%',
            ...getColumnSearchProps('price'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '20%',
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" shape="circle" icon={<CalendarOutlined />} onClick={showCalenderModal} />
                    <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} />
                    <Button type="primary" shape="circle" icon={<SettingOutlined />} onClick={() => { showEditModal(record) }} />
                    <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => { confirm(record) }} />
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Row justify="space-between" >
                <RangePicker />
                <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={showAddModal}>
                    Add new home
                </Button>
            </Row>

            <br />

            <Table columns={columns} dataSource={data.reverse()} rowKey="_id" />

            <Modal title="Add new home" visible={isAddModalVisible} footer={null} onCancel={handleCancelAddModal}>
                <HomeModalContent onSubmit={(values) => { handleAddHome(values) }} onCancel={handleCancelAddModal} />
            </Modal>

            <Modal title="Edit home" visible={isEditModalVisible} footer={null} onCancel={handleCancelEditModal}>
                <HomeModalContent selectedRecord={selectedRecord} onSubmit={(values) => { handleEditHome(values) }} onCancel={handleCancelEditModal} />
            </Modal>

            <Modal title="Availability calender" visible={isCalenderModalVisible} footer={null} onCancel={handleCancelCalenderModal} >
                <Calendar fullscreen={false} onPanelChange={onPanelChange} onCancel={handleCancelCalenderModal} />
            </Modal>
        </div>
    )
}

export default HomeManagement