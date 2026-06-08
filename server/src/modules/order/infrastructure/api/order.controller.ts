import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { OrderStatus } from '@prisma/client';

import { IReqUser } from '@/common/types';
import { CreateOrderRequest } from '@order/application/dto/requests/create-order.request';
import { OrderResponse } from '@order/application/dto/responses/order.response';
import { OrderService } from '@order/application/services/order.service';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order from active space bundle items' })
  @ApiOkResponse({ type: OrderResponse })
  @Post()
  create(
    @Req() { user }: { user: IReqUser },
    @Body() dto: CreateOrderRequest,
  ) {
    return this.orderService.create(user, dto);
  }

  @ApiOperation({ summary: 'Get current user placed orders' })
  @SkipThrottle()
  @Get('my')
  findMy(@Req() { user }: { user: IReqUser }) {
    return this.orderService.findAllByUser(user);
  }

  @ApiOperation({ summary: 'Get orders received by the supplier' })
  @SkipThrottle()
  @Get('received')
  findReceived(@Req() { user }: { user: IReqUser }) {
    return this.orderService.findReceivedOrders(user);
  }

  @ApiOperation({ summary: 'Get details of a single order or sub-order' })
  @SkipThrottle()
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() { user }: { user: IReqUser },
  ) {
    return this.orderService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update status of order or sub-order' })
  @SkipThrottle()
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Req() { user }: { user: IReqUser },
  ) {
    return this.orderService.updateStatus(id, status, user);
  }
}
