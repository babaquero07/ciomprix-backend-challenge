import { Request, Response } from "express";
import IHTTPLoggerResponseData from "../app/logger/logger-response-data.model";

const formatHTTPLoggerResponse = (
  req: Request,
  res: Response,
  responseBody: any,
  requestStartTime?: number
): IHTTPLoggerResponseData => {
  let requestDuration = ".";

  if (requestStartTime) {
    const endTime = Date.now() - requestStartTime;
    requestDuration = `${endTime / 1000}s`; // ms to s
  }

  return {
    request: {
      headers: req.headers,
      host: req.headers.host,
      baseUrl: req.baseUrl,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req?.params,
      query: req?.query,
      clientIp: req?.headers["x-forwarded-for"] ?? req?.socket.remoteAddress,
    },
    response: {
      headers: res.getHeaders(),
      statusCode: res.statusCode,
      requestDuration,
      body: responseBody,
    },
  };
};

export default formatHTTPLoggerResponse;
