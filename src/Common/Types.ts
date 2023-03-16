import { Ctx } from "../Classes/Ctx";

export interface ClientOptions {
    name: string;
    prefix: Array<string>|string;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
}

export interface CommandOptions {
    name: string;
    aliases?: Array<string>;
    code: (ctx: Ctx) => Promise<any>;
}

export interface SectionsOptions {
    title: string;
    rows: SectionsRows[];
}

export interface SectionsRows {
    title: string,
    rowId: number,
    description?: string
}

export interface CollectorArgs {
    time?: number;
    max?: number;
    endReason?: string[];
    maxProcessed?: number;
    filter?: () => boolean;
}