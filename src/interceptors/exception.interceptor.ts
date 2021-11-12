// import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException, Logger } from '@nestjs/common';
// import { Response } from 'express';
// import Exception from '../shared/exceptions/exception';
// import RequestException from '../shared/exceptions/request.exception';
// import CustomLogger from '../shared/general/logger';

// interface IResponse {
//     code?: number;
//     data?: unknown;
//     message: string;
// }

// @Catch(Error)
// export default class ExceptionInterceptor implements ExceptionFilter {
//     private readonly logger = new Logger(ExceptionInterceptor.name);

//     catch(error: Error, host: ArgumentsHost): Response<IResponse> {
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>();

//         if (error instanceof RequestException) {
//             return response.status(error.getStatus()).json({
//                 code: error.code,
//                 message: error.message,
//                 data: error.data,
//             });
//         }

//         if (error instanceof Exception) {
//             return response.status(HttpStatus.BAD_REQUEST).json({
//                 code: error.code,
//                 message: error.message,
//                 data: error.data,
//             });
//         }

//         if (error instanceof HttpException) {
//             return response.status(error.getStatus()).json({
//                 message: error.message,
//                 response: error.getResponse(),
//             });
//         }

//         this.logger.error('Unexpected error', error);

//         return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//             message: 'Unexpected error',
//         });
//     }
// }
