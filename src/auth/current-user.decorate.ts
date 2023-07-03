import { ExecutionContext, createParamDecorator } from "@nestjs/common";

// 根据请求的token里的jwt,提取user信息并存入上下文
export const CurrentUser = createParamDecorator(
    // 上下文的user是策略类(strategy)的validate()提供的
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request.user ?? null
    }
)