import { motion } from "framer-motion";
import styled from "styled-components";

export const Emasure = styled.div`
    text-align: end;
    width: 120px;

    @media screen and (max-width: 600px) {
        display: none;
    }
`;

export const Container = styled(motion.div)`
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

    @media screen and (max-width: 600px) {
        max-height: 460px;
        background: #ffffff;
        padding: 20px;
    }
`;

export const DataInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const Input = styled.input`
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

    @media screen and (max-width: 600px) {
        width: 135px;
    }
`;

export const InputText = styled.div`
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

        br {
            display: none;

            @media screen and (max-width: 600px) {
                display: block;
            }
        }
    }
`;
