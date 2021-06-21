#!/usr/bin/env node
import { config } from 'dotenv';
import { WinkbirdServer } from './winkbird';

config();

const server = new WinkbirdServer();
const app = server.app;
export { app };
