import React, {useState ,useEffect} from "react";
import { GovernorModel } from "../components/GovernorModel";
import styled from "styled-components";

export const Main = () => {
    const [fontSize, setFontSize] = useState(80);
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY || window.pageYOffset;
            const newFontSize = 40 - scrollPosition * 0.01; 
            setFontSize(newFontSize);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <Container>
            <GovernorModel />
            <TitleMainBanner style={{ fontSize: `${fontSize}px` }}>Hello Pidor</TitleMainBanner>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    height: calc(100vh + 1000px);
    display: flex;
    justify-content: center;
    align-items: center;
`;
const TitleMainBanner = styled.p`
    width: max-content;
    height: max-content;
    color:red;
    z-index: 2;
    user-select: none;
    position: sticky;
    top:30px;
`