/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ActionLogger {
  constructor(private prisma: PrismaService) {}

  async logAction(
    { referenceId, refereceType, action, context, description, additionalInfo },
    issuerId,
  ) {
    try {
      // await this.prisma.actionLogs
      //   .create({
      //     data: {
      //       referenceId,
      //       refereceType,
      //       action,
      //       context,
      //       description,
      //       additionalInfo,
      //       issuerId,
      //     },
      //   })
      //   .then(() => {
      //     console.log(
      //       '--------------------------Action logged successfully--------------------------',
      //     );
      //   });
    } catch (error) {
      console.log(
        '--------------------------Action not logged--------------------------',
      );
      console.log('Error: ', error);
    }
  }
}
