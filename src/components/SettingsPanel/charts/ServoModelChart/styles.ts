import { styled } from "styled-components";

export const Container = styled.div`
    width: 500px;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;

    @media screen and (max-width: 600px) {
        width: 350px;
        height: 450px;
    }
`;
