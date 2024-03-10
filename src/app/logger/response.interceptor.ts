import { NextFunction, Request, Response } from "express";
import { httpLogger } from "./logger.service";
import formatHTTPLoggerResponse from "../../utils/format-http-logger-response";

enum HTTPMethods {
  HEAD = "HEAD",
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

enum SuccessMessages {
  CreateSuccess = "Resource created successfully",
  GetSuccess = "Resource retrieved successfully",
  UpdateSuccess = "Resource updated successfully",
  DeleteSuccess = "Resource deleted successfully",
  GenericSuccess = "Operation completed successfully",
  UserRemoveSuccess = "User removed!",
  ProductRemoveSuccess = "Product removed!",
}

// This middleware is called before sending response to the client
// It is used as a central place for logging and formating response message
const responseInterceptor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // used to calculate time between request and the response
  const requestStartTime = Date.now();

  // Save the original response method
  const originalSend = res.send;

  // Create a flag to track whether the response has been sent
  let responseSent = false;

  // Override the response method
  res.send = function (body: any): Response {
    // Log the response body or any other data you want to track
    // responseSent is used to block the same request from been sent twice
    if (!responseSent) {
      if (res.statusCode < 400) {
        httpLogger.info(
          getResponseMessage(req.method),
          formatHTTPLoggerResponse(req, res, body, requestStartTime)
        );
      } else {
        httpLogger.error(
          body.message,
          formatHTTPLoggerResponse(req, res, body, requestStartTime)
        );
      }

      responseSent = true;
    }

    // Call the original response method
    return originalSend.call(this, body);
  };

  // Continue processing the request
  next();
};

export default responseInterceptor;

function getResponseMessage(responseMethod: HTTPMethods | string): string {
  switch (responseMethod) {
    case HTTPMethods.POST:
      return SuccessMessages.CreateSuccess;
    case HTTPMethods.GET:
      return SuccessMessages.GetSuccess;
    case HTTPMethods.PUT || HTTPMethods.PATCH:
      return SuccessMessages.UpdateSuccess;
    case HTTPMethods.DELETE:
      return SuccessMessages.DeleteSuccess;
    default:
      return SuccessMessages.GenericSuccess;
  }
}
