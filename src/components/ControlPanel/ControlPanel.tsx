import {
    InfoOutlined,
    LineChartOutlined,
    SettingOutlined,
    AimOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
} from "@ant-design/icons";
import { Tooltip, message } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useContentUiStore } from "../../store/contentStore";
import { Container, ContainerIcon } from "./styles";

const ICON_STYLE = {
    fontSize: "30px",
    color: "white",
};

export const ControlPanel = observer(() => {
    const uiStore = useContentUiStore();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const success = (message: string) => {
        messageApi.success(message);
    };
    const warn = (message: string) => {
        messageApi.error(message);
    };

    const toggleOrbit = () => {
        const nextOrbit = !uiStore.isOrbit;
        uiStore.setOrbit(nextOrbit);
        nextOrbit
            ? success("Управление: включено")
            : warn("Управление: отключено");
    };

    const togglePlay = () => {
        uiStore.togglePlay();
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
                <ContainerIcon onClick={() => uiStore.toggleControl("params")}>
                    <SettingOutlined style={ICON_STYLE} />
                </ContainerIcon>
            </Tooltip>
            <Tooltip title={"График"} placement="left">
                <ContainerIcon onClick={() => uiStore.toggleControl("graphic")}>
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
                    {uiStore.isPlay ? (
                        <PauseCircleOutlined style={ICON_STYLE} />
                    ) : (
                        <PlayCircleOutlined style={ICON_STYLE} />
                    )}
                </ContainerIcon>
            </Tooltip>
        </Container>
    );
});
