import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(
    userId: string,
    { magazineId, startDate, endDate, cancelled }: CreateSubscriptionDto,
  ) {
    const subscription = await this.subscriptionsRepository.save({
      userId,
      magazineId,
      startDate,
      endDate,
      cancelled,
    });

    return subscription;
  }

  async update(
    subscriptionId: string,
    { startDate, endDate, cancelled }: UpdateSubscriptionDto,
  ) {

    const currentsubscription = await this.subscriptionsRepository.findOneOrFail({
      where: { id: subscriptionId },
    });

    currentsubscription.startDate = startDate;
    currentsubscription.endDate = endDate;
    currentsubscription.cancelled = cancelled;

    return this.subscriptionsRepository.save(currentsubscription).catch(() => {
      throw new NotFoundException('No subscription found');
    });
  }

  async findById(subscriptionId: string) {

    const subscription = await this.subscriptionsRepository.find({
      where: { id: subscriptionId },
      order: { createdAt: 'DESC' },
    });

    const [subscriptionData] = await Promise.all([subscription]);

    const subscriptionsWithData = await Promise.all(
      subscriptionData.map(async (subscription) => {

        const { id, userId, magazineId, startDate, endDate, cancelled, createdAt, updatedAt } = subscription;

        return {
          id,
          userId,
          magazineId,
          startDate,
          endDate,
          cancelled,
          createdAt,
          updatedAt,
        };
      }),
    );

    return {
      data: subscriptionsWithData,
    };
  }

  async findByUserId(userId: string) {

    const subscriptions = await this.subscriptionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const [subscriptionData] = await Promise.all([subscriptions]);

    const subscriptionsWithData = await Promise.all(
      subscriptionData.map(async (subscription) => {

        const { id, userId, magazineId, startDate, endDate, cancelled, createdAt, updatedAt } = subscription;

        return {
          id,
          userId,
          magazineId,
          startDate,
          endDate,
          cancelled,
          createdAt,
          updatedAt,
        };
      }),
    );

    return {
      data: subscriptionsWithData,
    };
  }

  async findAll() {
    return this.subscriptionsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async deleteById(
    subscriptionId: string,
  ): Promise<{ message: string }> {
    try {

      const subscription = await this.subscriptionsRepository.findOne({
        where: { id: subscriptionId },
      });

      if (!subscription) {
        throw new NotFoundException('Failed: subscription not found');
      }

      await this.subscriptionsRepository.remove(subscription);

      return { message: 'Delete Successful' };
    } catch (error) {
      throw new NotFoundException('Failed');
    }
  }
}
