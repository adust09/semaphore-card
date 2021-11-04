import { Web2Provider } from "@interrep/reputation-criteria"
import Cors from "cors"
import { NextApiRequest, NextApiResponse } from "next"
import config from "src/config"
import { Web3Provider } from "src/types/groups"
import apiMiddleware from "src/utils/backend/apiMiddleware"
import logger from "src/utils/backend/logger"

