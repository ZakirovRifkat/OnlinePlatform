import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import styled from "styled-components"

export const ParamControl = ({ ...props }: any) => {
  const [articleSystem, setArticleSystem] = useState(
    () => localStorage.getItem("type") == "true"
  )

  useEffect(() => {
    const a = localStorage.getItem("A")
    const b = localStorage.getItem("B")
    const c = localStorage.getItem("C")
    if (!(a && b && c)) {
      localStorage.setItem("A", "1")
      localStorage.setItem("B", "0.75")
      localStorage.setItem("C", "0")
      localStorage.setItem("delta", "0.5")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("type", String(articleSystem))
  }, [articleSystem])
  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TabsContainer $active={articleSystem}>
        <Tab onClick={() => setArticleSystem(false)}>
          Физическая интерпретация
        </Tab>
        <Tab onClick={() => setArticleSystem(true)}>Система с сервомотором</Tab>
      </TabsContainer>
      {articleSystem && (
        <DataInputContainer>
          <InputText>
            <div>Коэффицент A</div>{" "}
            <Input
              defaultValue={localStorage.getItem("A") || 1.5}
              onChange={(e) => {
                localStorage.setItem("A", e.target.value)
              }}
            />
          </InputText>
          <InputText>
            <div>Коэффициент B</div>
            <Input
              defaultValue={localStorage.getItem("B") || 0.75}
              onChange={(e) => {
                localStorage.setItem("B", e.target.value)
              }}
            />
          </InputText>
          <InputText>
            <div>Коэффицент C</div>
            <Input
              defaultValue={localStorage.getItem("C") || 0}
              onChange={(e) => {
                localStorage.setItem("C", e.target.value)
              }}
            />
          </InputText>
          <InputText>
            <div>Коэффициент сервомотора (δ)</div>
            <Input
              defaultValue={localStorage.getItem("delta") || 0.5}
              onChange={(e) => {
                localStorage.setItem("delta", e.target.value)
              }}
            />
          </InputText>
        </DataInputContainer>
      )}
      {!articleSystem && (
        <DataInputContainer>
          <InputText>
            <div>Угловая скорость ώ</div>{" "}
            <Input
              defaultValue={props.initialConditions[0]}
              onChange={(e) => {
                props.setInitialConditins([Number(e.target.value), 0, 1])
              }}
            />
            <div style={{ textAlign: "end", width: "120px" }}>рад/с</div>
          </InputText>
          <InputText>
            <div>Коэффициент трения</div>{" "}
            <Input
              defaultValue={props.aParams}
              onChange={(e) => {
                console.log(e.target.value)

                props.setAParams(Number(e.target.value))
              }}
            />
            <div style={{ textAlign: "end", width: "120px" }}>Н/кг*мс^2</div>
          </InputText>
          <InputText>
            <div>Внешняя сила</div>{" "}
            <Input
              defaultValue={props.f0Params}
              onChange={(e) => {
                props.setF0Params(Number(e.target.value))
              }}
            />
            <div style={{ textAlign: "end", width: "120px" }}>Н</div>
          </InputText>
          <InputText>
            <div>Масса</div>{" "}
            <Input
              defaultValue={props.mParams}
              onChange={(e) => {
                props.setMParams(Number(e.target.value))
              }}
            />
            <div style={{ textAlign: "end", width: "120px" }}>Кг</div>
          </InputText>
        </DataInputContainer>
      )}
    </Container>
  )
}

const TabsContainer = styled.div<{ $active: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 50%;
    height: 2px;
    background-color: #664e2ac5;
    left: ${(props) => (props.$active ? "50%" : "0")};
    transition: left 0.3s;
  }
`
const Tab = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  width: 50%;
  font-family: var(--font);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding-bottom: 6px;
  transition: box-shadow 0.3s;
`

const Container = styled(motion.div)`
  max-width: 520px;
  min-width: 520px;
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
    min-width: 470px;
  }
  @media screen and (max-width: 1200px) {
    max-height: 400px;
    max-width: 350px;
    min-width: 350px;
  }
`

const DataInputContainer = styled.div`
  display: flex;

  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`
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
`
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
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`
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
`
