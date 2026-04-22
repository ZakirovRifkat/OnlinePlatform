import { createContext, useContext } from "react";
import { ContentUiStore } from "./contentUiStore";
import { ServoStore } from "./servoStore";

export class ContentRootStore {
    ui: ContentUiStore;
    servo: ServoStore;

    constructor() {
        this.ui = new ContentUiStore();
        this.servo = new ServoStore();
    }
}

export const createContentStore = () => new ContentRootStore();

export const ContentStoreContext = createContext<ContentRootStore | null>(null);

export const useContentStore = () => {
    const store = useContext(ContentStoreContext);

    if (!store) {
        throw new Error(
            "useContentStore must be used within ContentStoreContext.Provider",
        );
    }

    return store;
};

export const useContentUiStore = () => useContentStore().ui;

export const useServoStore = () => useContentStore().servo;
