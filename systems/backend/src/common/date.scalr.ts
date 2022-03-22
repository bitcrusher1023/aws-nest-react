import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { DateTime } from 'luxon';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: unknown): Date {
    return new Date(value as number); // value from the client
  }

  serialize(value: unknown): string {
    return DateTime.fromJSDate(value as Date).toISODate(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return DateTime.fromISO(ast.value as string).toJSDate();
    }
    // @ts-except-error default return null from NestJS Example
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return null;
  }
}
