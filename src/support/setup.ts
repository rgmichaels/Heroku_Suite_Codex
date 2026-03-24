import { setDefaultTimeout } from "@cucumber/cucumber";
import { appConfig } from "../config/config";

setDefaultTimeout(appConfig.defaultTimeoutMs);
