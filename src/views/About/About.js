import React from 'react'
import { Card, Row, Col, Typography } from 'antd';

import wassimImage from '../../assets/images/wes-info.png'
import aycerImage from '../../assets/images/aycer.png'

const { Meta } = Card;
const { Title, Text } = Typography;

function About(props) {
    return (
        <div>

            <Typography>
                <Title>Vacation Rental</Title>
                <Text>
                    In the context of GoMyCode Lab Phase, we have created a fully functional web application using
                </Text>
                <br />
                <Text>
                    the MERN stack that will integrate all the knowledge and skills acquired during the amazing training.
                </Text>
            </Typography>

            <br />
            <br />

            <Row justify="space-around" align="middle">
                <Col span={4}>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={aycerImage} />}
                    >
                        <Meta title="Aycer Lajili" description="github.com/AycerLaajili" />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={wassimImage} />}
                    >
                        <Meta title="Wassim Ben Taleb" description="github.com/Wassim-7" />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default About