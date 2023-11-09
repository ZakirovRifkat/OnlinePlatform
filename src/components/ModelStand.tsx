import { Slider } from "@mui/material";
import styled from "styled-components";
import { ModelCard } from "./ModelCard";
const marks = [
    {
        value: 0,
        label: "5см",
    },
    {
        value: 25,
        label: "10см",
    },
    {
        value: 50,
        label: "15см",
    },
    {
        value: 75,
        label: "25см",
    },
    {
        value: 100,
        label: "30см",
    },
];
export const ModelStand = () => {
    function valuetext(value: number) {
        return `${value}см`;
    }

    function valueLabelFormat(value: number) {
        return marks.findIndex((mark) => mark.value === value) + 1;
    }
    return (
        <Container>
            <DataContainer>
                <Title>Интерактивная модель</Title>
                <DataInputContainer>
                    <InputText>
                        <div>Угловая скорость ώ</div> <Input />
                        <div style={{ textAlign: "end", width: "120px" }}>
                            рад/с
                        </div>
                    </InputText>
                    <InputText>
                        <div>Коэффициент трения</div> <Input />
                        <div style={{ textAlign: "end", width: "120px" }}>
                            Н/кг*мс^2
                        </div>
                    </InputText>
                    <InputText>
                        <div>Ещё параметр</div> <Input />
                        <div style={{ textAlign: "end", width: "120px" }}>
                            Н/кг*мс^2
                        </div>
                    </InputText>
                    <InputText>
                        <div>Длина рычага</div>
                        <Slider
                            style={{
                                boxSizing: "border-box",
                                margin: "0 16px",
                                width: "200px",
                            }}
                            aria-label="Restricted values"
                            defaultValue={20}
                            valueLabelFormat={valueLabelFormat}
                            getAriaValueText={valuetext}
                            step={null}
                            valueLabelDisplay="auto"
                            marks={marks}
                        />
                        <div style={{ textAlign: "end", width: "120px" }}>
                            см
                        </div>
                    </InputText>
                    <ButtonContainer>
                        <Button $color={"red"}>Сброс</Button>
                        <Button $color={"blue"}>Запуск</Button>
                    </ButtonContainer>
                </DataInputContainer>
            </DataContainer>
            <ModelCard />
        </Container>
    );
};

const Container = styled.div`
    width: var(--container);
    max-width: var(--max-container);
    margin: auto;
    display: flex;
    gap: 60px;
`;
const DataContainer = styled.div`
    width: 38%;
    display: flex;
    flex-direction: column;
`;
const Title = styled.div`
    color: rgba(0, 0, 0, 0.8);
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: 144.523%;
    letter-spacing: 0.52px;
`;
const DataInputContainer = styled.div`
    display: flex;

    flex-direction: column;
    gap: 40px;
    margin-top: 40px;
`;
const Input = styled.input`
    border-radius: 10px;
    border: 1px solid rgba(5, 0, 255, 0.79);
    outline: none;

    background: transparent;

    width: 150px;
    height: 100%;

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
