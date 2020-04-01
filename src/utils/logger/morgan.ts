'use strict';

import morgan, { Options } from 'morgan';
import * as winston from './winston';
import { Request, Response, NextFunction } from 'express';

export const stderrStream = (req: Request, res: Response, next: NextFunction) => {
  morgan('combined', {
    skip() {
      /* istanbul ignore next line */
      return res.statusCode < 400;
    },
    stream: winston.stream.stderr,
  });
  next();
};

export const stdoutStream = (req: Request, res: Response, next: NextFunction) => {
  morgan('combined', {
    skip() {
      /* istanbul ignore next line */
      return res.statusCode >= 400;
    },
    stream: winston.stream.stdout,
  });
  next();
};
