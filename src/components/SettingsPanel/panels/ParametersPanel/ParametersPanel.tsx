import { useState, useEffect } from "react";
import type { ParametersPanelProps } from "./types";
import {
    Container,
    DataInputContainer,
    Emasure,
    Input,
    InputText,
    Tab,
    TabsContainer,
} from "./styles";

export const ParametersPanel = ({
    setType,
    initialConditions,
    setInitialConditins,
    aParams,
    setAParams,
    f0Params,
    setF0Params,
    mParams,
    setMParams,
}: ParametersPanelProps) => {
    const [articleSystem, setArticleSystem] = useState(
        () => localStorage.getItem("type") === "true",
    );

    useEffect(() => {
        const a = localStorage.getItem("A");
        const b = localStorage.getItem("B");
        const c = localStorage.getItem("C");
        if (!(a && b && c)) {
            localStorage.setItem("A", "1.5");
            localStorage.setItem("B", "1");
            localStorage.setItem("C", "0");
            localStorage.setItem("delta", "1.3");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("type", String(articleSystem));
        setType(articleSystem);
    }, [articleSystem, setType]);
    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <TabsContainer $active={articleSystem}>
                <Tab onClick={() => setArticleSystem(false)}>
                    Классическая модель регулятора
                </Tab>
                <Tab onClick={() => setArticleSystem(true)}>
                    Модель с<br /> сервомотором
                </Tab>
            </TabsContainer>
            {articleSystem && (
                <DataInputContainer>
                    <InputText>
                        <div>Коэффициент A</div>{" "}
                        <Input
                            defaultValue={localStorage.getItem("A") || 1.5}
                            onChange={(e) => {
                                localStorage.setItem("A", e.target.value);
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Коэффициент B</div>
                        <Input
                            defaultValue={localStorage.getItem("B") || 1}
                            onChange={(e) => {
                                localStorage.setItem("B", e.target.value);
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Коэффициент C</div>
                        <Input
                            defaultValue={localStorage.getItem("C") || 0}
                            onChange={(e) => {
                                localStorage.setItem("C", e.target.value);
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Коэффициент сервомотора (δ)</div>
                        <Input
                            defaultValue={localStorage.getItem("delta") || 1.3}
                            onChange={(e) => {
                                localStorage.setItem("delta", e.target.value);
                            }}
                        />
                    </InputText>
                    <InputText>
                        <div>Начальные данные</div>
                        <Input
                            defaultValue={
                                localStorage.getItem("initial") ||
                                "0; 0; -0.65; 0"
                            }
                            onChange={(e) => {
                                localStorage.setItem("initial", e.target.value);
                            }}
                        />
                    </InputText>
                </DataInputContainer>
            )}
            {!articleSystem && (
                <DataInputContainer>
                    <InputText>
                        <div>
                            Угловая <br />
                            скорость ώ
                        </div>
                        <Input
                            defaultValue={initialConditions[0]}
                            onChange={(e) => {
                                setInitialConditins([
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
                            defaultValue={aParams}
                            onChange={(e) => {
                                setAParams(Number(e.target.value));
                            }}
                        />
                        <Emasure>Н/кг*мс^2</Emasure>
                    </InputText>
                    <InputText>
                        <div>Внешняя сила</div>{" "}
                        <Input
                            defaultValue={f0Params}
                            onChange={(e) => {
                                setF0Params(Number(e.target.value));
                            }}
                        />
                        <Emasure>Н</Emasure>
                    </InputText>
                    <InputText>
                        <div>Масса</div>{" "}
                        <Input
                            defaultValue={mParams}
                            onChange={(e) => {
                                setMParams(Number(e.target.value));
                            }}
                        />
                        <Emasure>Кг</Emasure>
                    </InputText>
                </DataInputContainer>
            )}
        </Container>
    );
};
