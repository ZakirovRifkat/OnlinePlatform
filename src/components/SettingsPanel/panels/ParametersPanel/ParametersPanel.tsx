import { observer } from "mobx-react-lite";
import {
    useContentUiStore,
    useServoStore,
} from "../../../../store/contentStore";
import {
    Container,
    DataInputContainer,
    Emasure,
    Input,
    InputText,
    Tab,
    TabsContainer,
} from "./styles";

export const ParametersPanel = observer(() => {
    const uiStore = useContentUiStore();
    const servoStore = useServoStore();

    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <TabsContainer $active={uiStore.type}>
                <Tab onClick={() => uiStore.setType(false)}>
                    Классическая модель регулятора
                </Tab>
                <Tab onClick={() => uiStore.setType(true)}>
                    Модель с<br /> сервомотором
                </Tab>
            </TabsContainer>
            {uiStore.type && (
                <DataInputContainer>
                    <InputText>
                        <div>Коэффициент A</div>{" "}
                        <Input
                            value={servoStore.servoA}
                            onChange={(e) => {
                                servoStore.setServoA(Number(e.target.value));
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Коэффициент B</div>
                        <Input
                            value={servoStore.servoB}
                            onChange={(e) => {
                                servoStore.setServoB(Number(e.target.value));
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Коэффициент C</div>
                        <Input
                            value={servoStore.servoC}
                            onChange={(e) => {
                                servoStore.setServoC(Number(e.target.value));
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Коэффициент сервомотора (δ)</div>
                        <Input
                            value={servoStore.servoDelta}
                            onChange={(e) => {
                                servoStore.setServoDelta(
                                    Number(e.target.value),
                                );
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Начальные данные</div>
                        <Input
                            value={servoStore.servoInitial}
                            onChange={(e) => {
                                servoStore.setServoInitial(e.target.value);
                            }}
                        />
                    </InputText>
                </DataInputContainer>
            )}
            {!uiStore.type && (
                <DataInputContainer>
                    <InputText>
                        <div>
                            Угловая <br />
                            скорость ώ
                        </div>
                        <Input
                            value={uiStore.initialConditions[0]}
                            onChange={(e) => {
                                uiStore.setInitialConditions([
                                    Number(e.target.value),
                                    0,
                                    1,
                                ]);
                            }}
                        />
                        <Emasure>рад/с</Emasure>
                    </InputText>
                    <InputText>
                        <div>Коэффициент трения</div>{" "}
                        <Input
                            value={uiStore.aParams}
                            onChange={(e) => {
                                uiStore.setAParams(Number(e.target.value));
                            }}
                        />
                        <Emasure>Н/кг*мс^2</Emasure>
                    </InputText>
                    <InputText>
                        <div>Внешняя сила</div>{" "}
                        <Input
                            value={uiStore.f0Params}
                            onChange={(e) => {
                                uiStore.setF0Params(Number(e.target.value));
                            }}
                        />
                        <Emasure>Н</Emasure>
                    </InputText>
                    <InputText>
                        <div>Масса</div>{" "}
                        <Input
                            value={uiStore.mParams}
                            onChange={(e) => {
                                uiStore.setMParams(Number(e.target.value));
                            }}
                        />
                        <Emasure>Кг</Emasure>
                    </InputText>
                </DataInputContainer>
            )}
        </Container>
    );
});
