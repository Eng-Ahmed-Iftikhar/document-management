import env from "../config/env";

const isDevEnvironment = () => env.nodeEnv === "development";

export default isDevEnvironment;
