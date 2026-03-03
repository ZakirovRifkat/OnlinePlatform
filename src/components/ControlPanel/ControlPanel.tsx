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
import type { ControlPanelProps } from "./types";
import { Container, ContainerIcon } from "./styles";

const ICON_STYLE = {
    fontSize: "30px",
    color: "white",
};

export const ControlPanel = (props: ControlPanelProps) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const success = (message: string) => {
        messageApi.success(message);
    };
    const warn = (message: string) => {
        messageApi.error(message);
    };

    const toggleControl = (value: "params" | "graphic") => {
        props.setControl(props.controlValue === value ? null : value);
    };

    const toggleOrbit = () => {
        props.setOrbit(!props.isOrbit);
        props.isOrbit
            ? warn("Управление: отключено")
            : success("Управление: включено");
    };

    const togglePlay = () => {
        props.setPlay(!props.play);
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
                    <InfoOutlined style={ICON_STYLE} />
                </ContainerIcon>
            </Tooltip>
            <Tooltip title={"Настройка системы"} placement="left">
                <ContainerIcon onClick={() => toggleControl("params")}>
                    <SettingOutlined style={ICON_STYLE} />
                </ContainerIcon>
            </Tooltip>
            <Tooltip title={"График"} placement="left">
                <ContainerIcon onClick={() => toggleControl("graphic")}>
                    <LineChartOutlined style={ICON_STYLE} />
                </ContainerIcon>
            </Tooltip>
            <Tooltip title={"Управление"} placement="left">
                <ContainerIcon onClick={toggleOrbit}>
                    <AimOutlined style={ICON_STYLE} />
                </ContainerIcon>
            </Tooltip>
            <Tooltip title={"Старт/Пауза"} placement="left">
                <ContainerIcon onClick={togglePlay}>
                    {props.play ? (
                        <PauseCircleOutlined style={ICON_STYLE} />
                    ) : (
                        <PlayCircleOutlined style={ICON_STYLE} />
                    )}
                </ContainerIcon>
            </Tooltip>
        </Container>
    );
};
