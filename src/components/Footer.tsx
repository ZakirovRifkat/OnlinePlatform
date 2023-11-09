import { styled } from "styled-components";

export const Footer = () => {
    return (
        <Container>
            © Кафедра прикладной кибернетики СПБГУ, 2019-2023.
        </Container>
    );
};
const Container = styled.div`
    width: 100%;
    background: #454545;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;

    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: 0.48px;
`;
