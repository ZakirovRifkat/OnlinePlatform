import styled from "styled-components";
import { Container } from "../container";

export const Header = () => {
    return (
        <HeaderContainer>
            <Container></Container>
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
    width: 100%;
    height: 64px;
    background: rgba(69, 69, 69, 0.9);
`;
