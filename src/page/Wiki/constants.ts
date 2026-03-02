import type { LiteratureItem } from "./types";

export const LITERATURE_DATA: LiteratureItem[] = [
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

export const SELECT_IMG_HIGHLIGHT_TIMEOUT = 1000;

export const SYSTEM_MARKDOWN =
    "```math\n\\begin{gathered}\n\\\\\n y=\\frac{F_0}{J} \\Delta x, \\quad z=\\frac{F_0}{J}(\\Delta x)^{\\bullet}, \\quad a=\\frac{\\alpha}{m}, \\quad b=\\frac{\\gamma_0}{m}, \\\\\n \\varphi(\\omega)=\\frac{\\left(-F_0\\right)}{m J}\\left(\\beta m r \\omega^2-\\gamma_0 x_0\\right) . \\\\\n\\begin{cases}\n\\dot{\\omega}=y \\\\\n\\dot{y}=z \\\\\n\\dot{z}=-a z-b y-\\varphi(\\omega),\n\\end{cases}\\\\\nгде ~ \\gamma - жесткость ~пружины, m - масса ~ грузов,  \\varphi(\\omega) -затухающий ~коэффициент, \\\\\na - коэффициент~ силы ~трения, J - момент ~инерции, F_0 - внешние~ силы\n\\end{gathered}\n```\n";

export const CODE_MARKDOWN =
    "const wattGovernor = (\n    variables: [number, number, number], t: number, a: number, b: number,\n    F0: number, m: number, J: number, beta: number, r: number, gamma0: number, x0: number\n): number[] => {\n    const [omega, y, z] = variables;\n    const dydt: number[] = [y, z, -a * z -b * y - (F0 / (m * J)) * (beta * m * r * omega ** 2 - gamma0 * x0)];\n    return dydt;\n};\n";

export const WIKI_PAGE_VARIANTS = {
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
