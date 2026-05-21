import dotenv from "dotenv";
dotenv.config();

const envVariable = [
    "API_URI",
]

plugins: [
    new webpack.EnvironmentPlugin(envVariable)
]