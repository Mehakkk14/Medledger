import express from 'express';

declare global {
  namespace Express {
    interface Request {
      files?: any;
    }
  }
}

export {};
