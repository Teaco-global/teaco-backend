import express from "express"
import { Database, baseUrl, port } from "./config";
import morgan from "morgan"
import { ProxyRouter } from "./api/routes";
import cors from "cors"

let corsOptions = {
    origin : ['http://localhost:5173'],
 }
class Server {
    private app: express.Application
    constructor() {
        this.app = express()
        this.configuration()
    }

    private configuration(){
        this.app.use(cors(corsOptions))
        this.app.use(express.json());
        this.app.use(morgan("dev"));
        this.app.use('/teaco/api/v1', ProxyRouter.map())
    }

    private async connect() {
        try {
            await Database.connection()
        } catch (error: any) {
            throw new Error(error)
        }
    }

    public start() {
        this.connect()
        this.app.listen(port, () => {
            console.info(`Server started at ${baseUrl}:${port}`);
        })
    }
}

const server = new Server()
server.start()
