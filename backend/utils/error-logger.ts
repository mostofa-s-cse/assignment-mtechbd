import { Injectable } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ErrorLogger {
  constructor(private prisma: PrismaService) {}
  async errorlogger({ errorMessage, errorStack, context }) {
    if (errorStack instanceof PrismaClientKnownRequestError) {
      console.error({
        errorMessage,
        errorStack: errorStack.message,
        context,
      });
      // await this.prisma.errorLogs.create({
      //   data: {
      //     errorMessage,
      //     errorStack: errorStack.message,
      //     context,
      //   },
      // });

      errorStack = errorStack.message;
    } else if (errorStack instanceof PrismaClientUnknownRequestError) {
      console.error({
        errorMessage,
        errorStack: errorStack.message,
        context,
      });
      // await this.prisma.errorLogs.create({
      //   data: {
      //     errorMessage,
      //     errorStack: errorStack.message,
      //     context,
      //   },
      // });

      errorStack = errorStack.message;
    } else {
      console.error({
        errorMessage,
        errorStack,
        context,
      });
      // await this.prisma.errorLogs.create({
      //   data: {
      //     errorMessage,
      //     errorStack: JSON.stringify(errorStack),
      //     context,
      //   },
      // });
    }

    return {
      status: 500,
      message: errorMessage,
      error: errorStack,
      context: context,
    };
  }
}
