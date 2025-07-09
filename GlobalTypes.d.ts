declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            mongodbUrl: string;
            mongodbPass: string;
            mongodbUser: string;
            enviroment: "dev" | "prod" | "debug";
            PORT: number;
        }
    }
}

export {};