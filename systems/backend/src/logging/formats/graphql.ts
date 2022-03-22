import type { GqlExecutionContext } from '@nestjs/graphql';

export function graphql(ctx: GqlExecutionContext) {
  const { args, context, info, root } = {
    args: ctx.getArgs(),
    context: ctx.getContext(),
    info: ctx.getInfo(),
    root: ctx.getRoot(),
  };
  return { args, context, info, root };
}
