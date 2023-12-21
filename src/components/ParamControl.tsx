import { motion } from "framer-motion";
import styled from "styled-components";

export const ParamControl = ({ ...props }: any) => {
    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <DataInputContainer>
                <InputText>
                    <div>Угловая скорость ώ</div>{" "}
                    <Input
                        defaultValue={props.initialConditions[0]}
                        onChange={(e) => {
                            props.setInitialConditins([
                                Number(e.target.value),
                                0,
                                1,
                            ]);
                        }}
                    />
                    <div style={{ textAlign: "end", width: "120px" }}>
                        рад/с
                    </div>
                </InputText>
                <InputText>
                    <div>Коэффициент трения</div>{" "}
                    <Input
                        defaultValue={props.aParams}
                        onChange={(e) => {
                            console.log(e.target.value);

                            props.setAParams(Number(e.target.value));
                        }}
                    />
                    <div style={{ textAlign: "end", width: "120px" }}>
                        Н/кг*мс^2
                    </div>
                </InputText>
                <InputText>
                    <div>Внешняя сила</div>{" "}
                    <Input
                        defaultValue={props.f0Params}
                        onChange={(e) => {
                            props.setF0Params(Number(e.target.value));
                        }}
                    />
                    <div style={{ textAlign: "end", width: "120px" }}>Н</div>
                </InputText>
                <InputText>
                    <div>Масса</div>{" "}
                    <Input
                        defaultValue={props.mParams}
                        onChange={(e) => {
                            props.setMParams(Number(e.target.value));
                        }}
                    />
                    <div style={{ textAlign: "end", width: "120px" }}>Кг</div>
                </InputText>

                <ButtonContainer>
                    {/* <Button
                        $color={"#c7201dd3"}
                        onClick={() => {
                            props.setPlay(false);
                            props.setMParams(1);
                            props.setF0Params(0);
                            props.setAParams(0.1);
                        }}
                    >
                        Сброс
                    </Button> */}
                    {/* <Button
                        $color={"#1310d4ca"}
                        onClick={() => {
                            props.setPlay(true);
                        }}
                    >
                        Запуск
                    </Button> */}
                </ButtonContainer>
            </DataInputContainer>
        </Container>
    );
};

const Container = styled(motion.div)`
    max-width: 520px;
    width: max-content;
    height: max-content;
    padding: 20px 10px;

    &::-webkit-scrollbar {
        width: 3px;
        background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: silver;
    }
    @media screen and (max-width: 1550px) {
        max-height: 430px;
        max-width: 470px;
    }
    @media screen and (max-width: 1200px) {
        max-height: 400px;
        max-width: 350px;
    }
`;

const DataInputContainer = styled.div`
    display: flex;

    flex-direction: column;
    gap: 20px;
    margin-top: 40px;
`;
const Input = styled.input`
    border-radius: 10px;
    border: 1px solid rgba(136, 97, 13, 0.438);
    outline: none;

    background: transparent;

    width: 150px;
    height: 100%;
    font-family: var(--font);
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0.4px;

    padding: 8px 16px;
    margin: 0 14px;
`;
const InputText = styled.div`
    color: rgba(0, 0, 0, 0.8);
    font-family: var(--font);
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
    letter-spacing: 0.4px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    div {
        width: 230px;
    }
`;
const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`;
const Button = styled.button<{ $color: string }>`
    padding: 8px 40px;
    background-color: ${(props) => props.$color};
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 144.523%; /* 28.905px */
    letter-spacing: 0.4px;
    transition: opacity 0.2s;
    cursor: pointer;
    &:hover {
        opacity: 60%;
    }
`;
