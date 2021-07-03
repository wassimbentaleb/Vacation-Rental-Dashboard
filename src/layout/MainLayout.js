import { Layout, Menu } from 'antd';
import { Switch, Route, Link } from 'react-router-dom'
import { LogoutOutlined } from '@ant-design/icons';
import axios from '../config/axios'

import HomeManagement from '../views/HomeManagement/HomeManagement.js'
import ReservationManagement from '../views/ReservationManagement/ReservationManagement.js'
import About from '../views/About/About.js'
import Login from '../views/Login/Login.js'

function MainLayout(props) {
    const { Header, Content, Footer } = Layout

    const handleLogout = async () => {
        const response = await axios.post('/logout')

        if (response.status === 200) {
            localStorage.setItem('connected', false)
            localStorage.setItem('token', null)
            window.location.reload()
        }
    }

    const connected = localStorage.getItem('connected') === 'true'

    if (!connected)
        return <Login />
    else
        return (
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <Link to='/'>Home Management</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to='/reservations'>Reservation Management</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to='/about'>About</Link>
                        </Menu.Item>
                        <Menu.Item key="4" onClick={handleLogout}>
                            <LogoutOutlined /> Logout
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <br />
                    <br />
                    <div className="site-layout-content">
                        <Switch>
                            <Route path='/' component={HomeManagement} exact />
                            <Route path='/reservations' component={ReservationManagement} />
                            <Route path='/about' component={About} />
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Vacation Rental ©2021 Created by Aycer & Wassim</Footer>
            </Layout>

        )
}

export default MainLayout;