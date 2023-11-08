import styled from "styled-components";

export const Header = () => {
    return (
        <HeaderContainer>
            <Container>
                <HeaderImg src={"/image1.png"} />
                <HeaderTitle>
                    КАФЕДРА ПРИКЛАДНОЙ КИБЕРНЕТИКИ <br />
                    Санкт-Петербургский государственный университет
                    <br /> Математико-механический факультет
                </HeaderTitle>
                <HeaderImg src={"/image2.png"} />
            </Container>
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
    width: 100%;
    height: max-content;
    padding: 10px 0;
    background: #454545;
`;

const Container = styled.div`
    width: var(--container);
    max-width: var(--max-container);
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const HeaderImg = styled.img`
    height: 120px;
    width: auto;
`;
const HeaderTitle = styled.div`
    width: max-content;
    color: #fff;

    text-align: center;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
    letter-spacing: 0.48px;
`;
