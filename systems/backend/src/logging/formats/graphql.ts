import type { GqlExecutionContext } from '@nestjs/graphql';

export function graphql(ctx: GqlExecutionContext) {
  const { args, info, root } = {
    args: ctx.getArgs(),
    info: ctx.getInfo(),
    root: ctx.getRoot(),
  };
  return { args, info, root };
}
