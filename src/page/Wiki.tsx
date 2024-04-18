import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you
import { useEffect, useState } from "react";
import { Flex, Image, List, Modal, Typography } from "antd";
import "./style.css";
import { CaretRightOutlined } from "@ant-design/icons";
import { CopyBlock, googlecode } from "react-code-blocks";

const data = [
    {
        title: `Лекции по курсу "Теория управления" I.`,
        author: "Леонов Г.А.",
        link: "https://math.spbu.ru/user/leonov/publications/control_theory/control_theory.pdf",
    },
    {
        title: `Задача Андронова-Вышнеградского о регуляторе Уатта и      гипотеза Калмана о глобальной устойчивости 
        Кузнецов`,
        author: "Н.В, Акимова Е.Д, Андриевский Б.Р, Мокаев Р.Н",
        link: "https://www.sciencedirect.com/science/article/pii/S2405896323013162",
    },
];
const TextMd = ({ ...props }) => {
    return (
        <Markdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                p(props) {
                    return <span> {props.children} </span>;
                },
            }}
        >
            {props.children}
        </Markdown>
    );
};
export const Wiki = () => {
    const navigate = useNavigate();
    // @ts-ignore
    const [markdown, setMarkdown] = useState("");
    const [isCodeOpen, setIsCodeOpen] = useState(false);
    const [isLiteratureOpen, setIsLiteratureOpen] = useState(false);
    const [selectImg, setSelectImg] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenModal2, setIsOpenModal2] = useState(false);

    const handleCancel = () => {
        setIsOpenModal(false);
        setIsOpenModal2(false);
    };

    const handleSelectImg = () => {
        setSelectImg(true);
        setTimeout(() => {
            setSelectImg(false);
        }, 1000);
    };
    const systemMarkdown =
        "```math\n\\begin{gathered}\n\\\\\n y=\\frac{F_0}{J} \\Delta x, \\quad z=\\frac{F_0}{J}(\\Delta x)^{\\bullet}, \\quad a=\\frac{\\alpha}{m}, \\quad b=\\frac{\\gamma_0}{m}, \\\\\n \\varphi(\\omega)=\\frac{\\left(-F_0\\right)}{m J}\\left(\\beta m r \\omega^2-\\gamma_0 x_0\\right) . \\\\\n\\begin{cases}\n\\dot{\\omega}=y \\\\\n\\dot{y}=z \\\\\n\\dot{z}=-a z-b y-\\varphi(\\omega),\n\\end{cases}\\\\\nгде ~ \\gamma - жесткость ~пружины, m - масса ~ грузов,  \\varphi(\\omega) -затухающий ~коэффициент, \\\\\na - коэффициент~ силы ~трения, J - момент ~инерции, F_0 - внешние~ силы\n\\end{gathered}\n```\n";
    
    //@ts-ignore
    const codeMarkdown =
        "```\nconst wattGovernor = (\n    variables: [number, number, number], t: number, a: number, b: number,\n    F0: number, m: number, J: number, beta: number, r: number, gamma0: number, x0: number\n): number[] => {\n    const [omega, y, z] = variables;\n    const dydt: number[] = [y, z, -a * z -b * y - (F0 / (m * J)) * (beta * m * r * omega ** 2 - gamma0 * x0)];\n    return dydt;\n};\n```";
    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0,
        },
        enter: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
            },
        },
        exit: {
            opacity: 0,
            scale: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut",
            },
        },
    };
    useEffect(() => {
        localStorage.setItem("markdown", markdown!);
    }, [markdown]);
    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
                navigate("/main");
            }}
        >
            <ContentContainer
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <Typography.Text style={{ fontSize: 18, fontWeight: 400 }}>
                    <Typography.Title level={1}>
                        {" "}
                        <b>Теория</b>{" "}
                    </Typography.Title>
                    <ImgContainer $back={selectImg}>
                        <Flex vertical gap={30}>
                            <figure>
                                <img
                                    src="/watt_photo.jpg"
                                    width={355}
                                    height={470}
                                />
                                <figcaption
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Typography.Text type="secondary">
                                        Рис 1. Джеймс Уатт (19 января 1736 - 19
                                        августа 1819)
                                    </Typography.Text>
                                </figcaption>
                            </figure>
                        </Flex>
                    </ImgContainer>
                    <p>
                        Ругелятор Уатта — это механическое устройство,
                        разработанное Джеймсом Уаттом в 1788 году для
                        обеспечения постоянной угловой скорости вращения вала
                        некоторой машины (классической паровой машины, паровой
                        или гидравлической турбины, дизельной установки т. д.).
                        Этот регулятор был важной частью первых паровых машин и
                        является одним из ключевых изобретений индустриальной
                        эпохи.
                    </p>
                    <p>
                        <Typography.Title level={4}>
                            <b>Историческая справка</b>
                        </Typography.Title>
                        Джеймс Уатт, он же Ватт (19 января 1736 - 19 августа
                        1819) - шотландский инженер, механик, изобретатель. Член
                        Эдинбургского королевского общества, член Лондонского
                        королевского общества, избранный член, а затем и
                        корреспондент Парижской академии наук. В подростковом
                        возрасте Уатт заинтересовался астрономией, химией, любил
                        работать столярными инструментами, мастерить разные
                        вместе с отцом механизмы и устройства. В возрасте 18 лет
                        решил заняться изготовлением измерительных приборов, для
                        чего на год отправился учиться в Лондон. Однако
                        проучившись всего год из-за слабого финансового
                        положения семьи вернулся домой стал заниматься созданием
                        и починкой октантов, параллельных линеек, барометров,
                        телескопов и прочих инструментов. По воле случая смог
                        устроиться на работу в Университет Глазго, где уже там в
                        последствии смог открыть свою мастерскую. <br />
                        Стоит отметить, что паровая машина, как таковая,
                        существовала и до Уатта. Сам принцип использования пара
                        для совершения полезной работы был предложен ещё Героном
                        Александрийским в I веке н.э. В XVIII веке была
                        распространена{" "}
                        <i
                            style={{
                                color: "#1677ff",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setIsOpenModal2(true);
                            }}
                        >
                            паровая машина Ньюкомена
                        </i>
                        , которую применяли большей частью для откачки воды из
                        шахт.
                        <br />
                        Однако, по наблюдениям Уатта, в паровой машине Ньюкомена
                        при каждом цикле пар должен нагревать цилиндр, так как
                        перед этим в цилиндр поступала холодная вода, чтобы
                        сконденсировать часть пара для уменьшения давления.
                        Таким образом, энергия пара тратилась на постоянный
                        разогрев цилиндра, вместо того, чтобы быть
                        преобразованной в механическую энергию. А в итоге был
                        создан паровой двигатель, который по праву можно было
                        назвать{" "}
                        <i
                            style={{
                                color: "#1677ff",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setIsOpenModal(true);
                            }}
                        >
                            паровой машиной Уатта
                        </i>
                        .
                    </p>
                    <Modal
                        open={isOpenModal}
                        closeIcon={false}
                        footer={<></>}
                        onCancel={handleCancel}
                    >
                        <Image src="/orig.gif"></Image>
                        <Typography.Text type="secondary">
                            Фото с сайта
                            ru.pinterest.com/pin/339740365634385799/
                        </Typography.Text>
                    </Modal>
                    <Modal
                        open={isOpenModal2}
                        closeIcon={false}
                        footer={<></>}
                        onCancel={handleCancel}
                        width={"max-content"}
                    >
                        <Image src="/watt9.gif"></Image>
                        <br></br>
                        <Typography.Text type="secondary">
                            www.critical.ru/calendar/1901watt.htm
                        </Typography.Text>
                    </Modal>
                    <p>
                        <Typography.Title level={4}>
                            <b>Основной принцип</b>
                        </Typography.Title>
                        <ImgContainer $back={selectImg}>
                            <figure style={{ position: "relative" }}>
                                <img src="/watt.png" height={570} />
                                <figcaption
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Typography.Text type="secondary">
                                        Рис 2. Наведите мышкой на элементы
                                    </Typography.Text>
                                </figcaption>
                                <ShortModal $top={"90px"} $left={"50%"}>
                                    <span
                                        style={{
                                            fontWeight: 500,
                                        }}
                                    >
                                        Ползун
                                    </span>
                                    <br />
                                    Соединяется с массами <br />
                                    для вертикального движения
                                </ShortModal>
                                <ShortModal $top={"80%"} $left={"20%"}>
                                    <span
                                        style={{
                                            fontWeight: 500,
                                        }}
                                    >
                                        Шкив
                                    </span>
                                    <br />
                                    Соединяет установку с валом машины
                                </ShortModal>
                                <ShortModal $top={"66%"} $left={"28%"}>
                                    <span
                                        style={{
                                            fontWeight: 500,
                                        }}
                                    >
                                        Массы
                                    </span>
                                    <br />
                                    Необходима для уравновешивания <br />
                                    центробежной силы
                                </ShortModal>
                                <ShortModal $top={"0px"} $left={"50%"}>
                                    <span
                                        style={{
                                            fontWeight: 500,
                                        }}
                                    >
                                        Рычач
                                    </span>
                                    <br />
                                    Связывается с заслонкой <br />
                                    паровой машины
                                </ShortModal>
                            </figure>
                        </ImgContainer>
                        Регулятор использует центробежные силы, создаваемые
                        вращением, для регулирования работы двигателя.
                    </p>
                    <p>
                        <Typography.Title level={4}>
                            <b>Строение</b>
                        </Typography.Title>
                        Регулятор Уатта{" "}
                        <Typography.Text
                            type="secondary"
                            onClick={handleSelectImg}
                            style={{
                                cursor: "pointer",
                            }}
                        >
                            (см. рис 2)
                        </Typography.Text>
                        , который приводится во вращение от вала машины через
                        шкив
                        <sup
                            style={{
                                fontSize: "small",
                            }}
                        >
                            [1]
                        </sup>
                        . В его механизме присутствуют два массивных шара
                        <sup
                            style={{
                                fontSize: "small",
                            }}
                        >
                            [2]
                        </sup>
                        , соединенных с ползуном
                        <sup
                            style={{
                                fontSize: "small",
                            }}
                        >
                            [3]
                        </sup>
                        , который в свою очередь связан рычагом
                        <sup
                            style={{
                                fontSize: "small",
                            }}
                        >
                            [4]
                        </sup>{" "}
                        с заслонкой машины.
                    </p>

                    <p>
                        <Typography.Title level={4}>
                            <b>Действие</b>
                        </Typography.Title>
                        Центробежная сила,<TextMd>$\omega$</TextMd> возникающая
                        при вращении шаров, уравновешивается их весом{" "}
                        <TextMd>$m$</TextMd> таким образом, что каждому значению
                        скорости соответствует определенное положение ползуна, а
                        следовательно, и расхода или давления пара в цилиндре. В
                        дальнейшем для улучшения регулировки такой элемент
                        оснащался пружиной жесткостью <TextMd>$\gamma$</TextMd>,
                        компенсирующей вес шаров. При увеличении момента
                        нагрузки <TextMd>$J$</TextMd> скорость машины слегка
                        падает, поскольку для увеличения давления пара заслонка
                        должна быть приоткрыта, что достигается движением
                        ползуна вниз, т. е. опусканием грузов. Такой способ
                        регулирования носит название отрицательной обратной
                        связи. Возникающая при этом ошибка регулирования
                        скорости была названа неравномерностью регулятора, а все
                        регуляторы такого типа назывались модераторами, т. е.
                        устройствами, которые не устраняют ошибку регулирования,
                        а только ее снижают. Современное название ошибки —
                        статическая ошибка, а регулятора — статический
                        регулятор.
                    </p>

                    <p>
                        <Typography.Title level={4}>
                            {" "}
                            <b>Уравнения описывающие систему: </b>{" "}
                        </Typography.Title>
                    </p>
                </Typography.Text>

                <Markdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {systemMarkdown}
                </Markdown>
                <Typography.Title
                    level={4}
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsCodeOpen(!isCodeOpen)}
                >
                    <CaretRightOutlined
                        style={{
                            transition: "transform 0.3s ease-out",
                            transform: `rotate(${isCodeOpen ? "90deg" : "0"})`,
                        }}
                    />
                    <b>Приложение</b>{" "}
                </Typography.Title>
                <CodeBlock
                    $open={isCodeOpen}
                    style={{
                        margin: "auto",
                    }}
                >
                    <CopyBlock
                        language={"ts"}
                        text={
                            "const wattGovernor = (\n    variables: [number, number, number], t: number, a: number, b: number,\n    F0: number, m: number, J: number, beta: number, r: number, gamma0: number, x0: number\n): number[] => {\n    const [omega, y, z] = variables;\n    const dydt: number[] = [y, z, -a * z -b * y - (F0 / (m * J)) * (beta * m * r * omega ** 2 - gamma0 * x0)];\n    return dydt;\n};\n"
                        }
                        showLineNumbers={false}
                        theme={googlecode}
                        // wrapLines={true}
                        codeBlock
                    />
                </CodeBlock>
                <Typography.Title
                    level={4}
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsLiteratureOpen(!isLiteratureOpen)}
                >
                    <CaretRightOutlined
                        style={{
                            transition: "transform 0.3s ease-out",
                            transform: `rotate(${
                                isLiteratureOpen ? "90deg" : "0"
                            })`,
                        }}
                    />
                    <b>Литература</b>
                </Typography.Title>
                <CodeBlock $open={isLiteratureOpen}>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item, index) => (
                            <List.Item
                                key={index}
                                style={{ marginLeft: "20px" }}
                            >
                                <Flex style={{ width: "100%" }} gap={4}>
                                    <div>— </div>
                                    <List.Item.Meta
                                        title={
                                            <a href={item.link} target="_blank">
                                                {item.title}
                                            </a>
                                        }
                                        description={item.author}
                                    />
                                </Flex>
                            </List.Item>
                        )}
                    />
                </CodeBlock>
                {/* <Markdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {markdown}
                </Markdown>
                <TextArea
                    placeholder="enter some text"
                    onChange={(e) => setMarkdown(e.target.value)}
                    defaultValue={markdown!}
                    autoSize={{ minRows: 15 }}
                /> */}
            </ContentContainer>
        </Container>
    );
};

