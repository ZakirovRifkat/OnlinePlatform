import { styled } from "styled-components";

export const ExtraLinks = () => {
    return (
        <Container>
            <Title>Полезные материалы</Title>
            <CardContainer>
                <Card $src="/image4.png" />
                <Card $src="/image5.png" />
                <Card $src="/image6.png" />
            </CardContainer>
        </Container>
    );
};

const Container = styled.div`
    width: var(--container);
    max-width: var(--max-container);
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 60px;
`;
const Title = styled.div`
    color: rgba(0, 0, 0, 0.8);

    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: 144.523%; /* 37.576px */
    letter-spacing: 0.52px;
`;
const CardContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;
const Card = styled.div<{ $src: string }>`
    width: 28%;
    height: 220px;
    overflow: hidden;
    border-radius: 40px;
    cursor: pointer;

    background-image: url(${(props) => props.$src});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;
