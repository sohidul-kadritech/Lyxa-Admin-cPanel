import React from "react";
import { Card, CardBody } from "reactstrap";
import styled from "styled-components";





const DashboardCard = ({ title, value, icon, border }) => {
    console.log({ border });
    return (
        <React.Fragment>
            <Card className="mini-stat" style={{ height: '140px' }}>
                <CardBody>
                    <Wrapper border={border}>
                        <h5 className="font-size-14">
                            {title}
                        </h5>

                        <div className="border"></div>

                        <div className="d-flex mt-2">
                            <div className="img_wrapper">
                                <img src={icon} alt="" />
                            </div>

                            <h4 className="value">
                                {value ?? 0}

                            </h4>
                        </div>
                    </Wrapper>



                </CardBody>
            </Card>
        </React.Fragment>
    )


}

const Wrapper = styled.div`


    .border{
       border-bottom:  ${({ border }) => `2px solid ${border} !important`};
       width: 20px
    }

    .img_wrapper{
        width: 65px;
        height: 65px;

        img{
            width: 100%;
            heigth: 100%;
        }
    }

    .value{
        padding-left: 20px;
        font-weight: 28px;
    }
`


export default DashboardCard;
