import React, {useState ,useEffect} from "react";
import { GovernorModel } from "../components/GovernorModel";
import styled from "styled-components";

export const Main = () => {
    const [fontSize, setFontSize] = useState(70);
    const [heightCon, setHeightCon] = useState(100);
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY || window.pageYOffset;
            setFontSize(80 - scrollPosition * 0.05);
            setHeightCon(100 - scrollPosition * 0.09)
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <Container>
            <GovernorModel />
            <ContainerTitleMainBanner heightCont={`${heightCon}vh`}>
            <TitleMainBanner fontSize={`${fontSize}px`}>Интерактивная онлайн лаборатория</TitleMainBanner>
            </ContainerTitleMainBanner>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    height: calc(100vh + 1000px);
`;
const TitleMainBanner = styled.p<{fontSize:string}>`
    width: max-content;
    height: max-content;
    color:red;
    font-size: ${(props)=>props.fontSize};
    z-index: 2;
    user-select: none;
    position: sticky;
    top:30px;
`
const ContainerTitleMainBanner = styled.div<{heightCont:string}>`
    width: 100%;
    height: ${(props)=>props.heightCont};
    z-index: 2;
    user-select: none;
    position: fixed;
    top:0;
    display: flex;
    justify-content: center;
    align-items: center;
`