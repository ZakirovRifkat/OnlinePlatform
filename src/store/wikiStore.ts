import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

export class WikiStore {
    isCodeOpen = false;
    isLiteratureOpen = false;
    selectImg = false;
    isOpenModal = false;
    isOpenModal2 = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setCodeOpen(value: boolean) {
        this.isCodeOpen = value;
    }

    setLiteratureOpen(value: boolean) {
        this.isLiteratureOpen = value;
    }

    toggleCodeOpen() {
        this.setCodeOpen(!this.isCodeOpen);
    }

    toggleLiteratureOpen() {
        this.setLiteratureOpen(!this.isLiteratureOpen);
    }

    openWattModal() {
        this.isOpenModal = true;
    }

    openNewcomenModal() {
        this.isOpenModal2 = true;
    }

    closeModals() {
        this.isOpenModal = false;
        this.isOpenModal2 = false;
    }

    setSelectImg(value: boolean) {
        this.selectImg = value;
    }

    highlightImage(timeoutMs: number) {
        this.setSelectImg(true);
        setTimeout(() => {
            this.setSelectImg(false);
        }, timeoutMs);
    }
}

export const createWikiStore = () => new WikiStore();

export const WikiStoreContext = createContext<WikiStore | null>(null);

export const useWikiStore = () => {
    const store = useContext(WikiStoreContext);

    if (!store) {
        throw new Error(
            "useWikiStore must be used within WikiStoreContext.Provider",
        );
    }

    return store;
};
