import styled from "styled-components";
import {
    InfoOutlined,
    LineChartOutlined,
    SettingOutlined,
    AimOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
} from "@ant-design/icons";
import { Tooltip, message } from "antd";
import { useNavigate } from "react-router-dom";

export const ControlPanel = ({ ...props }: any) => {
    const navigate = useNavigate();
    const style = {
        fontSize: "30px",
        color: "white",
    };
    const [messageApi, contextHolder] = message.useMessage();

    const success = (message: string) => {
        messageApi.success(message);
    };
    const warn = (message: string) => {
        messageApi.error(message);
    };
    return (
        <Container>
            {contextHolder}
            <Tooltip title={"Теория"} placement="left">
                <ContainerIcon
                    id="info"
                    onClick={() => {
                        navigate("/main/wiki");
                    }}
                >
                    <InfoOutlined style={style} />
                </ContainerIcon>
            </Tooltip>
            <Tooltip title={"Настройка системы"} placement="left">
                <ContainerIcon
                    onClick={() => {
                        props.setControl(
                            props.controlValue === "params" ? null : "params"
                        );
                    }}
                >
                    <SettingOutlined style={style} />
                </ContainerIcon>
            </Tooltip>
            <Tooltip title={"График"} placement="left">
                <ContainerIcon
                    onClick={() => {
                        props.setControl(
                            props.controlValue === "graphic" ? null : "graphic"
                        );
                    }}
                >
                    <LineChartOutlined style={style} />
                </ContainerIcon>
            </Tooltip>
            <Tooltip title={"Управление"} placement="left">
                <ContainerIcon
                    onClick={() => {
                        props.setOrbit(!props.isOrbit);
                        props.isOrbit
                            ? warn("Управление: отключено")
                            : success("Управление: включено");
                    }}
                >
                    <AimOutlined style={style} />
                </ContainerIcon>
            </Tooltip>
            <Tooltip title={"Старт/Пауза"} placement="left">
                <ContainerIcon
                    onClick={() => {
                        props.setPlay(!props.play);
                    }}
                >
                    {props.play ? (
                        <PauseCircleOutlined style={style} />
                    ) : (
                        <PlayCircleOutlined style={style} />
                    )}
                </ContainerIcon>
            </Tooltip>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 20px 10px 20px 10px;
    border-radius: 10px 0 0 10px;

    gap: 16px;
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

    @media screen and (max-width: 600px) {
        top: 100%;
        transform: translateY(-100%);
        left: 0;
        width: 100%;
        justify-content: space-around;
        flex-direction: row;
        box-sizing: border-box;
        border-radius: 10px 10px 0 0;
    }
    #info {
        @media screen and (max-width: 600px) {
            display: none;
        }
    }
`;
const ContainerIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-color: #52380aa2;
    -webkit-box-shadow: 0px 0px 8px 3px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 0px 8px 3px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 8px 3px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #52380ad8;
        -webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2) inset;
        -moz-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2) inset;
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2) inset;
    }
`;
