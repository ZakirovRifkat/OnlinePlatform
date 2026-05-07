import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
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
} from "./styles";

export const ParametersPanel = observer(() => {
    const uiStore = useContentUiStore();
    const servoStore = useServoStore();

    const [servoAInput, setServoAInput] = useState(String(servoStore.servoA));
    const [servoBInput, setServoBInput] = useState(String(servoStore.servoB));
    const [servoCInput, setServoCInput] = useState(String(servoStore.servoC));
    const [servoDeltaInput, setServoDeltaInput] = useState(
        String(servoStore.servoDelta),
    );
    const [omegaInput, setOmegaInput] = useState(
        String(uiStore.initialConditions[0]),
    );
    const [aInput, setAInput] = useState(String(uiStore.aParams));
    const [f0Input, setF0Input] = useState(String(uiStore.f0Params));
    const [mInput, setMInput] = useState(String(uiStore.mParams));

    useEffect(() => {
        setServoAInput(String(servoStore.servoA));
    }, [servoStore.servoA]);

    useEffect(() => {
        setServoBInput(String(servoStore.servoB));
    }, [servoStore.servoB]);

    useEffect(() => {
        setServoCInput(String(servoStore.servoC));
    }, [servoStore.servoC]);

    useEffect(() => {
        setServoDeltaInput(String(servoStore.servoDelta));
    }, [servoStore.servoDelta]);

    useEffect(() => {
        setOmegaInput(String(uiStore.initialConditions[0]));
    }, [uiStore.initialConditions]);

    useEffect(() => {
        setAInput(String(uiStore.aParams));
    }, [uiStore.aParams]);

    useEffect(() => {
        setF0Input(String(uiStore.f0Params));
    }, [uiStore.f0Params]);

    useEffect(() => {
        setMInput(String(uiStore.mParams));
    }, [uiStore.mParams]);

    const handleNumericChange = (
        value: string,
        setInput: (next: string) => void,
        onValidNumber: (next: number) => void,
    ) => {
        setInput(value);

        if (value.trim() === "") {
            return;
        }

        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            onValidNumber(parsed);
        }
    };

    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {uiStore.type && (
                <DataInputContainer>
                    <InputText>
                        <div>Коэффициент A</div>{" "}
                        <Input
                            value={servoAInput}
                            onChange={(e) => {
                                handleNumericChange(
                                    e.target.value,
                                    setServoAInput,
                                    servoStore.setServoA,
                                );
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Коэффициент B</div>
                        <Input
                            value={servoBInput}
                            onChange={(e) => {
                                handleNumericChange(
                                    e.target.value,
                                    setServoBInput,
                                    servoStore.setServoB,
                                );
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Коэффициент C</div>
                        <Input
                            value={servoCInput}
                            onChange={(e) => {
                                handleNumericChange(
                                    e.target.value,
                                    setServoCInput,
                                    servoStore.setServoC,
                                );
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Коэффициент сервомотора (δ)</div>
                        <Input
                            value={servoDeltaInput}
                            onChange={(e) => {
                                handleNumericChange(
                                    e.target.value,
                                    setServoDeltaInput,
                                    servoStore.setServoDelta,
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
                            value={omegaInput}
                            onChange={(e) => {
                                handleNumericChange(
                                    e.target.value,
                                    setOmegaInput,
                                    (next) =>
                                        uiStore.setInitialConditions([
                                            next,
                                            0,
                                            1,
                                        ]),
                                );
                            }}
                        />
                        <Emasure>рад/с</Emasure>
                    </InputText>
                    <InputText>
                        <div>Коэффициент трения</div>{" "}
                        <Input
                            value={aInput}
                            onChange={(e) => {
                                handleNumericChange(
                                    e.target.value,
                                    setAInput,
                                    uiStore.setAParams,
                                );
                            }}
                        />
                        <Emasure>Н/кг*мс^2</Emasure>
                    </InputText>
                    <InputText>
                        <div>Внешняя сила</div>{" "}
                        <Input
                            value={f0Input}
                            onChange={(e) => {
                                handleNumericChange(
                                    e.target.value,
                                    setF0Input,
                                    uiStore.setF0Params,
                                );
                            }}
                        />
                        <Emasure>Н</Emasure>
                    </InputText>
                    <InputText>
                        <div>Масса</div>{" "}
                        <Input
                            value={mInput}
                            onChange={(e) => {
                                handleNumericChange(
                                    e.target.value,
                                    setMInput,
                                    uiStore.setMParams,
                                );
                            }}
                        />
                        <Emasure>Кг</Emasure>
                    </InputText>
                </DataInputContainer>
            )}
        </Container>
    );
});
