declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            mongodbUrl: string;
            mongodbPass: string;
            mongodbUser: string;
            enviroment: "dev" | "prod" | "debug";
            webhook: string;
            PORT: number;
        }
    }
}

export {};