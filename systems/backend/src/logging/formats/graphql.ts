import type { GqlExecutionContext } from '@nestjs/graphql';
import { pick } from 'ramda';

export function graphql(ctx: GqlExecutionContext) {
  const { args, info, root } = {
    args: ctx.getArgs(),
    info: ctx.getInfo(),
    root: ctx.getRoot(),
  };
  return { args, info: pick(['fieldName', 'path', 'operation'])(info), root };
}
