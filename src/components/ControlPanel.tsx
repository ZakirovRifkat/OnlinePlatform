import React from "react";
import styled from "styled-components";
import { InfoOutlined, LineChartOutlined, SettingOutlined, ExpandAltOutlined} from "@ant-design/icons";

export const ControlPanel = ({...props}:any) => {
    const style = {
        fontSize: "40px",
    };
    return (
        <Container>
            <ContainerIcon onClick={()=>{props.setControl(props.controlValue==='info'? null:'info')}}>
                <InfoOutlined style={style} />
            </ContainerIcon>
            <ContainerIcon onClick={()=>{props.setControl(props.controlValue==='params'? null:'params')}}>
                <LineChartOutlined style={style} />
            </ContainerIcon>
            <ContainerIcon onClick={()=>{props.setControl(props.controlValue==='graphic'? null:'graphic')}}>
                <SettingOutlined style={style} />
            </ContainerIcon>
            <ContainerIcon onClick={()=>{}}>
                <ExpandAltOutlined style={style} />
            </ContainerIcon>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 20px 10px 20px 10px;
    border-radius: 10px 0 0 10px;

    gap: 10px;
    width: max-content;
    /* width: 400px; */
    height: max-content;
    transition: all 1s;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0%, -50%);
    background-color: #ffffff;

    -webkit-box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.2);
`;
const ContainerIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    background-color: #838e9e;
    -webkit-box-shadow: 0px 0px 8px 3px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 0px 8px 3px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 8px 3px rgba(0, 0, 0, 0.2);
    &:active {
        -webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2) inset;
        -moz-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2) inset;
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2) inset;
    }
`;
