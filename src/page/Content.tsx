import { useEffect, useState } from "react";
import { GovernorModel } from "../components/GovernorModel";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import logo from "./assets/logo.svg";
import { ControlPanel } from "../components/ControlPanel";
import { ModalControl } from "../components/ModalControl";
import { ConfigProvider } from "antd";
// Функция, представляющая систему дифференциальных уравнений регулятора Уатта
const wattGovernor = (
    variables: any,
    t: any,
    a: any,
    b: any,
    F0: any,
    m: any,
    J: any,
    beta: any,
    r: any,
    gamma0: any,
    x0: any
) => {
    const [omega, y, z] = variables;
    const dydt = [
        y,
        z,
        -a * z -
            b * y -
            (F0 / (m * J)) * (beta * m * r * omega ** 2 - gamma0 * x0),
    ];
    return dydt;
};

// Метод Рунге-Кутты четвертого порядка для численного интегрирования
const rungeKutta = (
    func: any,
    variables: any,
    t: any,
    dt: any,
    ...params: any
) => {
    const k1 = func(variables, t, ...params);
    const k2 = func(
        variables.map((v: any, i: any) => v + 0.5 * dt * k1[i]),
        t + 0.5 * dt,
        ...params
    );
    const k3 = func(
        variables.map((v: any, i: any) => v + 0.5 * dt * k2[i]),
        t + 0.5 * dt,
        ...params
    );
    const k4 = func(
        variables.map((v: any, i: any) => v + dt * k3[i]),
        t + dt,
        ...params
    );

    return variables.map(
        (v: any, i: any) =>
            v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
    );
};

export const Content = ({ ...props }: any) => {
    const [isPlay, setIsPlay] = useState(false);
    const [controlValue, setControl] = useState<null | string>(null);
    const [isOrbit, setOrbit] = useState(false);
    const [solution, setSolution] = useState<any>();

    // Начальные условия
    const [initialConditions, setInitialConditins] = useState([1.0, 0.0, 1.0]); // Угловая скорость, положение вентиля, угловое ускорение

    const [aParams, setAParams] = useState(0.1);
    const [f0Params, setF0Params] = useState(0.0);
    const [mParams, setMParams] = useState(1.0);

    const a = aParams;
    const b = 0.2;
    const F0 = f0Params;
    const m = mParams;
    const J = 1.0;
    const beta = 0.5;
    const r = 0.1;
    const gamma0 = 0.2;
    const x0 = 0.1;

    // Временные точки для решения
    const tSpan = Array.from({ length: 10000 }, (_, i) => i / 100);
    const dt = tSpan[1] - tSpan[0];
    useEffect(() => {
        // Решение системы дифференциальных уравнений методом Рунге-Кутты
        let solution = [initialConditions];
        for (let i = 1; i < tSpan.length; i++) {
            solution.push(
                rungeKutta(
                    wattGovernor,
                    solution[i - 1],
                    tSpan[i - 1],
                    dt,
                    a,
                    b,
                    F0,
                    m,
                    J,
                    beta,
                    r,
                    gamma0,
                    x0
                )
            );
        }
        setSolution(solution);
    }, [mParams, f0Params, aParams, initialConditions]);
    return (
        <AnimatePresence>
            <Container
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <GovernorModel
                    colorMap={props.colorMap}
                    displacementMap={props.displacementMap}
                    normalMap={props.normalMap}
                    roughnessMap={props.roughnessMap}
                    isModelLoaded={props.isModelLoaded}
                    setModelLoaded={props.setModelLoaded}
                    orbit={isOrbit}
                    play={isPlay}
                    solution={solution}
                />
                <Icon animate={props.isModelLoaded} alt={"logo"} src={logo} />
                <TitleMainBanner animate={props.isModelLoaded}>
                    Интерактивная онлайн–лаборатория
                </TitleMainBanner>

                <ControlPanel
                    controlValue={controlValue}
                    setControl={setControl}
                    isOrbit={isOrbit}
                    setOrbit={setOrbit}
                    setPlay={setIsPlay}
                    play={isPlay}
                />
                <ConfigProvider
                    theme={{
                        token: {
                            fontFamily: `"Cormorant Garamond", serif`,
                        },
                    }}
                >
                    <ModalControl
                        controlValue={controlValue}
                        tData={tSpan}
                        solution={solution}
                        setPlay={setIsPlay}
                        setAParams={setAParams}
                        setF0Params={setF0Params}
                        setMParams={setMParams}
                        aParams={aParams}
                        f0Params={f0Params}
                        mParams={mParams}
                        initialConditions={initialConditions}
                        setInitialConditins={setInitialConditins}
                    />
                </ConfigProvider>
                <Footer>
                    <span>
                        СПБГУ. Математико-механический факультет. Кафедра
                        прикладной кибернетики.
                    </span>
                    <span>Закиров Р.Э</span>
                </Footer>
            </Container>
        </AnimatePresence>
    );
};

const Container = styled(motion.div)`
    width: 100%;
    height: 100vh;
    position: relative;
`;
const TitleMainBanner = styled.p<{ animate: boolean }>`
    width: max-content;
    height: max-content;
    font-size: 70px;
    z-index: 2;
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;

    color: #52380a;
    text-transform: uppercase;
    font-weight: 700;
    font-family: var(--font);

    animation-name: ${(props) => (props.animate ? "anime" : "")};
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    animation-delay: 1.5s;

    @keyframes anime {
        from {
            top: 50%;
            font-size: 70px;
        }
        to {
            top: 60px;
            font-size: 45px;
        }
    }
`;
const Icon = styled.img<{ animate: boolean }>`
    width: 100px;
    height: 100px;
    opacity: 0;
    position: absolute;
    top: 60px;
    left: 6%;
    transform: translate(-50%, -50%);
    animation-name: ${(props) => (props.animate ? "animeIcon" : "")};
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    animation-delay: 2s;

    @keyframes animeIcon {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
const Footer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    padding: 0 1em;
    bottom: 0.6em;
    left: 0;
    font-family: var(--font);
    color: #00000073;
    font-size: 20px;
`;