const Container = styled(motion.div)`
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: #0000009e;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    overflow-x: hidden;
    padding: 2vw 0;
    font-family: var(--font);
    font-weight: 600;
    @media (max-width: 620px) {
        padding: 0px;
    }
`;

const ContentContainer = styled(motion.div)`
    background-color: white;
    border-radius: 20px;
    margin: auto auto;
    padding: 30px 55px;
    width: 80%;

    @media (max-width: 620px) {
        padding: 6vw 6vw;
        width: 100%;
        min-height: 100vh;
        height: max-content;
        border-radius: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;
const CodeBlock = styled.div<{ $open: boolean }>`
    height: auto;
    max-height: ${(props) => (props.$open ? "1000px" : 0)};
    transition: max-height
        ${(props) => (props.$open ? " 0.8s ease-in-out" : " 0.5s ease-out")};
    overflow: hidden;
    font-family: "JetBrains Mono", monospace;
    font-weight: 400;
`;

const ImgContainer = styled.div<{ $back: boolean }>`
    width: max-content;
    height: max-content;
    float: right;
    position: relative;
    padding: 10px;
    border-radius: 20px;
    transition: background-color 0.5s linear;
    background-color: ${(props) => (props.$back ? "#39bdf122" : "transparent")};
`;
const ShortModal = styled.div<{ $top: string; $left: string }>`
    width: max-content;
    height: max-content;
    padding: 5px 10px;
    position: absolute;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.4);
    top: ${(props) => props.$top};
    left: ${(props) => props.$left};
    opacity: 0;
    font-size: 14px;
    transition: opacity 0.3s;
    &:hover {
        opacity: 1;
    }
`;
