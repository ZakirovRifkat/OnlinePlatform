import { styled } from "styled-components";

export const Info = () => {
    return (
        <Container>
            <Title>Интерактивная модель регулятора Уатта</Title>
            <InformationContainer>
                <InformationContent>
                    <InformationSubtitle>
                        Информационная составляющая
                    </InformationSubtitle>
                    <InformationText>
                        Центробежный чувствительный элемент, являющийся
                        измерителем скорости машины, был заимствован Уаттом из
                        водяных и ветряных мельниц, где он использовался для
                        изменения усилия прижима жерновов при изменении скорости
                        ветра. Его устройство было запатентовано механиком
                        Томасом Мидом (Thomas Mead) в 1787 г. [5, 6]. Рис. 4.
                        Центробежный чувствительный элемент Уатта (1 — шкив; 2 —
                        шары; 3 — ползун; 4 — рычаг) Центробежный чувствительный
                        элемент Уатта (рис. 4), приводимый во вращение от вала
                        машины через шкив 1, содержит два массивных шара 2,
                        соединенных с ползуном 3, связанным рычагом 4 с
                        заслонкой паровой машины [7]. Центробежная сила,
                        возникающая при вращении шаров, уравновешивается их
                        весом таким образом, что каждому значению скорости
                        соответствует определенное положение ползуна, а
                        следовательно, и расхода или давления пара в цилиндре. В
                        дальнейшем для улучшения регулировки такой элемент
                        оснащался пружиной, компенсирующей вес шаров.
                    </InformationText>
                </InformationContent>
                <InformationImg src="/watt.png"></InformationImg>
            </InformationContainer>
        </Container>
    );
};
const Container = styled.div`
    width: var(--container);
    max-width: var(--max-container);
    margin: auto;
    display: flex;
    flex-direction: column;
`;
const Title = styled.div`
    color: rgba(0, 0, 0, 0.8);
    text-align: center;
    font-size: 36px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
    letter-spacing: 0.72px;
`;
const InformationContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 55px;
    gap: 12vw;
`;
const InformationContent = styled.div`
    width: 55%;
    display: flex;
    flex-direction: column;
    gap: 40px;
`;
const InformationSubtitle = styled.div`
    width: 100%;
    color: rgba(0, 0, 0, 0.8);

    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: 144.523%;
    letter-spacing: 0.52px;
`;
const InformationText = styled.div`
    color: rgba(0, 0, 0, 0.8);

    text-align: justify;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: 0.4px;
`;
const InformationImg = styled.img`
    background-image: url("");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    /* width: 100%;
    height: 500px; */
`;
