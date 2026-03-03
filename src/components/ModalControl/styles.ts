import styled from "styled-components";

export const Container = styled.div<{ $shadow?: boolean }>`
    width: max-content;
    height: max-content;
    box-shadow: ${(props) =>
        props.$shadow ? "" : "0px 0px 8px 2px rgba(0, 0, 0, 0.2)"};
    border-radius: 20px;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 5%;
    transform: translate(0%, -50%);
`;
