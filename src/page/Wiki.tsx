import { styled } from "styled-components";
export const Wiki = () => {
    return (
        <Container>
            <Icon alt={"logo"} src={"/logo.svg"} />
            <TitleMainBanner>Интерактивная онлайн–лаборатория</TitleMainBanner>
            <Footer>
                <span>
                    СПБГУ. Математико-механический факультет. Кафедра прикладной
                    кибернетики.
                </span>
                <span>Закиров Р.Э</span>
            </Footer>
        </Container>
    );
};

const Container = styled.div`
    background-image: url("/background.png");
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    min-height: 100vh;
`;

const TitleMainBanner = styled.p`
    width: max-content;
    height: max-content;
    z-index: 2;
    user-select: none;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;
    color: #52380a;
    text-transform: uppercase;
    font-weight: 700;
    font-family: var(--font);
    top: 60px;
    font-size: 45px;
`;
const Icon = styled.img`
    width: 100px;
    height: 100px;
    position: absolute;
    top: 60px;
    left: 6%;
    transform: translate(-50%, -50%);
    opacity: 1;
`;
const Footer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    padding: 0 1em;
    bottom: 0.6em;
    left: 0;
    font-family: var(--font);
    color: #00000073;
    font-size: 20px;
`;
